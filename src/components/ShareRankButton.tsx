'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';

interface ShareRankButtonProps {
  rank: number;
  username: string;
  name: string;
  followers: number;
  mindshare: number;
  profilePic: string;
}

export default function ShareRankButton({ rank, username, name, followers, mindshare, profilePic }: ShareRankButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer text-sm"
      >
        <Share2 size={14} />
        Share
      </button>

      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        rank={rank}
        username={username}
        name={name}
        followers={followers}
        mindshare={mindshare}
        profilePic={profilePic}
      />
    </>
  );
}
