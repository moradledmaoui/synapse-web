"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

interface Trade {
  symbol: string;
  side: string;
  strategy: string;
  entry_price: number;
  exit_price: number;
  size_usdt: number;
  pnl_usdt: number;
  pnl_pct: number;
  reason: string;
  opened_at: string;
  closed_at: string;
  won: boolean;
  coach_open?: Record<string, string>;
  coach_close?: Record<string, string>;
}

interface Trades {
  trades: Trade[];
  total: number;
}

function formatDuration(opened: string, closed: string): string {
  try {
    const diff = new Date(closed).getTime() - new Date(opened).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    return `${Math.floor(minutes / 60)}h ${(minutes % 60).toString().padStart(2, "0")}min`;
  } catch { return "–"; }
}

function formatPrice(price: number): string {
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

const REASON_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  take_profit: { bg: "bg-green-50", text: "text-green-700", label: "Objectif atteint" },
  stop_loss: { bg: "bg-red-50", text: "text-red-700", label: "Sécurité déclenchée" },
  manual_close: { bg: "bg-blue-50", text: "text-blue-700", label: "Clôture manuelle" },
  timeout_win: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Temps écoulé (gain)" },
  timeout_loss: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Temps écoulé (perte)" },
};

export default function Journal() {
  const { data, loading } = useApi<Trades>("/api/trades?limit=100", 30000);
  const [filterResult, setFilterResult] = useState("tous");
  const [filterStrategy, setFilterStrategy] = useState("toutes");
  const [search, setSearch] = useState("");

  const trades = data?.trades || [];
  const wins = trades.filter(t => t.won);
  const totalPnl = trades.reduce((s, t) => s + t.pnl_usdt, 0);
  const winRate = trades.length ? (wins.length / trades.length * 100) : 0;
  const bestTrade = trades.length ? Math.max(...trades.map(t => t.pnl_usdt)) : 0;
  const strategies = [...new Set(trades.map(t => t.strategy))];

  const filtered = trades.filter(t => {
    if (filterResult === "gains" && !t.won) return false;
    if (filterResult === "pertes" && t.won) return false;
    if (filterStrategy !== "toutes" && t.strategy !== filterStrategy) return false;
    if (search && !t.symbol.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Journal</div>
        <div className="text-[10px] text-gray-400">{trades.length} trades fermés</div>
      </div>

      {/* METRICS */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 grid grid-cols-4 gap-3">
        {[
          { label: "Trades fermés", value: trades.length.toString(), color: "text-gray-900" },
          { label: "Win Rate", value: `${winRate.toFixed(0)}%`, color: winRate >= 50 ? "text-green-600" : "text-yellow-600" },
          { label: "P&L total", value: `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? "text-green-600" : "text-red-600" },
          { label: "Meilleur trade", value: `+${bestTrade.toFixed(2)}`, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
            <div className={`font-mono text-sm font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex gap-2 flex-wrap items-center">
        {[
          { id: "tous", label: "Tous" },
          { id: "gains", label: "Gains" },
          { id: "pertes", label: "Pertes" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterResult(f.id)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              filterResult === f.id
                ? "bg-[#111] text-white border-[#111]"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}

        <select
          value={filterStrategy}
          onChange={e => setFilterStrategy(e.target.value)}
          className="text-[10px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
        >
          <option value="toutes">Toutes stratégies</option>
          {strategies.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, " ").toUpperCase()}</option>
          ))}
        </select>

        <div className="flex-1 min-w-[160px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="4" cy="4" r="3" stroke="#aaa" strokeWidth="1.2"/>
            <path d="M6.5 6.5L9 9" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un asset..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[10px] text-gray-600 outline-none w-full placeholder-gray-300"
          />
        </div>

        {(filterResult !== "tous" || filterStrategy !== "toutes" || search) && (
          <button
            onClick={() => { setFilterResult("tous"); setFilterStrategy("toutes"); setSearch(""); }}
            className="text-[10px] text-gray-400 hover:text-gray-600"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* TRADES */}
      <div className="px-6 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="text-gray-300 text-3xl mb-3">○</div>
            <div className="text-sm text-gray-400">Aucun trade — le Journal se remplira automatiquement</div>
          </div>
        ) : (
          filtered.map((trade, idx) => {
            const isUp = trade.pnl_usdt >= 0;
            const sign = isUp ? "+" : "";
            const duration = formatDuration(trade.opened_at, trade.closed_at);
            const closedDate = trade.closed_at?.slice(0, 16).replace("T", " ") || "–";
            const reasonStyle = REASON_STYLES[trade.reason] || { bg: "bg-gray-50", text: "text-gray-600", label: trade.reason };

            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                {/* Header */}
                <div className="px-5 pt-4 pb-3 flex justify-between items-start border-b border-gray-100">
                  <div>
                    <div className="font-mono text-sm font-bold text-gray-900">
                      {isUp ? "✅" : "❌"} {trade.symbol.replace("USDT", "/USDT")}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {trade.strategy.replace(/_/g, " ").toUpperCase()} · {closedDate} · {duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                      {sign}{trade.pnl_usdt.toFixed(2)} USDT
                      <span className="text-[10px] opacity-60 ml-1">({sign}{trade.pnl_pct.toFixed(2)}%)</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block border ${reasonStyle.bg} ${reasonStyle.text} border-current border-opacity-20`}>
                      {reasonStyle.label}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="px-5 py-2 flex gap-2 flex-wrap border-b border-gray-100">
                  {[
                    trade.side,
                    `Entrée ${formatPrice(trade.entry_price)}`,
                    `Sortie ${formatPrice(trade.exit_price)}`,
                    `${trade.size_usdt.toFixed(0)} USDT`,
                  ].map((tag) => (
                    <span key={tag} className="text-[9px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Coach */}
                {(trade.coach_open?.why || trade.coach_close?.analysis) && (
                  <div className="border-t-2 border-[#111]">

                    {trade.coach_open?.why && (
                      <details>
                        <summary className="px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gray-50 border-b border-gray-100 list-none">
                          <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">AI</div>
                          <span className="text-[10px] font-bold text-gray-900 flex-1">Pourquoi ce trade a été ouvert</span>
                          <span className="text-[9px] text-gray-400">▼</span>
                        </summary>
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                          {trade.coach_open.probability && (
                            <div className="inline-block text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full mb-2">
                              Chances estimées : {trade.coach_open.probability}
                            </div>
                          )}
                          <p className="text-[11px] text-gray-600 leading-relaxed">{trade.coach_open.why}</p>
                        </div>
                      </details>
                    )}

                    {trade.coach_close?.analysis && (
                      <details>
                        <summary className="px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gray-50 list-none">
                          <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">AI</div>
                          <span className="text-[10px] font-bold text-gray-900 flex-1">Ce qui s'est passé</span>
                          <span className="text-[9px] text-gray-400">▼</span>
                        </summary>
                        <div className="px-5 py-3 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${isUp ? "bg-green-500" : "bg-red-500"}`} />
                            <div className={`text-[11px] font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                              {trade.coach_close.result_title || (isUp ? "Gain réalisé" : "Perte limitée")}
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 leading-relaxed mb-2">{trade.coach_close.analysis}</p>
                          {trade.coach_close.lesson && (
                            <div className={`rounded-lg p-2.5 ${isUp ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                              <div className={`text-[9px] font-bold uppercase tracking-wide mb-1 ${isUp ? "text-green-700" : "text-yellow-700"}`}>
                                Ce qu'on en retient
                              </div>
                              <p className="text-[11px] text-gray-600 leading-relaxed">{trade.coach_close.lesson}</p>
                            </div>
                          )}
                          <a
                            href={`/coach?symbol=${trade.symbol}&context=closed&pnl=${trade.pnl_usdt}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#111] text-white px-3 py-1.5 rounded-lg no-underline mt-2"
                          >
                            Discuter avec le Coach
                          </a>
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
