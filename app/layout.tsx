import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SYNAPSE Terminal",
  description: "Plateforme de trading algorithmique intelligente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-gray-100`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — cachée sur mobile via CSS */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          {/* Sidebar mobile — rendue par le composant lui-même */}
          <div className="flex md:hidden">
            <Sidebar />
          </div>
          {/* Contenu principal */}
          <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
