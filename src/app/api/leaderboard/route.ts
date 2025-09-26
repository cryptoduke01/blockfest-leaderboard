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

// Blockfest content quality scoring
function calculateContentQuality(text: string): number {
	let score = 0;
	const lowerText = text.toLowerCase();
	
	// High-value Blockfest keywords
	const highValueKeywords = [
		'blockfest africa', 'blockfestafrica', '#blockfestafrica', '#blockfest',
		'africa\'s web3 superb', 'web3 superb', 'africa\'s premier blockchain',
		'africa\'s biggest web3', 'continent\'s largest web3', 'web3 superb'
	];
	
	const mediumValueKeywords = [
		'blockfest', 'blockf3st', 'b3a', 'web3 africa', 'blockchain africa',
		'africa web3', 'web3 festival', 'blockchain conference', 'crypto festival',
		'buidl', 'bridge', 'become', 'web3 in motion', 'unlocking africa',
		'african builders', 'african creators', 'african developers'
	];
	
	const eventKeywords = [
		'october 11', 'oct 11', '2025', 'lagos', 'landmark event',
		'4,000 attendees', 'free registration', 'networking', 'panels',
		'workshops', 'masterclasses', 'keynotes', 'speakers'
	];
	
	// Check high-value keywords (30-50 points each)
	highValueKeywords.forEach(keyword => {
		if (lowerText.includes(keyword)) score += 40;
	});
	
	// Check medium-value keywords (10-20 points each)
	mediumValueKeywords.forEach(keyword => {
		if (lowerText.includes(keyword)) score += 15;
	});
	
	// Check event-specific keywords (5-10 points each)
	eventKeywords.forEach(keyword => {
		if (lowerText.includes(keyword)) score += 8;
	});
	
	// Content length bonus (thoughtful posts)
	if (text.length > 100) score += 10;
	if (text.length > 200) score += 15;
	if (text.length > 300) score += 20;
	
	// Engagement indicators
	if (lowerText.includes('thread') || lowerText.includes('🧵')) score += 15;
	if (lowerText.includes('register') || lowerText.includes('ticket')) score += 10;
	if (lowerText.includes('speaking') || lowerText.includes('panel')) score += 20;
	
	// Media content
	if (lowerText.includes('photo') || lowerText.includes('video') || lowerText.includes('image')) score += 5;
	
	return Math.min(score, 100); // Cap at 100
}

// Special account detection
function isSpecialAccount(username: string): boolean {
	const specialAccounts = [
		'@samuelxeus', '@blockfestafrica', '@thenirvanacad', '@xeusthegreat'
	];
	return specialAccounts.includes(username.toLowerCase());
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
			.select("tweet_id, username, profile_pic, text, date, likes, retweets, replies, quotes, followers")
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
			likes: number;
			retweets: number;
			replies: number;
			quotes: number;
			followers: number;
			contentQuality: number;
		}[] = [];

		for (const t of tweets) {
			const key = t.username as string;
			if (seen.has(key)) continue; // only first tweet per user in this pull
			seen.add(key);

			// Follower threshold filter (250+ followers only)
			if ((t.followers || 0) < 250) continue;

			// Calculate content quality
			const contentQuality = calculateContentQuality(t.text || '');
			
			// Skip low-quality content (unless special account)
			if (contentQuality < 20 && !isSpecialAccount(key)) continue;

			// NEW SCORING ALGORITHM
			// 1. Impressions simulation (40% weight) - using likes as proxy
			const impressions = (t.likes || 0) * 10; // Rough estimate
			const impressionScore = impressions * 0.4;
			
			// 2. Engagement rate (30% weight) - quality of engagement (NO REPLIES)
			const totalEngagement = (t.likes || 0) + (t.retweets || 0) + (t.quotes || 0); // Exclude replies
			const engagementRate = impressions > 0 ? (totalEngagement / impressions) * 100 : 0;
			const engagementScore = engagementRate * 0.3;
			
			// 3. Content quality (20% weight)
			const contentScore = contentQuality * 0.2;
			
			// 4. Follower influence (10% weight) - much reduced
			const followerScore = Math.log10((t.followers || 0) + 1) * 0.1;
			
			// 5. Special account bonus
			const specialBonus = isSpecialAccount(key) ? 50 : 0;
			
			const finalScore = impressionScore + engagementScore + contentScore + followerScore + specialBonus;

			users.push({
				username: key,
				profile_pic: (t.profile_pic as string) || defaultAvatar,
				score: finalScore,
				tweets: 1,
				likes: t.likes || 0,
				retweets: t.retweets || 0,
				replies: t.replies || 0,
				quotes: t.quotes || 0,
				followers: t.followers || 0,
				contentQuality,
			});
		}

		// Sort by score and assign ranks
		users.sort((a, b) => b.score - a.score);
		const total = users.reduce((s, u) => s + u.score, 0) || 1;
		
		const leaderboard = users.map((u, i) => ({
			rank: i + 1,
			mindshare: +((u.score / total) * 100).toFixed(2),
			username: u.username,
			profile_pic: u.profile_pic,
			score: u.score,
			tweets: u.tweets,
			likes: u.likes,
			retweets: u.retweets,
			replies: u.replies,
			quotes: u.quotes,
			followers: u.followers,
		}));

		return NextResponse.json(leaderboard, { status: 200 });
	} catch {
		return NextResponse.json([], { status: 200 });
	}
}
