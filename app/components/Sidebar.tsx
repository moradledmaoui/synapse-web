"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApi } from "../hooks/useApi";
import { useState, useEffect } from "react";

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
      // { label: "Backtest", href: "/backtest" }, // Masqué — intégré dans les stratégies
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

const NAV_ICONS: Record<string, string> = {
  "/": "▦",
  "/journal": "◈",
  // "/backtest": "◎",
  "/coach": "◉",
  "/strategies": "◆",
  "/settings": "◇",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 15000);
  const isCoach = pathname === "/coach";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Ferme la sidebar mobile au changement de page
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const allItems = NAV.flatMap(g => g.items);

  // MOBILE — Bottom tabs + hamburger
  if (isMobile) {
    return (
      <>
        {/* Hamburger topbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#111] flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
          <div className="font-mono text-sm font-bold text-white">SYNAPSE</div>
          <div className="flex items-center gap-3">
            {portfolio && (
              <div className={`font-mono text-xs font-bold ${portfolio.pnl_usdt >= 0 ? "text-green-400" : "text-red-400"}`}>
                {portfolio.pnl_usdt >= 0 ? "+" : ""}{portfolio.pnl_usdt.toFixed(2)} USDT
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            >
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Overlay menu mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black opacity-60" />
            <div
              className="absolute top-14 left-0 bottom-0 w-64 bg-[#111] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-2 py-4">
                {NAV.map(group => (
                  <div key={group.section} className="mb-4">
                    <div className="text-[9px] font-bold text-[#555] uppercase tracking-widest px-3 mb-1">
                      {group.section}
                    </div>
                    {group.items.map(item => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 no-underline"
                          style={{ background: active ? "#fff" : "transparent" }}
                        >
                          <span className="text-sm" style={{ color: active ? "#111" : "#666" }}>
                            {NAV_ICONS[item.href]}
                          </span>
                          <span className="text-[13px] font-medium" style={{ color: active ? "#111" : "#ccc" }}>
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ))}

                {portfolio && (
                  <div className="mx-3 mt-4 space-y-2">
                    <div className="bg-[#1a1a1a] rounded-lg px-3 py-2">
                      <div className="text-[9px] text-[#555] uppercase mb-1">Régime</div>
                      <div className="font-mono text-sm font-bold" style={{ color: REGIME_COLORS[portfolio.regime] }}>
                        {portfolio.regime.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg px-3 py-2">
                      <div className="text-[9px] text-[#555] uppercase mb-1">P&L</div>
                      <div className={`font-mono text-sm font-bold ${portfolio.pnl_usdt >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {portfolio.pnl_usdt >= 0 ? "+" : ""}{portfolio.pnl_usdt.toFixed(2)} USDT
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom tabs */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-[#1f1f1f] flex">
          {allItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2 no-underline"
              >
                <span className="text-base" style={{ color: active ? "#fff" : "#444" }}>
                  {NAV_ICONS[item.href]}
                </span>
                <span className="text-[8px] font-bold" style={{ color: active ? "#fff" : "#444" }}>
                  {item.label.split(" ")[0]}
                </span>
                {active && <div className="w-1 h-1 rounded-full bg-white" />}
              </Link>
            );
          })}
        </div>
      </>
    );
  }

  // DESKTOP — Sidebar gauche
  return (
    <div className="w-[220px] bg-[#111] flex flex-col flex-shrink-0 h-screen sticky top-0">

      {/* LOGO */}
      <div className="px-4 py-4 border-b border-[#1f1f1f]">
        <div className="font-mono text-sm font-bold text-white tracking-tight">SYNAPSE</div>
        <div className="text-[9px] text-[#666] mt-0.5">Terminal v1.0 alpha</div>
      </div>

      {/* NAV */}
      <div className="px-2 py-3 border-b border-[#1f1f1f]">
        {NAV.map((group) => (
          <div key={group.section} className="mb-3 last:mb-0">
            <div className="text-[9px] font-bold text-[#555] uppercase tracking-widest px-2 mb-1">
              {group.section}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 no-underline transition-colors hover:bg-[#1a1a1a]"
                  style={{ background: active ? "#fff" : "transparent" }}
                >
                  <span className="text-sm flex-shrink-0" style={{ color: active ? "#111" : "#888" }}>
                    {NAV_ICONS[item.href]}
                  </span>
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: active ? "#111" : "#ccc" }}
                  >
                    {item.label}
                  </span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#111]" />}
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
            <span className="text-[#888] text-sm">+</span>
            <span className="text-[11px] text-[#aaa]">Nouvelle conversation</span>
          </button>

          <div className="bg-[#1a1a1a] rounded-lg px-2.5 py-1.5 flex items-center gap-2 mb-2">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="4" cy="4" r="3" stroke="#555" strokeWidth="1.2"/>
              <path d="M6.5 6.5L9 9" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent text-[10px] text-[#aaa] outline-none w-full placeholder-[#555]"
              onChange={(e) => window.dispatchEvent(new CustomEvent("coach:search", { detail: e.target.value }))}
            />
          </div>

          <div className="text-[9px] font-bold text-[#555] uppercase tracking-widest px-1 mb-1">Récentes</div>
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
          <div className="text-[12px] font-medium text-[#ddd]">Morad L.</div>
          <div className="text-[9px] text-[#666]">Paper trading</div>
        </div>
      </div>
    </div>
  );
}
