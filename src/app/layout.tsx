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
      <link
        href="https://fonts.cdnfonts.com/css/br-sonoma"
        rel="stylesheet"
      ></link>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="mt-16 text-center py-6 text-white/60 text-sm space-x-1">
          <span>
            Built by{" "}
            <a
              href="https://x.com/cryptoduke01"
              target="_blank"
              rel="noreferrer"
              className="text-white font-semibold hover:underline"
            >
              duke.sol
            </a>
          </span>
          <span>•</span>
          <span>
            Made with ❤️ for{" "}
            <a
              href="https://blockfestafrica.com/"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline"
            >
              Blockfest Africa
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
