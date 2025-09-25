import Image from "next/image";
import { motion } from "framer-motion";
import { LeaderboardRow } from "@/types/leaderboard";

export function TopCreatorCard({ row }: { row: LeaderboardRow }) {
	const getRankColor = (rank: number) => {
		if (rank === 1) return "from-yellow-400 to-yellow-500"; // Official Blockfest yellow
		if (rank === 2) return "from-gray-300 to-gray-500";
		if (rank === 3) return "from-red-500 to-pink-600"; // Official Blockfest red
		return "from-blue-500 to-teal-500"; // Official Blockfest blue-teal
	};

	const getRankIcon = (rank: number) => {
		if (rank === 1) return "🥇";
		if (rank === 2) return "🥈";
		if (rank === 3) return "🥉";
		return "🏆";
	};

	return (
		<motion.div
			className={`glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer ${row.rank <= 3 ? 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/20' : ''
				}`}
			whileHover={{ y: -8 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="flex items-center gap-6">
				{/* Rank Badge */}
				<div className="relative">
					<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRankColor(row.rank)} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
						<span className="text-2xl">{getRankIcon(row.rank)}</span>
					</div>
					<div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white/20">
						<span className="text-xs font-black text-white">#{row.rank}</span>
					</div>
				</div>

				{/* Profile Picture */}
				<div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:border-yellow-400/50 transition-all duration-300">
					{row.profile_pic ? (
						<Image
							src={row.profile_pic}
							alt={row.username}
							fill
							sizes="64px"
							className="object-cover group-hover:scale-110 transition-transform duration-300"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
							<span className="text-2xl">👤</span>
						</div>
					)}
				</div>

				{/* Username */}
				<div className="flex-1 min-w-0">
					<div className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors duration-300 truncate">
						{row.username}
					</div>
					<div className="text-sm text-white/60 mt-1">
						X Creator
					</div>
				</div>

				{/* Score */}
				<div className="text-right">
					<div className="text-2xl font-bold text-yellow-400">
						{row.score.toFixed(1)}
					</div>
					<div className="text-sm text-white/60">
						points
					</div>
				</div>

				{/* Tweets Count */}
				<div className="text-right">
					<div className="text-lg font-semibold text-white">
						{row.tweets}
					</div>
					<div className="text-sm text-white/60">
						tweets
					</div>
				</div>
			</div>
		</motion.div>
	);
}
