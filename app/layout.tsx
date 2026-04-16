import type { Metadata } from "next";
import { BottomNav } from "./components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNAPSE — Trading Intelligence",
  description: "Plateforme de trading algorithmique crypto",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080B0F] text-[#E6EDF3] antialiased" style={{ fontFamily: "'Geist', sans-serif" }}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
