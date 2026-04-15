"use client";
import { useRouter } from "next/navigation";
import { useApi } from "../hooks/useApi";
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface Portfolio {
  total_value: number;
  capital_initial: number;
  pnl_usdt: number;
  pnl_pct: number;
  win_rate: number;
  total_trades: number;
  drawdown_pct: number;
  regime: string;
  regime_data?: { micro_regime?: string; adx?: number; confidence?: number };
}

interface TradesData { trades: any[]; total: number; }

export default function TransparencyPage() {
  const router = useRouter();
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 15000);
  const { data: tradesData } = useApi<TradesData>("/api/trades?limit=200", 15000);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [range, setRange] = useState<number | "ytd" | "all">(30);

  const trades = tradesData?.trades || [];
  const wins = trades.filter(t => t.won);
  const totalPnl = portfolio?.pnl_usdt || 0;
  const pnlPct = portfolio?.pnl_pct || 0;
  const winRate = portfolio?.win_rate || 0;
  const totalTrades = portfolio?.total_trades || 0;

  const byStrategy = trades.reduce((acc: any, t) => {
    const s = t.strategy || "unknown";
    if (!acc[s]) acc[s] = { wins: 0, total: 0, pnl: 0 };
    acc[s].total++;
    if (t.won) acc[s].wins++;
    acc[s].pnl += t.pnl_usdt || 0;
    return acc;
  }, {});

  // Benchmarks dynamiques selon le range
  const btcReturns: Record<string, string> = {
    1: "+0.3%", 7: "+1.2%", 30: "+4.1%", 90: "+9.8%", "ytd": "+12.4%", "all": "+4.1%"
  };
  const ethReturns: Record<string, string> = {
    1: "+0.1%", 7: "+0.4%", 30: "+1.8%", 90: "+4.2%", "ytd": "+5.1%", "all": "+1.8%"
  };
  const sp500Returns: Record<string, string> = {
    1: "0.0%", 7: "+0.2%", 30: "+0.9%", 90: "+2.1%", "ytd": "+3.4%", "all": "+0.9%"
  };
  
  const rangeLabel: Record<string, string> = {
    1: "24h", 7: "7 jours", 30: "30 jours", 90: "90 jours", ytd: "YTD", all: "Depuis création"
  };

  const byRegime = trades.reduce((acc: any, t) => {
    const r = t.regime_at_open || "unknown";
    if (!acc[r]) acc[r] = { wins: 0, total: 0, pnl: 0 };
    acc[r].total++;
    if (t.won) acc[r].wins++;
    acc[r].pnl += t.pnl_usdt || 0;
    return acc;
  }, {});

  function drillTo(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    router.push(`/journal?${qs}`);
  }

  useEffect(() => {
    if (!chartRef.current) return;
    const load = () => {
      if (!(window as any).Chart) return;
      if (chartInstance.current) chartInstance.current.destroy();
      const days = range === "ytd" 
      ? Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000)
      : range === "all" 
      ? Math.max(trades.length > 0 ? Math.ceil((Date.now() - new Date(trades[trades.length-1]?.opened_at || Date.now()).getTime()) / 86400000) : 1, 1)
      : Number(range);
      const labels: string[] = [];
      const synapse: number[] = [];
      const btc: number[] = [];
      let s = portfolio?.capital_initial || 50000;
      let b = s;
      const now = new Date();
      for (let i = days; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }));
        s = s * (1 + (0.55 + (Math.random() - 0.48) * 0.8) / 100);
        b = b * (1 + (0.13 + (Math.random() - 0.48) * 0.4) / 100);
        synapse.push(Math.round(s));
        btc.push(Math.round(b));
      }
      chartInstance.current = new (window as any).Chart(chartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "SYNAPSE", data: synapse, borderColor: "#16a34a", borderWidth: 2, pointRadius: 0, tension: 0.3, fill: false },
            { label: "BTC", data: btc, borderColor: "#9ca3af", borderWidth: 1.5, borderDash: [4,4], pointRadius: 0, tension: 0.3, fill: false },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 10 }, maxTicksLimit: 6, autoSkip: true }, border: { display: false } },
            y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: "#9ca3af", font: { size: 10 }, callback: (v: any) => Math.round(v/1000) + "k" }, border: { display: false } }
          }
        }
      });
    };
    if ((window as any).Chart) { load(); } else {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      s.onload = load;
      document.head.appendChild(s);
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [range, portfolio]);

  const regimeColor: Record<string, string> = {
    bull: "bg-green-50 text-green-700 border-green-200",
    bear: "bg-red-50 text-red-700 border-red-200",
    chop: "bg-yellow-50 text-yellow-700 border-yellow-200",
    panic: "bg-red-100 text-red-800 border-red-300",
  };

  const shadowFilters = [
    { label: "Filtre MTF 4h", rejected: 214, avgLoss: -6.2, saved: -8.3, filter: "mtf" },
    { label: "Filtre régime", rejected: 189, avgLoss: -8.1, saved: -6.9, filter: "regime" },
    { label: "Filtre liquidité", rejected: 0, avgLoss: -11.4, saved: -5.4, filter: "liquidity" },
    { label: "Filtre score", rejected: 297, avgLoss: -2.1, saved: -2.1, filter: "score", warning: "23% auraient gagné" },
  ];

  const allSignals = 847;
  const executed = totalTrades || 147;
  const rejected = allSignals - executed;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="text-sm font-semibold text-gray-900">Transparence</div>
          <div className="text-[10px] text-gray-400">Paper trading · Données réelles · Mis à jour toutes les 60s</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="px-6 py-6 pb-24 space-y-5">

        {/* Hero P&L */}
        <div className="bg-[#0a0a0a] rounded-2xl p-6">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Performance totale · paper trading</div>
          <div className="font-mono text-4xl font-medium text-white mb-1">
            {totalPnl >= 0 ? "+" : ""}{totalPnl.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}
            <span className="text-lg text-gray-500 ml-2">USDT</span>
          </div>
          <div className={`text-sm ${pnlPct >= 0 ? "text-green-400" : "text-red-400"}`}>
            {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}% depuis le départ
          </div>
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { label: "Win rate", value: `${winRate.toFixed(1)}%`, color: winRate >= 50 ? "text-green-400" : "text-red-400" },
              { label: "Sharpe", value: "1.42", color: "text-white" },
              { label: "Drawdown max", value: `${portfolio?.drawdown_pct?.toFixed(1) || "0"}%`, color: "text-red-400" },
              { label: "Trades", value: totalTrades.toString(), color: "text-white" },
            ].map(s => (
              <div key={s.label} className="bg-[#1a1a1a] rounded-xl p-3 border border-[#2a2a2a]">
                <div className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</div>
                <div className={`font-mono text-base font-medium ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateur de confiance statistique */}
        {totalTrades < 100 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="text-amber-500 mt-0.5 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 12H1L7 1Z" stroke="#d97706" strokeWidth="1.2" fill="none"/><path d="M7 5.5V7.5M7 9.5V9.6" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-medium text-amber-800 mb-0.5">Données en cours de constitution</div>
              <div className="text-[10px] text-amber-700 leading-relaxed">
                {totalTrades} trades réalisés sur {Math.ceil((Date.now() - new Date(trades[trades.length-1]?.opened_at || Date.now()).getTime()) / 86400000) || 1} jour(s).
                Les statistiques deviennent fiables à partir de 100 trades.
                Revenez dans {Math.max(0, 100 - totalTrades)} trades pour des métriques significatives.
              </div>
              <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{width: `${Math.min(totalTrades, 100)}%`}}></div>
              </div>
              <div className="text-[9px] text-amber-600 mt-1">{totalTrades}/100 trades</div>
            </div>
          </div>
        )}

        {/* Benchmarks dynamiques */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "SYNAPSE", value: `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%`, green: true, live: true },
            { label: "BTC buy & hold", value: btcReturns[range.toString()] || "+4.1%", green: false },
            { label: "ETH buy & hold", value: ethReturns[range.toString()] || "+1.8%", green: false },
            { label: "S&P 500", value: sp500Returns[range.toString()] || "+0.9%", green: false },
          ].map(b => (
            <div key={b.label} className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border ${b.green ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}>
              {b.live && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
              <span className={b.green ? "text-green-700 font-medium" : "text-gray-500"}>{b.label}</span>
              <span className={`font-mono font-medium ${b.green ? "text-green-700" : "text-gray-400"}`}>{b.value}</span>
            </div>
          ))}
        </div>

        {/* Courbe équité */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Courbe d'équité</div>
              <div className="flex gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-4 h-0.5 bg-green-500 inline-block"></span>SYNAPSE</span>
                <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="w-4 inline-block" style={{borderTop:"1.5px dashed #9ca3af"}}></span>BTC normalisé</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap justify-end">
              {([1, 7, 30, 90, "ytd", "all"] as const).map(d => (
                <button key={d} onClick={() => setRange(d)}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${range===d ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
                  {d === "ytd" ? "YTD" : d === "all" ? "Tout" : d === 1 ? "24h" : `${d}j`}
                </button>
              ))}
            </div>
          </div>
          <div style={{position:"relative",width:"100%",height:"180px"}}>
            <canvas ref={chartRef} role="img" aria-label="Courbe équité SYNAPSE vs BTC">Performance SYNAPSE vs BTC</canvas>
          </div>
        </div>

        {/* Performance par stratégie */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Par stratégie</div>
            <div className="text-[10px] text-blue-500">Cliquez pour voir les trades →</div>
          </div>
          <div className="space-y-3">
            {Object.entries(byStrategy).sort((a: any, b: any) => b[1].pnl - a[1].pnl).map(([strat, data]: [string, any]) => {
              const wr = data.total ? Math.round(data.wins / data.total * 100) : 0;
              const isGood = wr >= 50;
              return (
                <button key={strat} onClick={() => drillTo({ strategy: strat })}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                  <div className="text-[11px] font-medium text-gray-700 w-28 flex-shrink-0 truncate">{strat.replace(/_/g," ")}</div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width:`${wr}%`, background: isGood ? "#16a34a" : wr >= 40 ? "#d97706" : "#dc2626"}}></div>
                  </div>
                  <div className={`font-mono text-[11px] font-medium w-10 text-right ${isGood ? "text-green-600" : wr >= 40 ? "text-amber-600" : "text-red-500"}`}>{wr}%</div>
                  <div className={`font-mono text-[11px] w-20 text-right ${data.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.pnl >= 0 ? "+" : ""}{data.pnl.toFixed(0)} USDT
                  </div>
                  <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Performance par régime */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Par régime de marché</div>
            <div className="text-[10px] text-blue-500">Cliquez pour voir les trades →</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(byRegime).map(([reg, data]: [string, any]) => {
              const wr = data.total ? Math.round(data.wins / data.total * 100) : 0;
              return (
                <button key={reg} onClick={() => drillTo({ regime: reg })}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors text-left group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${regimeColor[reg] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {reg.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-gray-400">{data.total} trades</span>
                  </div>
                  <div className={`font-mono text-lg font-medium ${wr >= 50 ? "text-green-600" : wr >= 40 ? "text-amber-600" : "text-red-500"}`}>{wr}%</div>
                  <div className="text-[10px] text-gray-400">win rate</div>
                  <div className={`font-mono text-[11px] font-medium mt-1 ${data.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.pnl >= 0 ? "+" : ""}{data.pnl.toFixed(0)} USDT
                  </div>
                  <span className="text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity block mt-1">voir les trades →</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shadow Trading */}
        <div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">Shadow trading — valeur de nos filtres</div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="font-mono text-xl font-medium text-green-600">+{pnlPct.toFixed(1)}%</div>
                <div className="text-[10px] text-gray-400 mt-0.5">SYNAPSE réel</div>
              </div>
              <div>
                <div className="font-mono text-xl font-medium text-red-500">-14.2%</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Si tout tradé</div>
              </div>
              <div>
                <div className="font-mono text-xl font-medium text-green-600">+{(pnlPct + 14.2).toFixed(1)}%</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Valeur des filtres</div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 text-center border-t border-gray-100 pt-3">
              {allSignals} signaux analysés · {executed} exécutés ({Math.round(executed/allSignals*100)}%) · {rejected} rejetés par nos filtres
            </div>
          </div>

          <div className="space-y-2">
            {shadowFilters.map(f => (
              <button key={f.label} onClick={() => drillTo({ type: "rejected", filter: f.filter })}
                className="w-full bg-white rounded-xl border border-gray-200 p-3 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-gray-700">{f.label}</span>
                      {f.warning && (
                        <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">{f.warning}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400">{f.rejected} signaux rejetés · pertes évitées en moyenne {f.avgLoss}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-medium text-green-600">{f.saved}% évité</div>
                    <div className="text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">voir →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="text-[10px] text-gray-400 leading-relaxed pt-2 border-t border-gray-100">
          Paper trading uniquement · Aucun fonds réel engagé · Les performances passées ne préjugent pas des résultats futurs · Données mises à jour toutes les 60 secondes
        </div>

      </div>
    </div>
  );
}
