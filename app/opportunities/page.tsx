"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}

const CHAIN_COLORS: Record<string, string> = {
  base:     "text-blue-600 bg-blue-50 border-blue-200",
  Base:     "text-blue-600 bg-blue-50 border-blue-200",
  solana:   "text-purple-600 bg-purple-50 border-purple-200",
  Solana:   "text-purple-600 bg-purple-50 border-purple-200",
  BSC:      "text-yellow-600 bg-yellow-50 border-yellow-200",
};

const DECISION_COLORS: Record<string, string> = {
  watching: "text-yellow-600 bg-yellow-50 border-yellow-200",
  bought:   "text-green-600 bg-green-50 border-green-200",
  exited:   "text-gray-500 bg-gray-50 border-gray-200",
  rejected: "text-red-400 bg-red-50 border-red-200",
};

const EXIT_LABELS: Record<string, string> = {
  take_profit_x2:  "TP x2 ✅",
  hard_stop_loss:  "Hard SL ❌",
  time_stop_48h:   "Time Stop ⏱",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 60 ? "bg-green-400" : score >= 45 ? "bg-yellow-400" : "bg-red-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
        <div className={color + " h-full rounded-full"} style={{ width: score + "%" }} />
      </div>
      <span className="text-[10px] font-mono text-gray-500 w-8">{score}/100</span>
    </div>
  );
}

