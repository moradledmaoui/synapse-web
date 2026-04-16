"use client";
import { useState } from "react";

const API_URL = "";

const UNIVERSES = [
  { id: "top20", label: "Top 20", desc: "Les 20 plus grandes cryptos" },
  { id: "altcoins", label: "Altcoins", desc: "Mid-cap sélectionnés" },
  { id: "defi", label: "DeFi", desc: "Protocoles décentralisés" },
  { id: "memecoins", label: "Memecoins", desc: "Tokens spéculatifs" },
  { id: "lowcap", label: "Low Cap", desc: "Petites capitalisations" },
];

const STRATEGIES = [
  { id: "rsi", label: "RSI" },
  { id: "momentum", label: "Momentum" },
  { id: "mean_reversion", label: "Mean Reversion" },
  { id: "volume_breakout", label: "Volume Breakout" },
  { id: "macd", label: "MACD" },
  { id: "ema_crossover", label: "EMA Cross" },
  { id: "stochastic_rsi", label: "Stoch RSI" },
  { id: "vwap", label: "VWAP" },
  { id: "supertrend", label: "Supertrend" },
  { id: "obv", label: "OBV" },
];

const PERIODS = [
  { id: "7", label: "7 jours" },
  { id: "30", label: "30 jours" },
  { id: "90", label: "90 jours" },
  { id: "180", label: "180 jours" },
];

interface BacktestResult {
  strategy: string;
  universe: string;
  period_days: number;
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  sharpe_ratio: number;
  max_drawdown: number;
  best_trade: number;
  worst_trade: number;
  by_regime?: Record<string, { trades: number; pnl: number }>;
}

interface MatrixResult {
  [strategy: string]: {
    [universe: string]: number;
  };
}

const REGIME_LABELS: Record<string, string> = {
  bull: "Marché haussier",
  bear: "Marché baissier",
  chop: "Marché sans direction",
};

const REGIME_STYLES: Record<string, { bg: string; text: string }> = {
  bull: { bg: "bg-green-50", text: "text-green-700" },
  bear: { bg: "bg-red-50", text: "text-red-700" },
  chop: { bg: "bg-yellow-50", text: "text-yellow-700" },
};

