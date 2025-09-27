"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardRow, Period } from "@/types/leaderboard";
import { TopCreatorCard } from "@/components/TopCreatorCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { FilterTabs } from "@/components/FilterTabs";
import { AutoRefreshIndicator } from "@/components/AutoRefreshIndicator";
import UpdateNoticeModal from "@/components/UpdateNoticeModal";

export default function LeaderboardPage() {
	const [period, setPeriod] = useState<Period>("daily");
	const [rows, setRows] = useState<LeaderboardRow[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/leaderboard?period=${period}`, { cache: "no-store" });
			const data = await res.json();
			setRows(Array.isArray(data) ? (data as LeaderboardRow[]) : []);
			setLastUpdated(new Date());
		} catch {
			setRows([]);
		}
		setLoading(false);
	}, [period]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Filter rows based on search query
	const filteredRows = useMemo(() => {
		if (!searchQuery.trim()) return rows;
		return rows.filter(row =>
			row.username.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [rows, searchQuery]);

    const topTwo = useMemo(() => filteredRows.slice(0, 2), [filteredRows]);
    const rest = useMemo(() => filteredRows.slice(2), [filteredRows]);

	return (
		<div className="min-h-screen relative overflow-hidden">
			<UpdateNoticeModal />
			{/* Animated background elements with Blockfest colors */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-teal-400/5 to-transparent rounded-full"></div>
				<div className="absolute top-40 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
				{/* Header with glass effect */}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="glass-strong rounded-2xl p-8 mb-12"
				>
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
						<div className="space-y-4">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="flex items-center gap-6"
							>
								{/* Minimal logo grid (no numeral) */}
								<div className="w-16 h-16 grid grid-cols-2 gap-1">
									<div className="w-6 h-6 bg-red-500 rounded-sm"></div>
									<div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
									<div className="w-6 h-6 bg-teal-400 rounded-sm"></div>
									<div className="w-6 h-6 bg-yellow-400 rounded-sm"></div>
								</div>
								<div>
									<h1 className="text-4xl lg:text-5xl font-black tracking-tight">
										<span className="text-white">BLOCKF</span>
										<span className="text-yellow-400">3</span>
										<span className="text-white">ST</span>
									</h1>
									<p className="text-lg font-semibold text-yellow-400">LEADERBOARD</p>
								</div>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="text-white/80 text-lg max-w-2xl"
							>
								Top creators talking about Blockfest — live rankings and real-time engagement
							</motion.p>
						</div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="flex flex-col sm:flex-row items-center gap-3"
						>
							<FilterTabs value={period} onChange={setPeriod} />
							<AutoRefreshIndicator onElapsed={fetchData} />
							<div className="text-xs text-white/60">Data refreshes every 24h • {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading"}</div>
						</motion.div>
					</div>
				</motion.header>

					{/* Search Bar - Always visible */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mb-8"
				>
					<div className="flex items-center justify-center">
						<div className="w-full max-w-md">
							<input
								type="text"
								placeholder="Search creators by username..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50"
							/>
						</div>
					</div>
				</motion.div>

				{/* Loading state */}
				<AnimatePresence>
					{loading && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center justify-center py-20"
						>
							<div className="glass rounded-2xl p-8 text-center">
								<div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-white/80 text-lg">Loading leaderboard...</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Empty state */}
				<AnimatePresence>
					{!loading && rows.length === 0 && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="glass rounded-2xl p-12 text-center"
						>
							<div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">📊</span>
							</div>
							<h3 className="text-2xl font-bold text-white mb-4">No Data Yet</h3>
							<p className="text-white/60 text-lg">Seed tweets or run the scraper to see the leaderboard</p>
						</motion.div>
					)}
				</AnimatePresence>

					{/* Leaderboard content */}
				<AnimatePresence>
					{!loading && rows.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
                            {/* Top 2 Cards */}
							<section className="mb-16">
								<motion.h2
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.4 }}
									className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
								>
									<span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-black text-sm">🏆</span>
                                    Top Creators
								</motion.h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {topTwo.map((r, index) => (
										<motion.div
											key={r.rank}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 0.1 * index }}
											whileHover={{ scale: 1.02, y: -5 }}
										>
											<TopCreatorCard row={r} />
										</motion.div>
									))}
								</div>
							</section>

							{/* Full Leaderboard Table (Positions 3+) */}
							{rest.length > 0 && (
								<section>
									<motion.h2
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.6, delay: 0.6 }}
										className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
									>
										<span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm">📋</span>
										Full Leaderboard (Top 100)
									</motion.h2>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.8 }}
									>
										<LeaderboardTable rows={rest} />
									</motion.div>
								</section>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
