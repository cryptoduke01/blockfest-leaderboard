#!/usr/bin/env python3
"""
Test script to verify Twitter API and Supabase integration
"""
import os
import sys
from datetime import datetime, timezone, timedelta

# Add worker directory to path
sys.path.append('worker')

from dotenv import load_dotenv
import tweepy

# Load environment variables
load_dotenv(dotenv_path='.env.local')

def test_twitter_api():
    """Test Twitter API connection"""
    print("🔍 Testing Twitter API...")
    
    BEARER_TOKEN = os.getenv('TWITTER_BEARER_TOKEN')
    if not BEARER_TOKEN:
        print("❌ No TWITTER_BEARER_TOKEN found")
        return False
    
    try:
        client = tweepy.Client(bearer_token=BEARER_TOKEN)
        
        # Test with simple query
        tweets = client.search_recent_tweets(
            query='blockfest -is:retweet lang:en',
            max_results=10,
            tweet_fields=['created_at', 'public_metrics', 'author_id'],
            user_fields=['username', 'profile_image_url', 'public_metrics'],
            expansions=['author_id']
        )
        
        if tweets.data:
            print(f"✅ Twitter API working! Found {len(tweets.data)} tweets")
            users = {user.id: user for user in tweets.includes.get('users', [])}
            
            print("\n📊 Sample tweets:")
            for i, tweet in enumerate(tweets.data[:3]):
                user = users.get(tweet.author_id)
                if user:
                    metrics = tweet.public_metrics
                    user_metrics = user.public_metrics
                    print(f"  {i+1}. @{user.username} - {metrics.get('like_count', 0)} likes, {user_metrics.get('followers_count', 0)} followers")
            return True
        else:
            print("❌ No tweets found")
            return False
            
    except Exception as e:
        print(f"❌ Twitter API error: {e}")
        return False

def test_supabase_connection():
    """Test Supabase connection"""
    print("\n🔍 Testing Supabase connection...")
    
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE')
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("❌ Supabase credentials not found")
        return False
    
    try:
        import requests
        
        headers = {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Test connection
        response = requests.get(f'{SUPABASE_URL}/rest/v1/tweets?select=count', headers=headers)
        
        if response.status_code == 200:
            print("✅ Supabase connection working!")
            return True
        else:
            print(f"❌ Supabase error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Supabase error: {e}")
        return False

def main():
    print("🚀 Testing Blockfest Scraper Integration\n")
    
    twitter_ok = test_twitter_api()
    supabase_ok = test_supabase_connection()
    
    print(f"\n📋 Test Results:")
    print(f"  Twitter API: {'✅' if twitter_ok else '❌'}")
    print(f"  Supabase: {'✅' if supabase_ok else '❌'}")
    
    if twitter_ok and supabase_ok:
        print("\n🎉 All systems ready! You can now run the scraper.")
        print("Run: cd worker && FORCE_RUN=1 python scrape_blockfest.py")
    else:
        print("\n❌ Fix the issues above before running the scraper.")

if __name__ == "__main__":
    main()