function WatchCard({ token }: { token: any }) {
  const [open, setOpen] = useState(false);
  const chainColor  = CHAIN_COLORS[token.network] || "text-gray-500 bg-gray-50 border-gray-200";
  const decColor    = DECISION_COLORS[token.decision] || "text-gray-400 bg-gray-50 border-gray-100";
  const age         = parseFloat(token.age_hours || 0);
  const liq         = parseFloat(token.liq_at_detect || 0);
  const score       = parseInt(token.score || 0);
  const multiple    = parseFloat(token.max_multiple_7d || 1);
  const exitLabel   = EXIT_LABELS[token.exit_reason] || token.exit_reason || "";

  return (
    <div className={"border rounded-xl overflow-hidden transition-colors bg-white " + (open ? "border-gray-300" : "border-gray-200 hover:border-gray-300")}>
      <button className="w-full px-4 pt-3 pb-2.5 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 font-mono flex-shrink-0">
            {token.symbol?.replace(/[^\w]/g, "").slice(0,3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{token.symbol}</span>
              <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + chainColor}>{token.network}</span>
              <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + decColor}>{token.decision}</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {age.toFixed(1)}h · ${(liq/1000).toFixed(0)}k liq
              {token.absorption_signal && " · ⚡ absorption"}
              {token.social_present && " · 🌐 social"}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {token.decision === "exited" && (
              <div className={"text-sm font-mono font-medium " + (multiple >= 2 ? "text-green-600" : "text-red-500")}>
                {multiple.toFixed(2)}x
              </div>
            )}
            {token.decision === "bought" && (
              <div className="text-sm font-mono font-medium text-green-600">
                {multiple.toFixed(2)}x
              </div>
            )}
            {exitLabel && <div className="text-[9px] font-mono text-gray-400">{exitLabel}</div>}
          </div>
        </div>
        <div className="mt-2">
          <ScoreBar score={score} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-3 pt-2 border-t border-gray-100 bg-gray-50 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Liq",      value: "$" + (liq/1000).toFixed(0) + "k" },
              { label: "Age",      value: age.toFixed(1) + "h" },
              { label: "Rug",      value: (token.rug_score || "--") + "/100", color: parseInt(token.rug_score) <= 20 ? "text-green-600" : "text-red-400" },
              { label: "Top 10",   value: fmt(token.top10_pct, 0) + "%" },
              { label: "Absorb",   value: token.absorption_signal ? "Oui ⚡" : "Non", color: token.absorption_signal ? "text-green-600" : "text-gray-400" },
              { label: "Social",   value: token.social_present ? "Oui 🌐" : "Non", color: token.social_present ? "text-green-600" : "text-gray-400" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-lg px-2.5 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase mb-1">{m.label}</div>
                <div className={"text-[11px] font-mono " + (m.color || "text-gray-900")}>{m.value}</div>
              </div>
            ))}
          </div>
          {token.decision_reason && (
            <p className="text-[10px] text-gray-400 font-mono leading-relaxed">{token.decision_reason}</p>
          )}
          {token.dex_url && (
            <a href={token.dex_url} target="_blank" rel="noopener noreferrer"
              className="block text-center py-1.5 rounded-lg border border-gray-200 text-[10px] text-gray-400 hover:border-gray-300 font-mono">
              Voir sur DEX
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PositionCard({ pos }: { pos: any }) {
  const buy   = parseFloat(pos.buy_price || pos.price_at_detect || 1);
  const multi = parseFloat(pos.max_multiple_7d || 1);
  const pct   = (multi - 1) * 100;
  const up    = multi >= 1;

  return (
    <div className="border border-green-200 bg-white rounded-xl px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{pos.symbol}</span>
            <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + (CHAIN_COLORS[pos.network] || "")}>{pos.network}</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
            Entrée ${buy.toFixed(6)} · score {pos.score}/100
          </div>
        </div>
        <div className="text-right">
          <div className={"text-sm font-mono font-semibold " + (up ? "text-green-600" : "text-red-500")}>
            {multi.toFixed(3)}x
          </div>
          <div className={"text-[10px] font-mono " + (up ? "text-green-500" : "text-red-400")}>
            {up ? "+" : ""}{fmt(pct, 1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DexPage() {
  const { data: labData }    = useApi<any>("/api/dex/lab/watchlist", 60000);
  const { data: posData }    = useApi<any>("/api/dex/positions", 60000);
  const [tab, setTab]        = useState<"positions"|"watchlist"|"exited">("watchlist");

  const watching  = labData?.watching || [];
  const bought    = labData?.bought || [];
  const exited    = labData?.exited || [];
  const stats     = labData?.stats || {};
  const positions = posData?.positions || [];
  const totalPnl  = posData?.total_pnl || 0;

  const wins   = stats.wins || 0;
  const losses = stats.losses || 0;
  const total  = wins + losses;
  const wr     = total > 0 ? Math.round(wins / total * 100) : "--";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">DEX Lab</h1>
            <p className="text-[11px] text-gray-400 font-mono">Base · Solana · Phase 1</p>
          </div>
          <div className="text-[11px] text-gray-400 font-mono text-right">
            <div>{stats.watching_count || 0} watch · {stats.bought_count || 0} open</div>
            <div className="text-[10px]">WR {wr}% sur {total} exits</div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Scannés", value: (stats.watching_count || 0) + (stats.bought_count || 0) + (stats.exited_count || 0) },
            { label: "Wins", value: wins, color: "text-green-600" },
            { label: "Losses", value: losses, color: "text-red-500" },
          ].map(s => (
            <div key={s.label} className="border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
              <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
              <div className={"text-lg font-mono font-semibold " + (s.color || "text-gray-900")}>{s.value}</div>
            </div>
          ))}
        </div>

        {positions.length > 0 && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-3">
            <div className="text-[10px] text-yellow-600 font-mono uppercase mb-2">Positions DEX existantes</div>
            <div className={"text-sm font-mono font-medium " + (totalPnl >= 0 ? "text-green-600" : "text-red-500")}>
              {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)} USDT · {positions.length} positions
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "watchlist", label: "Watchlist (" + watching.length + ")" },
            { key: "positions", label: "Achetés (" + bought.length + ")" },
            { key: "exited",    label: "Sortis (" + exited.length + ")" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={"flex-shrink-0 text-[11px] px-4 py-2 rounded-xl border transition-colors font-mono " +
                (tab === t.key ? "border-gray-400 bg-white text-gray-900 font-medium" : "border-gray-200 bg-white text-gray-400 hover:border-gray-300")}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "watchlist" && (
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 font-mono">
              Tokens détectés sur Base et Solana. Analyse automatique H+3 avant décision d achat.
            </p>
            {watching.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
                <p className="text-gray-400 text-sm">Scan en cours...</p>
                <p className="text-gray-300 text-xs mt-1 font-mono">Prochain scan dans 30 minutes</p>
              </div>
            ) : (
              watching.map((t: any) => <WatchCard key={t.id} token={t} />)
            )}
          </div>
        )}

        {tab === "positions" && (
          <div className="space-y-3">
            {bought.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
                <p className="text-gray-400 text-sm">Aucune position ouverte</p>
                <p className="text-gray-300 text-xs mt-1 font-mono">Les achats apparaissent apres H+3</p>
              </div>
            ) : (
              bought.map((t: any) => <PositionCard key={t.id} pos={t} />)
            )}
          </div>
        )}

        {tab === "exited" && (
          <div className="space-y-3">
            {exited.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
                <p className="text-gray-400 text-sm">Aucune position sortie</p>
                <p className="text-gray-300 text-xs mt-1 font-mono">Les exits apparaissent ici</p>
              </div>
            ) : (
              exited.map((t: any) => <WatchCard key={t.id} token={t} />)
            )}
          </div>
        )}

        <p className="text-[9px] text-gray-300 text-center font-mono pb-2">
          Phase 1 · Simulation uniquement · 30j de données pour évaluer le modèle
        </p>

      </div>
    </div>
  );
}
