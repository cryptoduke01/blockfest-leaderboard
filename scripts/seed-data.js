// Simple script to seed test data for the leaderboard
// Run with: node scripts/seed-data.js

const testData = [
  {
    rank: 1,
    username: "@blockfest_king",
    profile_pic: "https://i.pravatar.cc/100?img=1",
    score: 125.7,
    tweets: 12,
    likes: 1250,
    retweets: 340,
    replies: 89,
    quotes: 45
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
    quotes: 32
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
    quotes: 28
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
    quotes: 22
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
    quotes: 18
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
    quotes: 15
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
    quotes: 12
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
    quotes: 9
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
    quotes: 8
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
    quotes: 6
  }
];

console.log('Test data for leaderboard:');
console.log(JSON.stringify(testData, null, 2));
console.log('\nCopy this data and use it to test the UI!');
