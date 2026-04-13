"use client";
import { useApi } from "../hooks/useApi";

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  regime_optimal: string[];
  risk_level: string;
  enabled: boolean;
  weight: number;
  stats: {
    trades: number;
    wins: number;
    win_rate: number;
    pnl: number;
  };
}

interface Strategies {
  strategies: Strategy[];
}

const CATEGORY_LABELS: Record<string, string> = {
  momentum: "Momentum",
  reversion: "Retour à la moyenne",
  trend: "Tendance",
  volume: "Volume",
  macro: "Macro",
};

const RISK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-green-50", text: "text-green-700", label: "Risque faible" },
  medium: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Risque modéré" },
  high: { bg: "bg-red-50", text: "text-red-700", label: "Risque élevé" },
};

const REGIME_STYLES: Record<string, { bg: string; text: string }> = {
  bull: { bg: "bg-green-50", text: "text-green-700" },
  bear: { bg: "bg-red-50", text: "text-red-700" },
  chop: { bg: "bg-yellow-50", text: "text-yellow-700" },
  all: { bg: "bg-gray-100", text: "text-gray-600" },
};

export default function Strategies() {
  const { data, loading } = useApi<Strategies>("/api/strategies", 30000);
  const strategies = data?.strategies || [];
  const active = strategies.filter(s => s.enabled);
  const inactive = strategies.filter(s => !s.enabled);
  const categories = [...new Set(active.map(s => s.category))];

  const hasReversion = active.filter(s => s.category === "reversion").length >= 3;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Stratégies</div>
        <button className="flex items-center gap-1.5 bg-[#111] text-white text-[10px] font-bold px-3 py-2 rounded-lg">
          + Ajouter une stratégie
        </button>
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* Score cohérence Coach */}
        {hasReversion && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex gap-3 items-start">
            <div className="w-5 h-5 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0 mt-0.5">AI</div>
            <div className="text-[11px] text-yellow-800 leading-relaxed">
              <span className="font-bold">Suggestion d'équilibre</span> — Tu as plusieurs stratégies de retour à la moyenne actives.
              En régime BULL elles généreront peu de signaux. Ajoute <span className="font-bold">Momentum</span> ou <span className="font-bold">EMA Crossover</span> pour équilibrer.
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : (
          <>
            {/* Actives */}
            {categories.map(cat => (
              <div key={cat}>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {CATEGORY_LABELS[cat] || cat}
                </div>
                <div className="space-y-2">
                  {active.filter(s => s.category === cat).map(strategy => {
                    const riskStyle = RISK_STYLES[strategy.risk_level] || RISK_STYLES.medium;
                    return (
                      <div key={strategy.id} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex gap-3 items-start">

                          {/* Toggle */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-4 bg-[#111] rounded-full relative cursor-pointer">
                              <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Nom + risque */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm font-bold text-gray-900">{strategy.name}</div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-current border-opacity-20 ${riskStyle.bg} ${riskStyle.text}`}>
                                {riskStyle.label}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{strategy.description}</p>

                            {/* Régimes */}
                            <div className="flex gap-1.5 flex-wrap mb-3">
                              {strategy.regime_optimal.map(r => {
                                const rs = REGIME_STYLES[r] || REGIME_STYLES.all;
                                return (
                                  <span key={r} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rs.bg} ${rs.text}`}>
                                    {r.toUpperCase()}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Stats */}
                            {strategy.stats.trades > 0 ? (
                              <div className="grid grid-cols-4 gap-1.5">
                                {[
                                  { label: "Trades", value: strategy.stats.trades.toString(), color: "text-gray-900" },
                                  { label: "Win Rate", value: `${strategy.stats.win_rate.toFixed(0)}%`, color: strategy.stats.win_rate >= 50 ? "text-green-600" : "text-yellow-600" },
                                  { label: "P&L", value: `${strategy.stats.pnl >= 0 ? "+" : ""}${strategy.stats.pnl.toFixed(1)}`, color: strategy.stats.pnl >= 0 ? "text-green-600" : "text-red-600" },
                                  { label: "Poids", value: `×${strategy.weight}`, color: "text-gray-900" },
                                ].map(s => (
                                  <div key={s.label} className="bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-100">
                                    <div className="text-[8px] text-gray-400 uppercase mb-0.5">{s.label}</div>
                                    <div className={`font-mono text-[11px] font-bold ${s.color}`}>{s.value}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-400 italic">En attente d'opportunité</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Désactivées */}
            {inactive.length > 0 && (
              <div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Désactivées · {inactive.length} stratégies
                </div>
                <div className="space-y-2">
                  {inactive.map(strategy => (
                    <div key={strategy.id} className="bg-white rounded-xl border border-gray-200 p-4 opacity-50">
                      <div className="flex gap-3 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900">{strategy.name}</div>
                          <div className="text-[11px] text-gray-400">{strategy.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
