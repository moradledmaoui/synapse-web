"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/" },
  { label: "Coach", href: "/coach" },
  { label: "Stratégies", href: "/strategies" },
  { label: "Backtest", href: "/backtest" },
  { label: "Journal", href: "/journal" },
  { label: "Config", href: "/settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black flex z-50">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center gap-1 py-2 no-underline">
            <div className={`w-6 h-6 rounded-md ${active ? "bg-black" : "bg-gray-200"}`} />
            <span className={`text-[9px] font-semibold ${active ? "text-black" : "text-gray-400"}`}>
              {item.label}
            </span>
            {active && <div className="w-1 h-1 rounded-full bg-black" />}
          </Link>
        );
      })}
    </nav>
  );
}
