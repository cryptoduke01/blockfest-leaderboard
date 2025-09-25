import { motion } from "framer-motion";
import { LeaderboardRow } from "@/types/leaderboard";

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-4 px-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                Rank
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                Creator
              </th>
              <th className="py-4 px-6 text-right text-sm font-semibold text-white/80 uppercase tracking-wider">
                Score
              </th>
              <th className="py-4 px-6 text-right text-sm font-semibold text-white/80 uppercase tracking-wider">
                Tweets
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, index) => (
              <motion.tr
                key={r.rank}
                className="hover:bg-white/5 transition-colors duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {r.rank}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-white group-hover:text-yellow-400 transition-colors duration-200">
                        {r.username}
                      </div>
                      <div className="text-xs text-white/60">
                        X Creator
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="text-lg font-bold text-yellow-400">
                    {r.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-white/60">points</div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="text-white/80 font-medium">
                    {r.tweets}
                  </div>
                  <div className="text-xs text-white/60">tweets</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
