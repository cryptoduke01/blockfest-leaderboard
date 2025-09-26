import Link from "next/link";
import { motion } from "framer-motion";
import { LeaderboardRow } from "@/types/leaderboard";
import { UserAvatar } from "@/components/UserAvatar";

export function TopCreatorCard({ row }: { row: LeaderboardRow }) {
	const getRankColor = (rank: number) => {
		if (rank === 1) return "from-yellow-400 to-yellow-500";
		if (rank === 2) return "from-gray-300 to-gray-500";
		if (rank === 3) return "from-red-500 to-pink-600";
		return "from-blue-500 to-teal-500";
	};

	const getRankIcon = (rank: number) => {
		if (rank === 1) return "🥇";
		if (rank === 2) return "🥈";
		if (rank === 3) return "🥉";
		return "🏆";
	};

	const handle = row.username.replace(/^@/, "");

	return (
		<motion.div
			className={`glass-strong rounded-2xl p-5 sm:p-6 hover:scale-[1.02] transition-all duration-300 group ${row.rank <= 3 ? "ring-2 ring-yellow-400/50 shadow-yellow-400/10" : ""}`}
			whileHover={{ y: -6 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="flex items-center gap-4 sm:gap-6">
				<div className="relative shrink-0">
					<div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${getRankColor(row.rank)} flex items-center justify-center shadow-md`}>
						<span className="text-xl sm:text-2xl">{getRankIcon(row.rank)}</span>
					</div>
					<div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center border border-white/20">
						<span className="text-[10px] sm:text-xs font-black text-white">#{row.rank}</span>
					</div>
				</div>

				<div className="rounded-xl overflow-hidden">
					<UserAvatar src={row.profile_pic} alt={row.username} size={56} />
				</div>

				<div className="flex-1 min-w-0">
					<Link href={`https://x.com/${handle}`} target="_blank" className="font-bold text-base sm:text-lg truncate hover:text-yellow-400">
						{row.username}
					</Link>
					<div className="text-xs sm:text-sm text-white/60">{(row.mindshare ?? 0).toFixed(1)}% mindshare</div>
				</div>

				<div className="text-right min-w-[60px]">
					<div className="text-sm sm:text-base font-semibold">{row.followers.toLocaleString()}</div>
					<div className="text-[10px] sm:text-xs text-white/60">followers</div>
				</div>
			</div>
		</motion.div>
	);
}
