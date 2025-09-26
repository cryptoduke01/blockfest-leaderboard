"use client";
import { useEffect, useState } from "react";

type Props = {
  storageKey?: string;
};

export default function UpdateNoticeModal({ storageKey = "bf_update_notice_seen_at" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const last = localStorage.getItem(storageKey);
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      if (!last || now - Number(last) > dayMs) {
        setOpen(true);
      }
    } catch {}
  }, [storageKey]);

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={dismiss} />
      <div className="relative glass-strong rounded-2xl p-6 max-w-lg mx-4">
        <h3 className="text-xl font-bold text-white mb-2">Data refresh notice</h3>
        <p className="text-white/80 mb-4">
          Leaderboard data updates every 24 hours due to X data request limits. We’re
          continuously improving freshness and coverage.
        </p>
        <button onClick={dismiss} className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300">
          Got it
        </button>
      </div>
    </div>
  );
}


