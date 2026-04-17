"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

const TABS = [
  { href: "/",              label: "Home",    icon: "⌂" },
  { href: "/universes",     label: "Univers", icon: "◎" },
  { href: "/opportunities", label: "DEX",     icon: "✦" },
  { href: "/journal",       label: "Journal", icon: "≡" },
  { href: "/coach",         label: "Coach",   icon: "◇" },
  { href: "/profile",       label: "Profil",  icon: "○" },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  return (
    <>
      {/* Desktop — sidebar gauche */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-48 bg-white border-r border-gray-200 z-50 py-6 px-3">
        <div className="mb-8 px-3">
          <div className="text-sm font-semibold text-gray-900">SYNAPSE</div>
          <div className="text-[10px] text-gray-400 font-mono mt-0.5">Trading Intelligence</div>
        </div>
        <div className="space-y-1 flex-1">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-mono transition-colors " + (active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50")}>
                <span className="text-base w-5 text-center">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div className="px-3 pt-4 border-t border-gray-100 space-y-2">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] font-bold">
                {user.name?.slice(0,2).toUpperCase()}
              </div>
              <span className="text-[11px] text-gray-500 font-mono truncate">{user.name}</span>
            </div>
          )}
          <div className="text-[9px] text-gray-300 font-mono">v3.0 · Paper Trading</div>
        </div>
      </div>

      {/* Mobile — bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden">
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
    </>
  );
}
