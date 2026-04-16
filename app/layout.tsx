import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";

const inter = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SYNAPSE",
  description: "Trading Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={sans.variable + " " + inter.variable + " font-sans bg-gray-50"}>
        <main className="max-w-lg mx-auto">
          {children}
        </main>
        <div className="max-w-lg mx-auto">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
