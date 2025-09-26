import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blockfest Leaderboard",
  description: "Live rankings of creators talking about Blockfest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="mt-16 text-center py-6 text-white/60 text-sm">
          Built by <span className="text-white font-semibold">duke.sol</span> • <a className="underline hover:text-white" href="https://x.com/cryptoduke01" target="_blank" rel="noreferrer">@cryptoduke01</a>
        </footer>
      </body>
    </html>
  );
}
