"use client";
import { useState, useEffect } from "react";
import StrategyConfigModal from "../components/StrategyConfigModal";
import { useApi } from "../hooks/useApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  regime_optimal: string[];
  risk_level: string;
  enabled: boolean;
  weight: number;
  compliance?: string[];
  stats: { trades: number; wins: number; win_rate: number; pnl: number; };
}

interface Strategies { strategies: Strategy[]; }

interface Recommendation {
  strategy_id: string;
  action?: "activate" | "deactivate";
  reason?: string;
  urgency?: string;
  weight?: number;
  rationale?: string;
  status?: string;
}

interface Adaptive {
  regime: string;
  recommendations: Recommendation[];
  performance: Record<string, Record<string, { trades: number; win_rate: number; consecutive_losses: number; status: string }>>;
}

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

const CATEGORY_LABELS: Record<string, string> = {
  momentum: "Momentum", reversion: "Retour à la moyenne",
  trend: "Tendance", volume: "Volume", macro: "Macro",
};

const REGIME_COLORS: Record<string, string> = {
  bull: "text-green-600", bear: "text-red-600",
  chop: "text-yellow-600", panic: "text-red-600", unknown: "text-gray-400",
};

export default function Strategies() {
  const { data, loading, refetch } = useApi<Strategies>("/api/strategies", 10000);
  const { data: adaptiveData, refetch: refetchAdaptive } = useApi<Adaptive>("/api/adaptive/recommendations", 10000);
  const [autoMode, setAutoMode] = useState(false);

  // Charge l'état AUTO depuis le serveur au démarrage
  useEffect(() => {
    fetch(`${API_URL}/api/adaptive/mode`)
      .then(r => r.json())
      .then(d => setAutoMode(d.auto_mode || false))
      .catch(() => {});
  }, []);

  // Sauvegarde l'état AUTO sur le serveur
  async function setAutoModeServer(value: boolean) {
    setAutoMode(value);
    try {
      await fetch(`${API_URL}/api/adaptive/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_mode: value }),
      });
    } catch {}
  }
  const [toggling, setToggling] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [configModal, setConfigModal] = useState<string | null>(null);
  const [autoExpanded, setAutoExpanded] = useState(false);

  const strategies = data?.strategies || [];
  const active = strategies.filter(s => s.enabled);
  const inactive = strategies.filter(s => !s.enabled);
  const categories = [...new Set(strategies.map(s => s.category))];
  const recommendations = adaptiveData?.recommendations || [];
  const regime = adaptiveData?.regime || "unknown";

  // Applique automatiquement si autoMode activé
  useEffect(() => {
    if (!autoMode) return;
    const interval = setInterval(async () => {
      try {
        await fetch(`${API_URL}/api/adaptive/apply`, { method: "POST" });
        await refetch();
        await refetchAdaptive();
      } catch {}
    }, 60000); // Toutes les 60s
    // Applique immédiatement à l'activation
    applyAdaptive();
    return () => clearInterval(interval);
  }, [autoMode]);

  async function applyAdaptive() {
    setApplying(true);
    try {
      await fetch(`${API_URL}/api/adaptive/apply`, { method: "POST" });
      await refetch();
      await refetchAdaptive();
    } finally {
      setApplying(false);
    }
  }

  async function toggleStrategy(id: string, currentEnabled: boolean) {
    if (autoMode) return;
    setToggling(id);
    try {
      await fetch(`${API_URL}/api/strategies/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      await refetch();
    } finally {
      setToggling(null);
    }
  }

  function getRecommendation(strategyId: string): Recommendation | null {
    return recommendations.find(r => r.strategy_id === strategyId) || null;
  }

  function StrategyCard({ strategy }: { strategy: Strategy }) {
    const riskStyle = RISK_STYLES[strategy.risk_level] || RISK_STYLES.medium;
    const rec = getRecommendation(strategy.id);
    const isToggling = toggling === strategy.id;
    const perf = adaptiveData?.performance?.[strategy.id]?.[regime];

    return (
      <div className={`bg-white rounded-xl border overflow-hidden transition-all ${
        !strategy.enabled ? "border-gray-100 opacity-60" : "border-gray-200"
      }`}>
        <div className="p-4">
          <div className="flex gap-3 items-start">

            {/* Toggle */}
            <div className="flex-shrink-0 mt-0.5">
              <button
                onClick={() => toggleStrategy(strategy.id, strategy.enabled)}
                disabled={isToggling || autoMode}
                title={autoMode ? "Désactivez le mode AUTO pour modifier manuellement" : ""}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  strategy.enabled ? "bg-[#111]" : "bg-gray-200"
                } ${autoMode ? "cursor-not-allowed" : "cursor-pointer"} ${isToggling ? "opacity-50" : ""}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${strategy.enabled ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-bold text-gray-900">{strategy.name}</div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${riskStyle.bg} ${riskStyle.text}`}>
                  {riskStyle.label}
                </span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{strategy.description}</p>

              <div className="flex gap-1.5 flex-wrap mb-2">
                {strategy.regime_optimal.map(r => {
                  const rs = REGIME_STYLES[r] || REGIME_STYLES.all;
                  return (
                    <span key={r} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rs.bg} ${rs.text}`}>
                      {r.toUpperCase()}
                    </span>
                  );
                })}
              </div>



              {/* Performance adaptive */}
              {perf && perf.trades > 0 && (
                <div className="text-[9px] text-gray-400 mb-2">
                  Mémoire {regime.toUpperCase()} : {perf.trades} trades · {perf.win_rate}% win rate
                  {perf.status === "suspended" && <span className="text-red-500 ml-1">· Suspendu</span>}
                </div>
              )}

              {/* Badges conformité */}
              {strategy.compliance && strategy.compliance.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {strategy.compliance.map((b: string) => (
                    <span key={b} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      {b === "shariah" ? "☪️ Shariah" : b === "esg" ? "🌱 ESG" : b === "mifid2" ? "🇪🇺 MiFID II" : b}
                    </span>
                  ))}
                </div>
              )}

              {/* Bouton config */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setConfigModal(strategy.id); }}
                  title="Configurer la stratégie"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-200 hover:border-gray-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
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
      </div>
    );
  }

  return (
    <>
      {configModal && (() => {
        const strat = strategies.find(s => s.id === configModal);
        if (!strat) return null;
        return (
          <StrategyConfigModal
            strategyId={strat.id}
            strategyName={strat.name}
            currentParams={strat as unknown as Record<string, number>}
            currentCompliance={[]}
            autoMode={autoMode}
            onClose={() => setConfigModal(null)}
            onSave={() => { refetch(); setConfigModal(null); }}
          />
        );
      })()}
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Stratégies</div>
        <div className="text-[10px] text-gray-400">{active.length}/{strategies.length} actives</div>
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* TOGGLE AUTO MODE */}
        <div className={`rounded-xl border bg-white overflow-hidden transition-all ${
          autoMode
            ? regime === "bull" ? "border-l-4 border-green-500 border-t border-r border-b border-gray-200"
            : regime === "bear" ? "border-l-4 border-red-500 border-t border-r border-b border-gray-200"
            : regime === "chop" ? "border-l-4 border-yellow-500 border-t border-r border-b border-gray-200"
            : "border-l-4 border-gray-400 border-t border-r border-b border-gray-200"
            : "border-gray-200"
        }`}>

          {/* Header — toujours visible */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                AI
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  Mode AUTO {autoMode ? `— ${regime.toUpperCase()}` : "— Désactivé"}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {autoMode
                    ? `SYNAPSE optimise ${strategies.length} stratégies automatiquement`
                    : "Contrôle manuel des stratégies et paramètres"
                  }
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {autoMode && (
                <button
                  onClick={() => setAutoExpanded(!autoExpanded)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  {autoExpanded ? "Masquer" : "Voir le détail"}
                  <span className={`transition-transform ${autoExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>
              )}
              <button
                onClick={() => setAutoModeServer(!autoMode)}
                disabled={applying}
                className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${autoMode ? "bg-[#111]" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${autoMode ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* Détail dépliable */}
          {autoMode && autoExpanded && (
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Paramètres appliqués — régime {regime.toUpperCase()}
              </div>
              <div className="space-y-2">
                {recommendations.map((rec, i) => {
                  const strat = strategies.find(s => s.id === rec.strategy_id);
                  const name = strat?.name || rec.strategy_id;
                  const weight = rec.weight ?? 1.0;
                  return (
                    <div key={i} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                          weight >= 1.2 ? "bg-green-500"
                          : weight >= 0.8 ? "bg-yellow-400"
                          : weight >= 0.3 ? "bg-orange-400"
                          : "bg-gray-300"
                        }`} />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-gray-900">{name}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{rec.rationale}</div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <div className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          weight >= 1.2 ? "bg-green-50 text-green-700"
                          : weight >= 0.8 ? "bg-yellow-50 text-yellow-700"
                          : weight >= 0.3 ? "bg-orange-50 text-orange-700"
                          : "bg-gray-100 text-gray-400"
                        }`}>
                          ×{weight}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : (
          <>
            {/* Actives */}
            {[...new Set(active.map(s => s.category))].map(cat => (
              <div key={cat}>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {CATEGORY_LABELS[cat] || cat}
                </div>
                <div className="space-y-2">
                  {active.filter(s => s.category === cat).map(s => (
                    <StrategyCard key={s.id} strategy={s} />
                  ))}
                </div>
              </div>
            ))}

            {/* Désactivées */}
            {inactive.length > 0 && (
              <div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Désactivées · {inactive.length}
                </div>
                <div className="space-y-2">
                  {inactive.map(s => (
                    <StrategyCard key={s.id} strategy={s} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
  </>
  );
}
