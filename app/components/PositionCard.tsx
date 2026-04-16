"use client";
import { useState } from "react";

interface Position {
  id: number;
  symbol: string;
  side: string;
  strategy: string;
  entry_price: number;
  current_price: number;
  stop_loss: number;
  take_profit: number;
  pnl_usdt: number;
  pnl_pct: number;
  size_usdt: number;
  score: number;
  regime_at_open: string;
  opened_at: string;
  logo_url?: string;
}

function SlTpBar({ entry, current, sl, tp, score }: {
  entry: number; current: number; sl: number; tp: number; score: number;
}) {
  if (!sl || !tp || sl >= tp) return null;
  const range   = tp - sl;
  const posPct  = Math.max(0, Math.min(100, ((current - sl) / range) * 100));
  const entPct  = Math.max(0, Math.min(100, ((entry  - sl) / range) * 100));
  const danger  = posPct < 20;
  const win     = posPct > 80;
  const color   = danger ? "#FF4444" : win ? "#00D4AA" : "#6B7280";

  return (
    <div className="mt-3 mb-1">
      <div className="relative h-1 rounded-full bg-[#21262D] overflow-visible">
        <div className="absolute h-full rounded-full opacity-20 bg-[#00D4AA]"
          style={{ left: `${entPct}%`, width: `${100 - entPct}%` }} />
        <div className="absolute h-full rounded-full transition-all duration-1000"
          style={{ width: `${posPct}%`, background: `linear-gradient(90deg, #FF444433, ${color}66)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
          style={{ left: `${posPct}%` }}>
          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#080B0F] shadow-lg"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        </div>
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] font-mono text-[#FF4444]">
          SL {sl.toFixed(sl < 1 ? 4 : 2)}
        </span>
        <span className="text-[10px] font-mono text-[#8B949E]">
          Score {score?.toFixed(0)}/100
        </span>
        <span className="text-[10px] font-mono text-[#00D4AA]">
          TP {tp.toFixed(tp < 1 ? 4 : 2)}
        </span>
      </div>
    </div>
  );
}

const STRATEGY_LABELS: Record<string, string> = {
  mean_reversion:    "Mean Rev",
  market_structure:  "Mkt Struct",
  obv:               "OBV",
  bollinger_squeeze: "BB Squeeze",
  momentum:          "Momentum",
  rsi:               "RSI",
  ema_crossover:     "EMA Cross",
};

const REGIME_COLORS: Record<string, string> = {
  trending_strong: "#00D4AA",
  trending_weak:   "#00D4AA88",
  ranging:         "#F59E0B",
  breakout:        "#3B82F6",
  volatile:        "#F97316",
  bear:            "#FF4444",
  panic:           "#FF0000",
};

export function PositionCard({ pos, onClose }: {
  pos: Position;
  onClose?: (symbol: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const up     = pos.pnl_pct >= 0;
  const pct    = Math.abs(pos.pnl_pct);
  const strat  = STRATEGY_LABELS[pos.strategy] || pos.strategy;
  const regColor = REGIME_COLORS[pos.regime_at_open] || "#8B949E";
  const dur    = pos.opened_at
    ? Math.round((Date.now() - new Date(pos.opened_at).getTime()) / 3600000)
    : 0;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      expanded ? "border-[#00D4AA33] bg-[#0D1117]" : "border-[#21262D] bg-[#0D1117] hover:border-[#30363D]"
    }`}>
      <button className="w-full px-4 pt-4 pb-3 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            {pos.logo_url ? (
              <img src={pos.logo_url} alt="" className="w-8 h-8 rounded-full"
                onError={e => { e.currentTarget.style.display = "none"; }} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#21262D] flex items-center justify-center">
                <span className="text-[10px] font-mono text-[#8B949E]">
                  {pos.symbol.replace("USDT","").slice(0,3)}
                </span>
              </div>
            )}
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#080B0F] ${
              up ? "bg-[#00D4AA]" : "bg-[#FF4444]"
            }`} />
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-semibold text-[#E6EDF3]">
                {pos.symbol.replace("USDT","")}
                <span className="text-[#8B949E] font-normal">/USDT</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: regColor + "22", color: regColor }}>
                {pos.regime_at_open?.toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-[#8B949E] mt-0.5">
              {strat} · {dur}h · ${pos.size_usdt?.toFixed(0)}
            </div>
          </div>

          {/* P&L */}
          <div className="text-right flex-shrink-0">
            <div className={`font-mono text-[14px] font-semibold ${up ? "text-[#00D4AA]" : "text-[#FF4444]"}`}>
              {up ? "+" : ""}{pos.pnl_usdt?.toFixed(2)}
            </div>
            <div className={`text-[11px] font-mono ${up ? "text-[#00D4AA88]" : "text-[#FF444488]"}`}>
              {up ? "+" : ""}{pct.toFixed(2)}%
            </div>
          </div>

          {/* Chevron */}
          <div className={`text-[#8B949E] transition-transform duration-300 ml-1 ${expanded ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Barre SL→TP */}
        <SlTpBar
          entry={pos.entry_price}
          current={pos.current_price}
          sl={pos.stop_loss}
          tp={pos.take_profit}
          score={pos.score}
        />
      </button>

      {/* Panneau déplié */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#21262D] pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Entrée",  value: `$${pos.entry_price?.toFixed(pos.entry_price < 1 ? 4 : 2)}` },
              { label: "Actuel",  value: `$${pos.current_price?.toFixed(pos.current_price < 1 ? 4 : 2)}`, color: up ? "#00D4AA" : "#FF4444" },
              { label: "Score",   value: `${pos.score?.toFixed(0)}/100` },
              { label: "Taille",  value: `$${pos.size_usdt?.toFixed(0)}` },
              { label: "SL",      value: `$${pos.stop_loss?.toFixed(pos.stop_loss < 1 ? 4 : 2)}`, color: "#FF444488" },
              { label: "TP",      value: `$${pos.take_profit?.toFixed(pos.take_profit < 1 ? 4 : 2)}`, color: "#00D4AA88" },
            ].map(m => (
              <div key={m.label} className="bg-[#080B0F] rounded-xl px-3 py-2.5">
                <div className="text-[9px] text-[#8B949E] uppercase tracking-wide mb-1">{m.label}</div>
                <div className="font-mono text-[12px] font-medium" style={{ color: m.color || "#E6EDF3" }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => onClose?.(pos.symbol)}
              className="flex-1 py-2.5 rounded-xl border border-[#FF444433] text-[#FF4444] text-[11px] font-medium hover:bg-[#FF444411] transition-colors">
              Fermer la position
            </button>
            <button className="px-4 py-2.5 rounded-xl border border-[#21262D] text-[#8B949E] text-[11px] hover:border-[#30363D] transition-colors">
              Analyser →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
