"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      </svg>
    ),
  },
  {
    href: "/universes",
    label: "Univers",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
        <path d="M3 10H17M10 3C8 6 8 14 10 17M10 3C12 6 12 14 10 17"
          stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/opportunities",
    label: "DEX",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      </svg>
    ),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="3" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
        <path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/coach",
    label: "Coach",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C6 2 3 5 3 8.5C3 11 4.5 13.2 6.5 14.5L6 18L9.5 15.8C9.7 15.8 9.8 15.9 10 15.9C14 15.9 17 12.9 17 9.4C17 5.9 14 2 10 2Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080B0F]/95 backdrop-blur-xl border-t border-[#21262D]">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {TABS.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                active ? "text-[#00D4AA]" : "text-[#8B949E]"
              }`}>
              {tab.icon(active)}
              <span className="text-[9px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
