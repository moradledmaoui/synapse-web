"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApi } from "../hooks/useApi";

const API_URL = "";

interface Trade {
  symbol: string;
  side: string;
  strategy: string;
  entry_price: number;
  exit_price: number;
  size_usdt: number;
  pnl_usdt: number;
  pnl_pct: number;
  won: boolean;
  opened_at: string;
  closed_at: string;
  reason: string;
  regime_at_open?: string;
  coach_close?: Record<string, string>;
  coach_open?: Record<string, string>;
}

interface Trades { trades: Trade[]; total: number; }

function formatDuration(opened: string, closed: string): string {
  try {
    const diff = new Date(closed).getTime() - new Date(opened).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m.toString().padStart(2,"0")}min` : `${m}min`;
  } catch { return "—"; }
}

function JournalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initStrategy = searchParams.get("strategy") || "";
  const initRegime = searchParams.get("regime") || "";
  const initResult = searchParams.get("result") || "";
  const initType = searchParams.get("type") || "";
  const initFilter = searchParams.get("filter") || "";

  const [strategy, setStrategy] = useState(initStrategy);
  const [regime, setRegime] = useState(initRegime);
  const [result, setResult] = useState(initResult);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, loading } = useApi<Trades>("/api/trades?limit=200", 30000);

  const trades = data?.trades || [];
  const strategies = [...new Set(trades.map(t => t.strategy))].filter(Boolean);
  const regimes = [...new Set(trades.map(t => t.regime_at_open))].filter(Boolean);

  const hasActiveFilter = strategy || regime || result || initType;

  const filtered = trades.filter(t => {
    if (strategy && t.strategy !== strategy) return false;
    if (regime && t.regime_at_open !== regime) return false;
    if (result === "win" && !t.won) return false;
    if (result === "loss" && t.won) return false;
    if (initType === "rejected") return false;
    return true;
  });

  const wins = filtered.filter(t => t.won);
  const totalPnl = filtered.reduce((s, t) => s + (t.pnl_usdt || 0), 0);
  const winRate = filtered.length ? (wins.length / filtered.length * 100) : 0;
  const bestTrade = filtered.length ? Math.max(...filtered.map(t => t.pnl_usdt || 0)) : 0;

  function clearFilters() {
    setStrategy(""); setRegime(""); setResult("");
    router.push("/journal");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Journal</div>
        <div className="text-[10px] text-gray-400">{filtered.length} trades</div>
      </div>

      {/* Bandeau filtre actif */}
      {hasActiveFilter && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-center gap-3">
          <div className="text-[11px] text-blue-700 flex items-center gap-2 flex-wrap flex-1">
            <span className="font-medium">Filtres actifs :</span>
            {strategy && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{strategy.replace(/_/g, " ")}</span>}
            {regime && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{regime.toUpperCase()}</span>}
            {result && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{result === "win" ? "Gagnants" : "Perdants"}</span>}
            {initType === "rejected" && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Signaux rejetés</span>}
            <span className="text-blue-500">· {filtered.length} trades correspondants</span>
          </div>
          <button onClick={clearFilters} className="text-[10px] text-blue-600 border border-blue-200 bg-white px-3 py-1 rounded-lg hover:bg-blue-50">
            Effacer les filtres
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {[
          { label: "Trades", value: filtered.length.toString() },
          { label: "Win rate", value: `${winRate.toFixed(1)}%`, color: winRate >= 50 ? "text-green-600" : "text-red-500" },
          { label: "P&L total", value: `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? "text-green-600" : "text-red-500" },
          { label: "Meilleur", value: `+${bestTrade.toFixed(2)}`, color: "text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
            <div className={`font-mono text-sm font-semibold ${s.color || "text-gray-900"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="px-6 pb-3 flex gap-2 flex-wrap">
        <select value={strategy} onChange={e => setStrategy(e.target.value)}
          className="text-[11px] border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option value="">Toutes stratégies</option>
          {strategies.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
        </select>
        <select value={regime} onChange={e => setRegime(e.target.value)}
          className="text-[11px] border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option value="">Tous régimes</option>
          {regimes.map(r => <option key={r} value={r}>{r?.toUpperCase()}</option>)}
        </select>
        <select value={result} onChange={e => setResult(e.target.value)}
          className="text-[11px] border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
          <option value="">Tous résultats</option>
          <option value="win">Gagnants</option>
          <option value="loss">Perdants</option>
        </select>
      </div>

      {/* Liste trades */}
      <div className="px-6 pb-20 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Aucun trade avec ces filtres</div>
        ) : filtered.map((trade, i) => {
          const key = `${trade.symbol}-${i}`;
          const isExpanded = expanded === key;
          const duration = formatDuration(trade.opened_at, trade.closed_at);
          const closedDate = trade.closed_at?.slice(0, 16).replace("T", " ") || "—";
          const isWin = trade.won;
          const regimeColor: Record<string, string> = {
            bull: "bg-green-50 text-green-700", bear: "bg-red-50 text-red-700",
            chop: "bg-yellow-50 text-yellow-700", panic: "bg-red-100 text-red-800",
          };

          return (
            <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${isWin ? "text-green-500" : "text-red-400"}`}>
                      {isWin ? "✓" : "✕"}
                    </span>
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {trade.symbol.replace("USDT", "/USDT")}
                    </span>
                    {trade.regime_at_open && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${regimeColor[trade.regime_at_open] || "bg-gray-100 text-gray-600"}`}>
                        {trade.regime_at_open.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {trade.strategy.replace(/_/g, " ").toUpperCase()} · {closedDate} · {duration}
                  </div>
                </div>
                <div className={`font-mono text-sm font-semibold ${isWin ? "text-green-600" : "text-red-500"}`}>
                  {trade.pnl_usdt >= 0 ? "+" : ""}{(trade.pnl_usdt || 0).toFixed(2)} USDT
                  <span className="text-[10px] opacity-60 ml-1">({trade.pnl_pct >= 0 ? "+" : ""}{(trade.pnl_pct || 0).toFixed(2)}%)</span>
                </div>
              </div>

              <div className="px-5 py-2.5 grid grid-cols-4 gap-2 border-b border-gray-100">
                {[
                  { label: "Entrée", value: trade.entry_price?.toFixed(4) || "—" },
                  { label: "Sortie", value: trade.exit_price?.toFixed(4) || "—" },
                  { label: "Taille", value: `${(trade.size_usdt || 0).toFixed(0)} USDT` },
                  { label: "Raison", value: trade.reason?.replace(/_/g, " ") || "—" },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-lg px-2.5 py-2">
                    <div className="text-[9px] text-gray-400 uppercase mb-0.5">{f.label}</div>
                    <div className="text-[11px] font-medium text-gray-700 truncate">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Coach accordion */}
              <button onClick={() => setExpanded(isExpanded ? null : key)}
                className="w-full px-5 py-2.5 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold">AI</div>
                  <span className="text-[10px] font-medium text-gray-700">Analyse du Coach</span>
                </div>
                <span className="text-[10px] text-gray-400">{isExpanded ? "▲" : "▼"}</span>
              </button>

              {isExpanded && (
                <div className="px-5 py-3 space-y-3 border-t border-gray-100">
                  {trade.coach_open?.why && (
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">Pourquoi ce trade a été ouvert</div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{trade.coach_open.why}</p>
                    </div>
                  )}
                  {trade.coach_close?.what_happened && (
                    <div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1">Ce qui s'est passé</div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{trade.coach_close.what_happened}</p>
                    </div>
                  )}
                  {trade.coach_close?.lesson && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2.5">
                      <div className="text-[9px] font-bold text-green-700 uppercase mb-1">Ce qu'on en retient</div>
                      <p className="text-[11px] text-green-800 leading-relaxed">{trade.coach_close.lesson}</p>
                    </div>
                  )}
                  <a href={`/coach?symbol=${trade.symbol}&pnl=${trade.pnl_usdt}&strategy=${trade.strategy}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium bg-[#111] text-white px-3 py-1.5 rounded-lg no-underline">
                    Discuter avec le Coach →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Chargement...</div>}>
      <JournalContent />
    </Suspense>
  );
}
