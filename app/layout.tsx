import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/BottomNav";

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
        <Nav />
        <main className="md:ml-48 pb-20 md:pb-0 min-h-screen">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
