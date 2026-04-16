"use client";

const REGIME_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  trending_strong: { label: "TRENDING ↑↑", color: "#00D4AA", bg: "#00D4AA15" },
  trending_weak:   { label: "TRENDING ↑",  color: "#00D4AA", bg: "#00D4AA10" },
  ranging:         { label: "RANGING ◆",   color: "#F59E0B", bg: "#F59E0B10" },
  breakout:        { label: "BREAKOUT ⚡",  color: "#3B82F6", bg: "#3B82F610" },
  volatile:        { label: "VOLATILE ⚠",  color: "#F97316", bg: "#F9731610" },
  bear:            { label: "BEAR ↓",      color: "#FF4444", bg: "#FF444410" },
  panic:           { label: "PANIC 🔴",    color: "#FF0000", bg: "#FF000010" },
  unknown:         { label: "SCANNING...", color: "#8B949E", bg: "#8B949E10" },
};

export function Header({ portfolio }: { portfolio: any }) {
  const pnl    = portfolio?.pnl_usdt || 0;
  const pnlPct = portfolio?.pnl_pct  || 0;
  const up     = pnl >= 0;
  const regime = portfolio?.regime || "unknown";
  const cfg    = REGIME_CONFIG[regime] || REGIME_CONFIG.unknown;
  const dd     = portfolio?.drawdown_pct || 0;

  return (
    <div className="sticky top-0 z-50 bg-[#080B0F]/95 backdrop-blur-xl border-b border-[#21262D]">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + nom */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00D4AA] flex items-center justify-center">
              <span className="text-[#080B0F] text-[11px] font-black">S</span>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#E6EDF3] tracking-tight">SYNAPSE</div>
              <div className="text-[9px] text-[#8B949E]">Paper Trading</div>
            </div>
          </div>

          {/* P&L central */}
          <div className="text-center">
            <div className={`font-mono text-[18px] font-bold tracking-tight ${
              up ? "text-[#00D4AA]" : "text-[#FF4444]"
            }`}>
              {up ? "+" : ""}{pnl.toFixed(2)}
              <span className="text-[12px] ml-1">USDT</span>
            </div>
            <div className={`text-[10px] font-mono ${
              up ? "text-[#00D4AA88]" : "text-[#FF444488]"
            }`}>
              {up ? "+" : ""}{pnlPct.toFixed(2)}%
              {dd > 0 && <span className="text-[#8B949E] ml-2">DD {dd.toFixed(1)}%</span>}
            </div>
          </div>

          {/* Régime badge */}
          <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </div>
        </div>
      </div>
    </div>
  );
}
