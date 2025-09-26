export type LeaderboardRow = {
	rank: number;
	username: string;
	profile_pic: string;
	score: number;
	mindshare?: number;
	tweets: number;
	likes: number;
	retweets: number;
	replies: number;
	quotes: number;
	followers: number;
};

export type Period = "daily" | "weekly";
