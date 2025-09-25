export type LeaderboardRow = {
  rank: number;
  username: string;
  profile_pic: string;
  score: number;
  tweets: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
};

export type Period = "daily" | "weekly";
