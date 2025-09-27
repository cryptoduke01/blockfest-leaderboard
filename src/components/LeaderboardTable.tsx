import { motion } from "framer-motion";
import Link from "next/link";
import { LeaderboardRow } from "@/types/leaderboard";
import { UserAvatar } from "@/components/UserAvatar";
import ShareRankButton from "@/components/ShareRankButton";

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full hidden sm:table">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-4 px-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Rank</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Creator</th>
              <th className="py-4 px-6 text-right text-sm font-semibold text-white/80 uppercase tracking-wider">Mindshare</th>
              <th className="py-4 px-6 text-center text-sm font-semibold text-white/80 uppercase tracking-wider">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, index) => (
              <motion.tr key={r.rank} className="hover:bg-white/5 transition-colors duration-200 group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.02 }}>
                <td className="py-4 px-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{r.rank}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl overflow-hidden"><UserAvatar src={r.profile_pic} alt={r.username} size={40} /></div>
                    <div>
                      <Link href={`https://x.com/${r.username.replace(/^@/, "")}`} target="_blank" className="font-medium text-white hover:text-yellow-400 transition-colors duration-200">
                        {r.name || r.username}
                      </Link>
                      <div className="text-xs text-white/60">{r.username}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right"><div className="text-sm font-semibold">{(r.mindshare ?? 0).toFixed(2)}%</div></td>
                <td className="py-4 px-6 text-center">
                  <ShareRankButton 
                    rank={r.rank}
                    username={r.username}
                    name={r.name || r.username}
                    followers={r.followers}
                    mindshare={r.mindshare || 0}
                    profilePic={r.profile_pic}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Mobile stacked list */}
        <div className="sm:hidden divide-y divide-white/5">
          {rows.map((r, index) => (
            <motion.div key={r.rank} className="p-4 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.02 }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{r.rank}</div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl overflow-hidden"><UserAvatar src={r.profile_pic} alt={r.username} size={32} /></div>
                  <div>
                    <Link href={`https://x.com/${r.username.replace(/^@/, "")}`} target="_blank" className="font-medium hover:text-yellow-400">
                      {r.name || r.username}
                    </Link>
                    <div className="text-[11px] text-white/60">{r.username} • {(r.mindshare ?? 0).toFixed(0)}% mindshare</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-white/60">{(r.mindshare ?? 0).toFixed(1)}% mindshare</div>
                </div>
                <ShareRankButton 
                  rank={r.rank}
                  username={r.username}
                  name={r.name || r.username}
                  followers={r.followers}
                  mindshare={r.mindshare || 0}
                  profilePic={r.profile_pic}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
