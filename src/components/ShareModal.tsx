'use client';

import { useState, useRef } from 'react';
import { X, Share2, Twitter, Copy, Check, Download, Image } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank: number;
  username: string;
  name: string;
  followers: number;
  mindshare: number;
  profilePic: string;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  rank, 
  username, 
  name, 
  followers, 
  mindshare, 
  profilePic 
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

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

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    
    setSaving(true);
    try {
      // Dynamic import to avoid SSR issues
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `blockfest-rank-${rank}-${username.replace('@', '')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div ref={cardRef} className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Header with user info */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <UserAvatar src={profilePic} alt={username} size={80} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">{name}</h2>
          <p className="text-black/80 text-lg">{username}</p>
          <div className="mt-4 bg-black/20 rounded-lg p-3">
            <div className="text-3xl font-black text-black">#{rank}</div>
            <div className="text-sm text-black/80">Rank on Leaderboard</div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{mindshare}%</div>
              <div className="text-sm text-gray-600">Mindshare</div>
            </div>
          </div>

          {/* Share options */}
          <div className="space-y-3">
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Twitter size={20} />
              Share on X (Twitter)
            </button>
            
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Save as Image
                </>
              )}
            </button>
            
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
