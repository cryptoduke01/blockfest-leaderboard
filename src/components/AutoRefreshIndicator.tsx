"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AutoRefreshIndicator({ seconds = 60, onElapsed }: { seconds?: number; onElapsed: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const progress = ((seconds - remaining) / seconds) * 100;

  useEffect(() => {
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    if (remaining === 0) {
      onElapsed();
      setRemaining(seconds);
    }
  }, [remaining, seconds, onElapsed]);

  return (
    <motion.div
      className="glass rounded-xl p-3 flex items-center gap-3 min-w-[200px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-white/80">Live</span>
      </div>
      <div className="flex-1 relative">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>
      <span className="text-xs font-semibold text-yellow-400 min-w-[30px] text-right">
        {remaining}s
      </span>
    </motion.div>
  );
}
