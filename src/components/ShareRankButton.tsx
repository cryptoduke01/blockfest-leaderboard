'use client';

import { useState } from 'react';
import { Share2, Twitter, Copy, Check } from 'lucide-react';

interface ShareRankButtonProps {
  rank: number;
  username: string;
  name: string;
  followers: number;
  mindshare: number;
}

export default function ShareRankButton({ rank, username, name, followers, mindshare }: ShareRankButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareText = `🏆 I'm ranked #${rank} on the Blockfest Africa Leaderboard! 

👤 ${name} (${username})
📊 ${followers.toLocaleString()} followers
🧠 ${mindshare}% mindshare

Join me at #blockfestafrica and see where you rank! 

#blockfestafrica #web3 #africa #leaderboard`;

  const shareUrl = `https://blockfestafrica.com/leaderboard?user=${username.replace('@', '')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Share2 size={16} />
        Share Rank
      </button>

      {showShareOptions && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              Share your rank on social media
            </div>
            
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Twitter size={18} />
              Share on X (Twitter)
            </button>
            
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            
            <div className="text-xs text-gray-500 pt-2 border-t">
              Rank #{rank} • {followers.toLocaleString()} followers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
