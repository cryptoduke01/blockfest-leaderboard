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

	if (!supabaseAdmin) {
		return NextResponse.json([], { status: 200 });
	}

	try {
		const { data: tweets, error } = await supabaseAdmin
			.from("tweets")
			.select("tweet_id, username, profile_pic, date, quotes, followers")
			.gte("date", sinceIso)
			.order("date", { ascending: false })
			.limit(100);

		if (error || !tweets || tweets.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		const defaultAvatar = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";
		const seen = new Set<string>();
		const users: {
			username: string;
			profile_pic: string;
			score: number;
			tweets: number;
			quotes: number;
		}[] = [];

		for (const t of tweets) {
			const key = t.username as string;
			if (seen.has(key)) continue; // only first tweet per user in this pull
			seen.add(key);

			// Scoring: quotes heavy + follower influence; no retweets/likes/replies
			const followerBoost = Math.log10((t.followers || 0) + 10); // favors big accounts gently
			const score = (t.quotes || 0) * 1.0 + followerBoost; // simple, transparent

			users.push({
				username: key,
				profile_pic: (t.profile_pic as string) || defaultAvatar,
				score,
				tweets: 1,
				quotes: t.quotes || 0,
			});
		}

		// Sort and mindshare
		users.sort((a, b) => b.score - a.score);
		const total = users.reduce((s, u) => s + u.score, 0) || 1;
		const leaderboard = users.map((u, i) => ({
			rank: i + 1,
			mindshare: +((u.score / total) * 100).toFixed(2),
			username: u.username,
			profile_pic: u.profile_pic,
			score: u.score,
			tweets: u.tweets,
			likes: 0,
			retweets: 0,
			replies: 0,
			quotes: u.quotes,
		}));

		return NextResponse.json(leaderboard, { status: 200 });
	} catch {
		return NextResponse.json([], { status: 200 });
	}
}
