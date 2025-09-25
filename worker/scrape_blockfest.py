import os
import json
import time
from datetime import datetime, timedelta, timezone

import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import requests

load_dotenv()

DB_URL = os.getenv("SUPABASE_DB_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE")
QUERY = "blockfest OR #blockfest OR #blockfestafrica"
SINCE_HOURS = int(os.getenv("SCRAPE_SINCE_HOURS", "24"))
LIMIT = int(os.getenv("SCRAPE_LIMIT", "500"))

# Mock data for testing - replace with actual Twitter API when ready
def fetch_tweets(query: str, since: datetime, limit: int):
	# For now, return mock data to test the pipeline
	mock_tweets = [
		{
			"id": "1234567890",
			"username": "@blockfest_fan",
			"profile_pic": "https://i.pravatar.cc/100?img=1",
			"content": "Blockfest is absolutely amazing! 🔥 #blockfest",
			"date": datetime.now(timezone.utc),
			"likes": 150,
			"retweets": 25,
			"replies": 10,
			"quotes": 5,
			"followers": 5000
		},
		{
			"id": "1234567891", 
			"username": "@crypto_enthusiast",
			"profile_pic": "https://i.pravatar.cc/100?img=2",
			"content": "Heading to #blockfestafrica this weekend! Can't wait!",
			"date": datetime.now(timezone.utc) - timedelta(hours=2),
			"likes": 80,
			"retweets": 15,
			"replies": 8,
			"quotes": 3,
			"followers": 2500
		},
		{
			"id": "1234567892",
			"username": "@blockchain_dev",
			"profile_pic": "https://i.pravatar.cc/100?img=3", 
			"content": "The energy at Blockfest is incredible! Learning so much about Web3",
			"date": datetime.now(timezone.utc) - timedelta(hours=4),
			"likes": 200,
			"retweets": 40,
			"replies": 20,
			"quotes": 10,
			"followers": 8000
		}
	]
	
	for tweet in mock_tweets[:limit]:
		yield tweet


def to_row(tweet):
	return (
		str(tweet["id"]),
		tweet["username"],
		tweet["profile_pic"],
		tweet["content"],
		tweet["date"],
		tweet["likes"],
		tweet["retweets"],
		tweet["replies"],
		tweet["quotes"],
		tweet["followers"],
	)


def insert_via_supabase_api(rows):
	"""Insert via Supabase REST API as fallback"""
	if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
		raise SystemExit("SUPABASE_URL and SUPABASE_SERVICE_ROLE must be set for API fallback")
	
	headers = {
		"apikey": SUPABASE_SERVICE_KEY,
		"Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
		"Content-Type": "application/json"
	}
	
	# Insert one by one to handle conflicts
	inserted = 0
	for row in rows:
		data = {
			"tweet_id": row[0],
			"username": row[1], 
			"profile_pic": row[2],
			"text": row[3],
			"date": row[4].isoformat(),
			"likes": row[5],
			"retweets": row[6],
			"replies": row[7],
			"quotes": row[8],
			"followers": row[9]
		}
		
		response = requests.post(
			f"{SUPABASE_URL}/rest/v1/tweets",
			headers=headers,
			json=data,
			params={"on_conflict": "tweet_id"}
		)
		
		if response.status_code in [200, 201, 409]:  # 409 = conflict (already exists)
			inserted += 1
		else:
			print(f"Failed to insert {row[0]}: {response.status_code} {response.text}")
	
	print(f"Inserted {inserted} rows via Supabase API")
	return inserted

def main():
	since = datetime.now(timezone.utc) - timedelta(hours=SINCE_HOURS)

	rows = [to_row(t) for t in fetch_tweets(QUERY, since, LIMIT)]
	if not rows:
		print("No tweets fetched")
		return

	# Try direct Postgres connection first
	if DB_URL:
		try:
			conn_params = {
				'dsn': DB_URL,
				'sslmode': 'require'
			}
			conn = psycopg2.connect(**conn_params)
			conn.autocommit = True
			with conn.cursor() as cur:
				sql = (
					"INSERT INTO public.tweets (tweet_id, username, profile_pic, text, date, likes, retweets, replies, quotes, followers) "
					"VALUES %s ON CONFLICT (tweet_id) DO NOTHING"
				)
				execute_values(cur, sql, rows, page_size=500)
				print(f"Inserted {len(rows)} rows via Postgres (deduped by tweet_id)")
			conn.close()
			return
		except Exception as e:
			print(f"Postgres connection failed: {e}")
			print("Falling back to Supabase API...")
	
	# Fallback to Supabase REST API
	insert_via_supabase_api(rows)


if __name__ == "__main__":
	main()
