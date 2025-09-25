# Blockfest Leaderboard

## Local App

```bash
npm install
cp env.example .env.local # fill SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE
npm run dev
```

## Supabase Setup

- Create project → Settings → API → copy Project URL, Anon, Service role
- SQL Editor → run schema:

```
create table if not exists public.tweets (
  tweet_id text primary key,
  username text not null,
  profile_pic text,
  text text,
  date timestamptz not null,
  likes int not null default 0,
  retweets int not null default 0,
  replies int not null default 0,
  quotes int not null default 0,
  followers int not null default 0
);
create index if not exists idx_tweets_date on public.tweets(date desc);
create index if not exists idx_tweets_username on public.tweets(username);

create table if not exists public.leaderboard_cache (
  period text not null check (period in ('daily','weekly')),
  rank int not null,
  username text not null,
  profile_pic text,
  score double precision not null,
  tweets int not null,
  likes int not null,
  retweets int not null,
  replies int not null,
  quotes int not null,
  primary key (period, rank)
);

create or replace function public.exec_sql(sql_query text)
returns jsonb language plpgsql security definer as $$
declare result jsonb; begin
  execute 'select coalesce(jsonb_agg(t), ''[]''::jsonb) from (' || sql_query || ') t' into result;
  return result; end; $$;

grant execute on function public.exec_sql(text) to anon, authenticated, service_role;
alter table public.tweets disable row level security;
alter table public.leaderboard_cache disable row level security;
```

## Seed (optional)

```
insert into public.tweets (tweet_id, username, profile_pic, text, date, likes, retweets, replies, quotes, followers) values
('t1','@creator1','https://i.pravatar.cc/100?img=1','Blockfest is 🔥', now() - interval '1 hour', 120,50,20,10, 5000),
('t2','@creator2','https://i.pravatar.cc/100?img=2','Heading to #blockfest', now() - interval '3 hours', 60,25,10,5, 1500)
on conflict (tweet_id) do nothing;
```

## Scraper (no X sign-in needed)

- snscrape does not require API keys.
- Uses Supabase Postgres connection string (DB URL) to insert rows.

Setup and run locally:

```bash
cd worker
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# copy DB URL from Supabase: Settings → Database → Connection string (Pooler/Direct, disable sslmode=require if needed)
export SUPABASE_DB_URL='postgres://USER:PASSWORD@HOST:PORT/postgres'
python scrape_blockfest.py
```

## Deploy

- App: push repo → connect to Vercel
- Worker: deploy `worker/` to Railway as a Python service; set env SUPABASE_DB_URL; add cron every 5 minutes
                                                                                                                                                                                      
## Cache job (optional)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

- Create a scheduled SQL or small serverless function to compute and upsert top 100 per period into `leaderboard_cache` hourly.
