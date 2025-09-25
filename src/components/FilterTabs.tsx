"use client";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { Period } from "@/types/leaderboard";

export function FilterTabs({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
	return (
		<Tabs.Root value={value} onValueChange={(v) => onChange((v as Period) || "daily")}>
			<Tabs.List className="glass rounded-xl p-1 inline-flex gap-1">
				<Tabs.Trigger 
					value="daily" 
					className="relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
				>
					{value === "daily" && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-lg"
							initial={false}
							transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
						/>
					)}
					<span className={`relative z-10 ${value === "daily" ? "text-black font-bold" : "text-white/80 hover:text-white"}`}>
						Today
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger 
					value="weekly" 
					className="relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
				>
					{value === "weekly" && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-lg"
							initial={false}
							transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
						/>
					)}
					<span className={`relative z-10 ${value === "weekly" ? "text-black font-bold" : "text-white/80 hover:text-white"}`}>
						This Week
					</span>
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	);
}
