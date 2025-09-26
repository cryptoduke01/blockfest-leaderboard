#!/usr/bin/env python3
"""
Scrape Blockfest-related tweets using snscrape (no API keys), then insert into Supabase 'tweets'.

Environment (.env.local at repo root):
  SUPABASE_DB_URL=postgres://...
  SUPABASE_URL=https://<project>.supabase.co
  SUPABASE_SERVICE_ROLE=service-role-key
  SCRAPE_SINCE_HOURS=24
  SCRAPE_LIMIT=200
  KEYWORDS=blockfest africa OR #blockfestafrica OR #blockfest OR blockfestafrica

Run:
  python worker/snscrape_scraper.py
"""
import os
import time
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
import requests
import psycopg2
from psycopg2.extras import execute_values

try:
    import snscrape.modules.twitter as sntwitter
except Exception as e:
    # Compatible import for environments where the module fails under Python 3.12
    sntwitter = None


# Load env from project root
load_dotenv(dotenv_path="../.env.local")

DB_URL = os.getenv("SUPABASE_DB_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_R                                                                                                                                                                        OLE")
SINCE_HOURS = int(os.getenv("SCRAPE_SINCE_HOURS", "24"))
LIMIT = int(os.getenv("SCRAPE_LIMIT", "200"))
KEYWORDS = os.getenv(
    "KEYWORDS",
    # Comprehensive Blockfest terms (aligned with scrape_blockfest.py and API scoring keywords)
    "(
      \"blockfest africa\" OR blockfestafrica OR #blockfestafrica OR #blockfest OR blockfest OR blockf3st OR b3a OR
      \"web3 africa\" OR \"blockchain africa\" OR \"africa web3\" OR \"web3 festival\" OR \"blockchain conference\" OR \"crypto festival\" OR
      buidl OR bridge OR become OR \"web3 in motion\" OR \"unlocking africa\" OR \"african builders\" OR \"african creators\" OR \"african developers\"
    )",
)
LAST_RUN_FILE = os.path.join(os.path.dirname(__file__), ".last_scrape_at")


def iso_since(hours: int) -> str:
    since_dt = datetime.now(timezone.utc) - timedelta(hours=hours)
    return since_dt.strftime("%Y-%m-%d")


def build_query() -> str:
    # Reuse existing keywords and filter out retweets, ensure English
    # snscrape uses Twitter syntax; since:YYYY-MM-DD works
    since_str = iso_since(SINCE_HOURS)
    base = f"{KEYWORDS} since:{since_str} lang:en -is:retweet"
    # Note: snscrape returns retweets in some cases; filter in-code too
    return base


def fetch_tweets(limit: int):
    query = build_query()
    print(f"Query: {query}")
    count = 0
    if not sntwitter:
        print("snscrape python module unavailable in this runtime. Skipping scrape.")
        return
    for item in sntwitter.TwitterSearchScraper(query).get_items():
        # Skip retweets
        try:
            if getattr(item, "retweetedTweet", None) is not None:
                continue
        except Exception:
            pass

        data = {
            "tweet_id": str(item.id),
            "username": f"@{item.user.username}" if item.user and item.user.username else "",
            "profile_pic": getattr(item.user, "profileImageUrl", None)
            or "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
            "text": item.rawContent if hasattr(item, "rawContent") else getattr(item, "content", ""),
            "date": item.date,
            # snscrape provides likeCount/retweetCount/replyCount/quoteCount on Tweet
            "likes": int(getattr(item, "likeCount", 0) or 0),
            "retweets": int(getattr(item, "retweetCount", 0) or 0),
            "replies": int(getattr(item, "replyCount", 0) or 0),
            "quotes": int(getattr(item, "quoteCount", 0) or 0),
            # Followers not directly available via snscrape; will try enrich via user page scrape below
            "followers": 0,
        }

        # Try to enrich followers by scraping the user's profile page lightweightly
        try:
            if data["username"].startswith("@"):
                handle = data["username"][1:]
                # Use Nitter mirror for lightweight scrape if available
                nitter_url = f"https://nitter.net/{handle}"
                r = requests.get(nitter_url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                if r.status_code == 200:
                    # crude parse for followers count
                    import re
                    m = re.search(r"([0-9,.]+)\s*Followers", r.text)
                    if m:
                        followers_text = m.group(1).replace(",", "")
                        data["followers"] = int(float(followers_text))
        except Exception:
            pass

        yield data
        count += 1
        if count >= limit:
            break


def insert_rows_via_rest(rows):
    # Prefer Supabase REST; it handles upsert on conflict
    if not (SUPABASE_URL and SUPABASE_SERVICE_KEY):
        print("Supabase REST credentials missing; skipping insert")
        return 0

    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

    inserted = 0
    for r in rows:
        payload = {
            "tweet_id": r["tweet_id"],
            "username": r["username"],
            "profile_pic": r["profile_pic"],
            "text": r["text"],
            "date": r["date"].isoformat() if hasattr(r["date"], "isoformat") else r["date"],
            "likes": r["likes"],
            "retweets": r["retweets"],
            "replies": r["replies"],
            "quotes": r["quotes"],
            "followers": r["followers"],
        }
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/tweets",
            headers=headers,
            json=payload,
            params={"on_conflict": "tweet_id"},
            timeout=30,
        )
        if resp.status_code in (200, 201, 409):
            inserted += 1
        else:
            print("Insert failed:", resp.status_code, resp.text[:200])
    return inserted


def to_row(r):
    return (
        r["tweet_id"],
        r["username"],
        r["profile_pic"],
        r["text"],
        r["date"],
        r["likes"],
        r["retweets"],
        r["replies"],
        r["quotes"],
        r["followers"],
    )


def insert_rows_via_postgres(rows):
    if not DB_URL:
        return 0
    try:
        conn = psycopg2.connect(dsn=DB_URL, sslmode='require')
        conn.autocommit = True
        with conn.cursor() as cur:
            sql = (
                "INSERT INTO public.tweets (tweet_id, username, profile_pic, text, date, likes, retweets, replies, quotes, followers) "
                "VALUES %s ON CONFLICT (tweet_id) DO NOTHING"
            )
            execute_values(cur, sql, [to_row(r) for r in rows], page_size=500)
        conn.close()
        return len(rows)
    except Exception as e:
        print("Postgres insert failed:", e)
        return 0


def main():
    # 1h guard unless FORCE_RUN=1 (more frequent than tweepy script)
    try:
        if os.getenv("FORCE_RUN") != "1" and os.path.exists(LAST_RUN_FILE):
            with open(LAST_RUN_FILE, "r") as f:
                last = float(f.read().strip() or "0")
                if time.time() - last < 3600:
                    print("Skip: last snscrape run < 1h ago")
                    return
    except Exception:
        pass

    rows = list(fetch_tweets(LIMIT))
    if not rows:
        print("No tweets fetched via snscrape")
        return

    inserted = 0
    if DB_URL:
        inserted = insert_rows_via_postgres(rows)
        print(f"Inserted {inserted}/{len(rows)} tweets via Postgres (deduped by tweet_id)")
    if inserted == 0:
        inserted = insert_rows_via_rest(rows)
        print(f"Inserted {inserted}/{len(rows)} tweets via Supabase REST")

    try:
        with open(LAST_RUN_FILE, "w") as f:
            f.write(str(time.time()))
    except Exception:
        pass


if __name__ == "__main__":
    main()


