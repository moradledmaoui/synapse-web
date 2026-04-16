"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",              label: "Home",    icon: "⌂" },
  { href: "/universes",     label: "Univers", icon: "◎" },
  { href: "/opportunities", label: "DEX",     icon: "✦" },
  { href: "/journal",       label: "Journal", icon: "≡" },
  { href: "/coach",         label: "Coach",   icon: "◇" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile — bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around px-2 py-2 max-w-2xl mx-auto">
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

      {/* Desktop — top nav */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">SYNAPSE</span>
            <span className="text-[10px] text-gray-400 font-mono">Trading Intelligence</span>
          </div>
          <div className="flex items-center gap-1">
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href}
                  className={"px-3 py-1.5 rounded-lg text-[12px] font-mono transition-colors " + (active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}>
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
