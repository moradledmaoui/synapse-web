"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",               label: "Home",    icon: "⌂" },
  { href: "/universes",      label: "Univers", icon: "◎" },
  { href: "/opportunities",  label: "DEX",     icon: "✦" },
  { href: "/journal",        label: "Journal", icon: "≡" },
  { href: "/coach",          label: "Coach",   icon: "◇" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={"flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors " + (active ? "text-gray-900" : "text-gray-400 hover:text-gray-600")}>
              <span className="text-base leading-none">{tab.icon}</span>
              <span className={"text-[9px] font-mono " + (active ? "font-semibold" : "")}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
