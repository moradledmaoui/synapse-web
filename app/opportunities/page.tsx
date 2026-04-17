"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}
function fmtPrice(p?: number): string {
  if (!p) return "--";
  if (p < 0.000001) return p.toFixed(10);
  if (p < 0.0001) return p.toFixed(8);
  if (p < 0.01) return p.toFixed(6);
  if (p < 1) return p.toFixed(4);
  return p.toFixed(2);
}

const CHAIN_COLORS: Record<string, string> = {
  Solana:   "text-purple-600 bg-purple-50 border-purple-200",
  Base:     "text-blue-600 bg-blue-50 border-blue-200",
  Ethereum: "text-gray-600 bg-gray-50 border-gray-200",
  BSC:      "text-yellow-600 bg-yellow-50 border-yellow-200",
  Arbitrum: "text-cyan-600 bg-cyan-50 border-cyan-200",
};

function PositionCard({ pos }: { pos: any }) {
  const [open, setOpen] = useState(false);
  const pnl    = parseFloat(pos.pnl_usdt || 0);
  const pnlPct = parseFloat(pos.pnl_pct || 0);
  const x      = parseFloat(pos.x_multiplier || 1);
  const entry  = parseFloat(pos.entry_price || 0);
  const current = parseFloat(pos.current_price || entry);
  const target = entry * 2;
  const progPct = entry > 0 ? Math.min(100, Math.max(0, ((current - entry) / (target - entry)) * 100)) : 0;
  const up = pnl >= 0;
  const chainColor = CHAIN_COLORS[pos.network] || "text-gray-500 bg-gray-50 border-gray-200";

  return (
    <div className={"border rounded-xl overflow-hidden " + (open ? "border-gray-300" : "border-gray-200 hover:border-gray-300") + " bg-white transition-colors"}>
      <button className="w-full px-4 pt-3.5 pb-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-mono">
            {pos.symbol?.slice(0,3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{pos.symbol}</span>
              <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + chainColor}>{pos.network}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">${fmt(pos.size_usdt, 0)} investi · x{x.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className={"text-sm font-mono font-medium " + (up ? "text-green-600" : "text-red-500")}>
              {up ? "+" : ""}{fmt(pnl)} USDT
            </div>
            <div className={"text-[11px] font-mono " + (up ? "text-green-500" : "text-red-400")}>
              {up ? "+" : ""}{fmt(pnlPct)}%
            </div>
          </div>
          <svg className={"w-3.5 h-3.5 text-gray-400 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="mt-3">
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className={"h-full rounded-full transition-all " + (up ? "bg-gradient-to-r from-green-300 to-green-500" : "bg-gradient-to-r from-red-300 to-red-400")}
              style={{ width: Math.max(2, Math.abs(progPct)) + "%" }} />
          </div>
          <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-400">
            <span>Entrée ${fmtPrice(entry)}</span>
            <span>{progPct.toFixed(0)}% vers x2</span>
            <span>Target ${fmtPrice(target)}</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Entree",   value: "$" + fmtPrice(entry) },
              { label: "Actuel",   value: "$" + fmtPrice(current), color: up ? "text-green-600" : "text-red-500" },
              { label: "Target x2", value: "$" + fmtPrice(target), color: "text-yellow-600" },
              { label: "Investi",  value: "$" + fmt(pos.size_usdt, 0) },
              { label: "P&L",      value: (pnl >= 0 ? "+" : "") + fmt(pnl) + " USDT", color: up ? "text-green-600" : "text-red-500" },
              { label: "x Factor", value: x.toFixed(3) + "x", color: x >= 1 ? "text-green-600" : "text-red-500" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase mb-1">{m.label}</div>
                <div className={"text-[11px] font-mono " + (m.color || "text-gray-900")}>{m.value}</div>
              </div>
            ))}
          </div>
          {pos.dex_url && (
            <a href={pos.dex_url} target="_blank" rel="noopener noreferrer"
              className="block text-center py-2 rounded-lg border border-gray-200 text-[11px] text-gray-500 hover:border-gray-300 font-mono">
              Voir sur DEX →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function TokenCard({ token }: { token: any }) {
  const [open, setOpen] = useState(false);
  const chainColor = CHAIN_COLORS[token.network] || "text-gray-500 bg-gray-50 border-gray-200";
  const scoreColor = token.score >= 60 ? "text-green-600" : token.score >= 40 ? "text-yellow-600" : "text-red-400";
  const up = (token.price_change_24h || 0) >= 0;

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      <button className="w-full px-4 pt-3.5 pb-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-mono">
            {token.symbol?.slice(0,3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{token.name || token.symbol}</span>
              <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + chainColor}>{token.network}</span>
              {token.tradable && <span className="text-[9px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-mono">AUTO</span>}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              Liq ${(token.liquidity/1000).toFixed(0)}k · Age {token.age_days}j · Vol/Liq {fmt(token.vol_liq_ratio, 1)}×
            </div>
          </div>
          <div className="text-right">
            <div className={"text-sm font-mono font-medium " + scoreColor}>{token.score}/100</div>
            <div className={"text-[11px] font-mono " + (up ? "text-green-500" : "text-red-400")}>
              {up ? "+" : ""}{fmt(token.price_change_24h, 1)}%
            </div>
          </div>
        </div>
        <div className="mt-2.5 h-[3px] bg-gray-100 rounded-full overflow-hidden">
          <div className={"h-full rounded-full " + (token.score >= 60 ? "bg-green-400" : token.score >= 40 ? "bg-yellow-400" : "bg-red-300")}
            style={{ width: token.score + "%" }} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50 space-y-3">
          {token.signals?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {token.signals.map((s: string, i: number) => (
                <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-lg font-mono text-gray-500">{s}</span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            {token.dex_url && (
              <a href={token.dex_url} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg border border-gray-200 text-[11px] text-gray-500 text-center hover:border-gray-300 font-mono">
                Voir sur DEX →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DexPage() {
  const { data: posData }    = useApi<any>("/api/dex/positions", 60000);
  const { data: tokensData } = useApi<any>("/api/dex/tokens", 3600000);
  const [tab, setTab]        = useState<"positions"|"radar">("positions");

  const positions = posData?.positions || [];
  const tokens    = (tokensData?.tokens || []).sort((a: any, b: any) => b.score - a.score);
  const totalPnl  = posData?.total_pnl || 0;
  const invested  = posData?.total_invested || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Pepites DEX</h1>
            <p className="text-[11px] text-gray-400 font-mono">Simulation · Multichain</p>
          </div>
          <div className={"text-sm font-mono font-semibold " + (totalPnl >= 0 ? "text-green-600" : "text-red-500")}>
            {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)} USDT
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        <div className="flex gap-2">
          {[
            { key: "positions", label: "Positions (" + positions.length + ")" },
            { key: "radar",     label: "Radar (" + tokens.length + ")" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={"text-[11px] px-4 py-2 rounded-xl border transition-colors font-mono " +
                (tab === t.key ? "border-gray-400 bg-white text-gray-900 font-medium" : "border-gray-200 bg-white text-gray-400 hover:border-gray-300")}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "positions" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Investi</div>
                <div className="text-xl font-mono font-semibold text-gray-900">${fmt(invested, 0)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">USDT simulation</div>
              </div>
              <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">P&L total</div>
                <div className={"text-xl font-mono font-semibold " + (totalPnl >= 0 ? "text-green-600" : "text-red-500")}>
                  {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">USDT simulation</div>
              </div>
            </div>

            {positions.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
                <p className="text-gray-400 text-sm">Aucune position DEX</p>
                <p className="text-gray-300 text-xs mt-1 font-mono">Les achats apparaitront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((pos: any, i: number) => <PositionCard key={i} pos={pos} />)}
              </div>
            )}
          </div>
        )}

        {tab === "radar" && (
          <div className="space-y-3">
            <p className="text-[11px] text-gray-400 font-mono">
              Tokens scorés selon age, chaîne, vélocité et sécurité.
              Base et Solana prioritaires. BSC pénalisé.
            </p>
            {tokens.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
                <p className="text-gray-400 text-sm">Collecte en cours...</p>
                <p className="text-gray-300 text-xs mt-1 font-mono">Mise a jour toutes les 2 heures</p>
              </div>
            ) : (
              tokens.map((t: any, i: number) => <TokenCard key={i} token={t} />)
            )}
          </div>
        )}

        <p className="text-[10px] text-gray-300 text-center font-mono pb-2">
          Toutes les positions sont simulées. Ne pas investir sans DYOR.
        </p>
      </div>
    </div>
  );
}
