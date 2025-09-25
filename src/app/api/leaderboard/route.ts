import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

function getSince(period: string): string {
  const now = new Date();
  if (period === "weekly") {
    now.setDate(now.getDate() - 7);
  } else {
    now.setDate(now.getDate() - 1);
  }
  return now.toISOString();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") === "weekly" ? "weekly" : "daily";
  const sinceIso = getSince(period);

  console.log("API called with period:", period);
  console.log("Supabase admin client:", supabaseAdmin ? "exists" : "null");

  // Try to get real data from Supabase first
  if (supabaseAdmin) {
    try {
      console.log(`Fetching real data for period: ${period}, since: ${sinceIso}`);
      
      const { data: tweets, error } = await supabaseAdmin
        .from('tweets')
        .select('*')
        .gte('date', sinceIso)
        .order('date', { ascending: false });

      if (!error && tweets && tweets.length > 0) {
        console.log(`Found ${tweets.length} tweets in database`);
        
        // Calculate scores and aggregate by user
        const userScores = new Map();
        
        tweets.forEach(tweet => {
          const ageInHours = (Date.now() - new Date(tweet.date).getTime()) / (1000 * 60 * 60);
          const score = (tweet.likes * 0.3) + (tweet.retweets * 0.3) + (tweet.replies * 0.2) + (tweet.quotes * 0.2) + (tweet.followers * 0.05);
          const normalizedScore = score / Math.log(tweet.followers + 10);
          const finalScore = normalizedScore * Math.exp(-ageInHours / 12);
          
          if (userScores.has(tweet.username)) {
            const existing = userScores.get(tweet.username);
            existing.score += finalScore;
            existing.tweets += 1;
            existing.likes += tweet.likes;
            existing.retweets += tweet.retweets;
            existing.replies += tweet.replies;
            existing.quotes += tweet.quotes;
          } else {
            userScores.set(tweet.username, {
              username: tweet.username,
              profile_pic: tweet.profile_pic,
              score: finalScore,
              tweets: 1,
              likes: tweet.likes,
              retweets: tweet.retweets,
              replies: tweet.replies,
              quotes: tweet.quotes
            });
          }
        });

        // Convert to array and sort by score
        const leaderboard = Array.from(userScores.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((user, index) => ({
            rank: index + 1,
            ...user
          }));

        console.log(`Returning ${leaderboard.length} real users from database`);
        return NextResponse.json(leaderboard, { status: 200 });
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }
  }

  // Fallback to mock data if no real data
  console.log("No real data found, returning mock data");
  return NextResponse.json(
    [
      {
        rank: 1,
        username: "@blockfest_king",
        profile_pic: "https://i.pravatar.cc/100?img=1",
        score: 125.7,
        tweets: 12,
        likes: 1250,
        retweets: 340,
        replies: 89,
        quotes: 45,
      },
      {
        rank: 2,
        username: "@crypto_queen",
        profile_pic: "https://i.pravatar.cc/100?img=2",
        score: 98.3,
        tweets: 8,
        likes: 980,
        retweets: 220,
        replies: 67,
        quotes: 32,
      },
      {
        rank: 3,
        username: "@web3_wizard",
        profile_pic: "https://i.pravatar.cc/100?img=3",
        score: 87.2,
        tweets: 15,
        likes: 870,
        retweets: 180,
        replies: 45,
        quotes: 28,
      },
      {
        rank: 4,
        username: "@blockchain_builder",
        profile_pic: "https://i.pravatar.cc/100?img=4",
        score: 76.8,
        tweets: 6,
        likes: 650,
        retweets: 150,
        replies: 38,
        quotes: 22,
      },
      {
        rank: 5,
        username: "@defi_designer",
        profile_pic: "https://i.pravatar.cc/100?img=5",
        score: 65.4,
        tweets: 9,
        likes: 520,
        retweets: 120,
        replies: 29,
        quotes: 18,
      },
      {
        rank: 6,
        username: "@nft_ninja",
        profile_pic: "https://i.pravatar.cc/100?img=6",
        score: 54.1,
        tweets: 7,
        likes: 420,
        retweets: 95,
        replies: 24,
        quotes: 15,
      },
      {
        rank: 7,
        username: "@dao_director",
        profile_pic: "https://i.pravatar.cc/100?img=7",
        score: 48.7,
        tweets: 5,
        likes: 380,
        retweets: 85,
        replies: 19,
        quotes: 12,
      },
      {
        rank: 8,
        username: "@metaverse_maven",
        profile_pic: "https://i.pravatar.cc/100?img=8",
        score: 42.3,
        tweets: 11,
        likes: 320,
        retweets: 70,
        replies: 16,
        quotes: 9,
      },
      {
        rank: 9,
        username: "@layer2_legend",
        profile_pic: "https://i.pravatar.cc/100?img=9",
        score: 38.9,
        tweets: 4,
        likes: 280,
        retweets: 60,
        replies: 14,
        quotes: 8,
      },
      {
        rank: 10,
        username: "@consensus_creator",
        profile_pic: "https://i.pravatar.cc/100?img=10",
        score: 35.6,
        tweets: 8,
        likes: 250,
        retweets: 55,
        replies: 12,
        quotes: 6,
      },
    ],
    { status: 200 }
  );
}
