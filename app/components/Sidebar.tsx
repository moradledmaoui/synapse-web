"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApi } from "../hooks/useApi";

interface Portfolio {
  pnl_usdt: number;
  regime: string;
}

const NAV = [
  {
    section: "Trading",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Journal", href: "/journal" },
      { label: "Backtest", href: "/backtest" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { label: "Coach AI", href: "/coach" },
      { label: "Stratégies", href: "/strategies" },
    ],
  },
  {
    section: "Système",
    items: [
      { label: "Config", href: "/settings" },
    ],
  },
];

const REGIME_COLORS: Record<string, string> = {
  bull: "#4ade80",
  bear: "#f87171",
  chop: "#fbbf24",
  panic: "#f87171",
  unknown: "#6b7280",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 15000);
  const isCoach = pathname === "/coach";

  return (
    <div className="w-[220px] bg-[#111] flex flex-col flex-shrink-0 h-screen">

      {/* LOGO */}
      <div className="px-4 py-4 border-b border-[#1f1f1f]">
        <div className="font-mono text-sm font-bold text-white tracking-tight">SYNAPSE</div>
        <div className="text-[9px] text-[#444] mt-0.5">Terminal v1.0 alpha</div>
      </div>

      {/* NAV */}
      <div className="px-2 py-3 border-b border-[#1f1f1f]">
        {NAV.map((group) => (
          <div key={group.section} className="mb-3 last:mb-0">
            <div className="text-[9px] font-bold text-[#444] uppercase tracking-widest px-2 mb-1">
              {group.section}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg mb-0.5 no-underline transition-colors"
                  style={{ background: active ? "#fff" : "transparent" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: active ? "#111" : "#333" }}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: active ? "#111" : "#555" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* CONVERSATIONS COACH */}
      {isCoach && (
        <div className="flex flex-col flex-1 overflow-hidden px-2 py-3 border-b border-[#1f1f1f]">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("coach:new"))}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2a2a2a] mb-2 w-full text-left hover:border-[#444] transition-colors"
          >
            <span className="text-[#555] text-sm leading-none">+</span>
            <span className="text-[11px] text-[#666]">Nouvelle conversation</span>
          </button>

          <div className="bg-[#1a1a1a] rounded-lg px-2.5 py-1.5 flex items-center gap-2 mb-2">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="4" cy="4" r="3" stroke="#444" strokeWidth="1.2"/>
              <path d="M6.5 6.5L9 9" stroke="#444" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-[10px] text-[#666] outline-none w-full placeholder-[#444]"
              onChange={(e) => window.dispatchEvent(new CustomEvent("coach:search", { detail: e.target.value }))}
            />
          </div>

          <div className="text-[9px] font-bold text-[#444] uppercase tracking-widest px-1 mb-1">
            Récentes
          </div>

          <div
            id="coach-conv-list"
            className="flex-1 overflow-y-auto space-y-0.5"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}
          />
        </div>
      )}

      {!isCoach && <div className="flex-1" />}

      {/* PROFIL */}
      <div className="px-3 py-3 border-t border-[#1f1f1f] flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
          ML
        </div>
        <div>
          <div className="text-[11px] font-medium text-[#ccc]">Morad L.</div>
          <div className="text-[9px] text-[#444]">Paper trading</div>
        </div>
      </div>
    </div>
  );
}