export default function Backtest() {
  const [mode, setMode] = useState<"simple" | "matrix">("simple");

  // Simple
  const [selectedUniverse, setSelectedUniverse] = useState("top20");
  const [selectedStrategy, setSelectedStrategy] = useState("rsi");
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Matrix
  const [matrixUniverses, setMatrixUniverses] = useState<string[]>(["top20"]);
  const [matrixStrategies, setMatrixStrategies] = useState<string[]>(["rsi", "momentum", "macd"]);
  const [matrixPeriod, setMatrixPeriod] = useState("30");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [matrixResult, setMatrixResult] = useState<MatrixResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleItem(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  async function runSimple() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/backtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: selectedStrategy,
          universe: selectedUniverse,
          period_days: parseInt(selectedPeriod),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur backtest");
    } finally {
      setLoading(false);
    }
  }

  async function runMatrix() {
    if (matrixUniverses.length === 0 || matrixStrategies.length === 0) {
      setError("Sélectionnez au moins 1 univers et 1 stratégie");
      return;
    }
    setLoading(true);
    setError(null);
    setMatrixResult(null);
    try {
      const res = await fetch(`${API_URL}/api/backtest/matrix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universes: matrixUniverses,
          strategies: matrixStrategies,
          period_days: parseInt(matrixPeriod),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMatrixResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur matrix");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Backtest</div>
        <div className="flex gap-1.5">
          {[{ id: "simple", label: "Simple" }, { id: "matrix", label: "Matrix" }].map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id as "simple" | "matrix"); setError(null); setResult(null); setMatrixResult(null); }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${mode === m.id ? "bg-[#111] text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">

        {mode === "simple" ? (
          <>
            {/* Stratégie */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Stratégie</div>
              <div className="flex flex-wrap gap-2">
                {STRATEGIES.map(s => (
                  <button key={s.id} onClick={() => setSelectedStrategy(s.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${selectedStrategy === s.id ? "bg-[#111] text-white border-[#111]" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Univers */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Univers</div>
              <div className="grid grid-cols-2 gap-2">
                {UNIVERSES.map(u => (
                  <button key={u.id} onClick={() => setSelectedUniverse(u.id)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${selectedUniverse === u.id ? "bg-[#111] border-[#111]" : "bg-gray-50 border-gray-200"}`}>
                    <div className={`text-[11px] font-bold ${selectedUniverse === u.id ? "text-white" : "text-gray-900"}`}>{u.label}</div>
                    <div className={`text-[9px] mt-0.5 ${selectedUniverse === u.id ? "text-gray-300" : "text-gray-400"}`}>{u.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Période */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Période</div>
              <div className="grid grid-cols-4 gap-2">
                {PERIODS.map(p => (
                  <button key={p.id} onClick={() => setSelectedPeriod(p.id)}
                    className={`text-[11px] font-bold py-2 rounded-lg border transition-colors ${selectedPeriod === p.id ? "bg-[#111] text-white border-[#111]" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={runSimple} disabled={loading}
              className="w-full bg-[#111] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50">
              {loading ? "Analyse en cours..." : "Lancer le backtest"}
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[11px] text-red-600">{error}</div>}

            {result && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-[#111] px-5 py-4">
                  <div className="font-mono text-sm font-bold text-white">
                    {STRATEGIES.find(s => s.id === result.strategy)?.label} · {UNIVERSES.find(u => u.id === result.universe)?.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{result.period_days} jours · {result.total_trades} trades</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100">
                  {[
                    { label: "P&L total", value: `${result.total_pnl >= 0 ? "+" : ""}${result.total_pnl.toFixed(2)} USDT`, color: result.total_pnl >= 0 ? "text-green-600" : "text-red-600" },
                    { label: "Win Rate", value: `${result.win_rate.toFixed(1)}%`, color: result.win_rate >= 50 ? "text-green-600" : "text-red-600" },
                    { label: "Sharpe", value: result.sharpe_ratio.toFixed(2), color: result.sharpe_ratio >= 1 ? "text-green-600" : "text-yellow-600" },
                    { label: "Max Drawdown", value: `${result.max_drawdown.toFixed(1)}%`, color: "text-red-600" },
                    { label: "Meilleur trade", value: `+${result.best_trade.toFixed(2)}`, color: "text-green-600" },
                    { label: "Pire trade", value: `${result.worst_trade.toFixed(2)}`, color: "text-red-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                      <div className="text-[9px] text-gray-400 uppercase mb-1">{s.label}</div>
                      <div className={`font-mono text-sm font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {result.by_regime && (
                  <div className="p-4">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Performance par régime</div>
                    <div className="space-y-2">
                      {Object.entries(result.by_regime).map(([regime, data]) => {
                        const style = REGIME_STYLES[regime] || { bg: "bg-gray-50", text: "text-gray-600" };
                        return (
                          <div key={regime} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="text-[11px] text-gray-600">{REGIME_LABELS[regime] || regime}</div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{regime.toUpperCase()}</span>
                              <span className="text-[10px] text-gray-400">{data.trades} trades</span>
                              <span className={`font-mono text-[11px] font-bold ${data.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {data.pnl >= 0 ? "+" : ""}{data.pnl.toFixed(1)} USDT
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* MATRIX — Sélecteur stratégies */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Stratégies à comparer
                <span className="text-gray-300 ml-2 normal-case font-normal">multi-sélection</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STRATEGIES.map(s => (
                  <button key={s.id}
                    onClick={() => toggleItem(matrixStrategies, setMatrixStrategies, s.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${matrixStrategies.includes(s.id) ? "bg-[#111] text-white border-[#111]" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              {matrixStrategies.length > 0 && (
                <div className="mt-2 text-[10px] text-gray-400">{matrixStrategies.length} stratégie{matrixStrategies.length > 1 ? "s" : ""} sélectionnée{matrixStrategies.length > 1 ? "s" : ""}</div>
              )}
            </div>

            {/* MATRIX — Univers */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Univers à comparer
                <span className="text-gray-300 ml-2 normal-case font-normal">multi-sélection</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {UNIVERSES.map(u => (
                  <button key={u.id}
                    onClick={() => toggleItem(matrixUniverses, setMatrixUniverses, u.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${matrixUniverses.includes(u.id) ? "bg-[#111] text-white border-[#111]" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Période */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Période</div>
              <div className="grid grid-cols-4 gap-2">
                {PERIODS.map(p => (
                  <button key={p.id} onClick={() => setMatrixPeriod(p.id)}
                    className={`text-[11px] font-bold py-2 rounded-lg border transition-colors ${matrixPeriod === p.id ? "bg-[#111] text-white border-[#111]" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={runMatrix} disabled={loading || matrixUniverses.length === 0 || matrixStrategies.length === 0}
              className="w-full bg-[#111] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50">
              {loading
                ? "Matrix en cours..."
                : `Lancer la Matrix (${matrixStrategies.length} stratégies × ${matrixUniverses.length} univers)`
              }
            </button>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[11px] text-red-600">{error}</div>}

            {matrixResult && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-[#111] text-white px-4 py-3 text-[9px] font-bold text-left uppercase tracking-wide">Stratégie</th>
                        {matrixUniverses.map(u => (
                          <th key={u} className="bg-[#111] text-white px-4 py-3 text-[9px] font-bold text-left uppercase tracking-wide">
                            {UNIVERSES.find(un => un.id === u)?.label}
                          </th>
                        ))}
                        <th className="bg-[#111] text-white px-4 py-3 text-[9px] font-bold text-left uppercase tracking-wide">Meilleur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(matrixResult).map(([strategy, results]) => {
                        const values = matrixUniverses.map(u => results[u] || 0);
                        const best = Math.max(...values);
                        const worst = Math.min(...values);
                        const bestUniverse = matrixUniverses[values.indexOf(best)];
                        return (
                          <tr key={strategy} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3 text-[11px] font-bold text-gray-900">
                              {STRATEGIES.find(s => s.id === strategy)?.label || strategy}
                            </td>
                            {matrixUniverses.map(u => {
                              const val = results[u] || 0;
                              const isBest = val === best && best > 0;
                              const isWorst = val === worst && worst < 0;
                              return (
                                <td key={u} className={`px-4 py-3 ${isBest ? "bg-green-50" : isWorst ? "bg-red-50" : ""}`}>
                                  <span className={`font-mono text-[11px] font-bold ${val >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {val >= 0 ? "+" : ""}{val.toFixed(1)}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-bold text-gray-600">
                                {UNIVERSES.find(u => u.id === bestUniverse)?.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Ligne meilleure stratégie par univers */}
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td className="px-4 py-2 text-[9px] text-gray-400 font-bold uppercase">Meilleure strat.</td>
                        {matrixUniverses.map(u => {
                          const bestStrat = Object.entries(matrixResult).reduce((best, [strat, results]) =>
                            (results[u] || 0) > (matrixResult[best]?.[u] || 0) ? strat : best,
                            Object.keys(matrixResult)[0]
                          );
                          return (
                            <td key={u} className="px-4 py-2">
                              <span className="text-[10px] font-bold text-gray-900">
                                {STRATEGIES.find(s => s.id === bestStrat)?.label}
                              </span>
                            </td>
                          );
                        })}
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2 border-t border-gray-100 flex gap-4">
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded" />
                    Meilleur de la colonne
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                    <div className="w-3 h-3 bg-red-50 border border-red-200 rounded" />
                    Pire de la colonne
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
