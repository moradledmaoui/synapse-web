import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono  = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SYNAPSE",
  description: "Trading Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.variable + " " + mono.variable + " font-sans bg-gray-50"}>
        <main className="w-full max-w-2xl mx-auto px-0 md:px-4 md:pt-16 md:pb-6">
          {children}
        </main>
        <div className="w-full max-w-2xl mx-auto">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
