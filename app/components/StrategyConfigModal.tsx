"use client";
import { useState, useEffect } from "react";
import ConsentModal from "./ConsentModal";

const API_URL = "";

interface StrategyParam {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  impact?: string;
}

interface StrategyConfig {
  id: string;
  name: string;
  params: StrategyParam[];
  compliance: string[];
}

const STRATEGY_CONFIGS: Record<string, StrategyConfig> = {
  rsi: {
    id: "rsi",
    name: "RSI",
    compliance: [],
    params: [
      { key: "period", label: "Période", description: "Nombre de bougies analysées. Court (7) = réactif mais bruyant. Long (21) = fiable mais lent.", min: 7, max: 21, step: 1, unit: "bougies", impact: "Réactivité du signal" },
      { key: "oversold", label: "Seuil d'achat", description: "En dessous de ce seuil, l'asset est en survente et le système achète. Plus bas = signaux plus rares mais plus fiables.", min: 20, max: 40, step: 1, unit: "", impact: "Fréquence des achats" },
      { key: "overbought", label: "Seuil de vente", description: "Au-dessus de ce seuil, l'asset est en surachat et le système vend. Plus haut = laisse courir les gains plus longtemps.", min: 60, max: 80, step: 1, unit: "", impact: "Fréquence des ventes" },
    ],
  },
  momentum: {
    id: "momentum",
    name: "Momentum",
    compliance: [],
    params: [
      { key: "period", label: "Fenêtre d'observation", description: "Nombre de bougies pour mesurer la force de la tendance. Court = capte les accélérations rapides. Long = suit les grandes tendances.", min: 5, max: 30, step: 1, unit: "bougies", impact: "Sensibilité aux tendances" },
      { key: "threshold", label: "Force minimale requise", description: "Variation minimale du prix pour déclencher un signal. Plus élevé = moins de trades mais plus sélectifs.", min: 0.005, max: 0.05, step: 0.005, unit: "%", impact: "Nombre de signaux" },
    ],
  },
  ema_crossover: {
    id: "ema_crossover",
    name: "EMA Crossover",
    compliance: [],
    params: [
      { key: "fast", label: "EMA rapide", description: "Moyenne mobile courte — réagit vite aux changements de prix. Plus court = plus réactif.", min: 5, max: 15, step: 1, unit: "périodes", impact: "Réactivité au signal" },
      { key: "slow", label: "EMA lente", description: "Moyenne mobile longue — représente la tendance de fond. Plus long = filtre mieux le bruit.", min: 15, max: 50, step: 1, unit: "périodes", impact: "Filtrage de tendance" },
    ],
  },
  macd: {
    id: "macd",
    name: "MACD",
    compliance: [],
    params: [
      { key: "fast", label: "Signal rapide", description: "EMA courte du MACD. Valeur standard : 12.", min: 8, max: 15, step: 1, unit: "périodes", impact: "Détection rapide" },
      { key: "slow", label: "Signal lent", description: "EMA longue du MACD. Valeur standard : 26.", min: 20, max: 35, step: 1, unit: "périodes", impact: "Filtrage tendance" },
      { key: "signal", label: "Ligne de signal", description: "Lissage final. Valeur standard : 9. Plus court = croisements plus fréquents.", min: 5, max: 15, step: 1, unit: "périodes", impact: "Fréquence des signaux" },
    ],
  },
  mean_reversion: {
    id: "mean_reversion",
    name: "Mean Reversion",
    compliance: [],
    params: [
      { key: "period", label: "Période des bandes", description: "Fenêtre de calcul de la moyenne. Plus long = bandes plus stables et moins de signaux.", min: 10, max: 30, step: 1, unit: "bougies", impact: "Stabilité des bandes" },
      { key: "std_dev", label: "Largeur des bandes", description: "Écart-type multiplié par cette valeur. 2.0 = standard. 1.5 = plus de signaux. 2.5 = plus sélectif.", min: 1.0, max: 3.0, step: 0.1, unit: "σ", impact: "Sélectivité des signaux" },
    ],
  },
  supertrend: {
    id: "supertrend",
    name: "Supertrend",
    compliance: [],
    params: [
      { key: "period", label: "Période ATR", description: "Fenêtre de calcul de la volatilité. Plus court = s'adapte plus vite aux changements.", min: 7, max: 20, step: 1, unit: "bougies", impact: "Adaptation à la volatilité" },
      { key: "multiplier", label: "Sensibilité du stop", description: "Distance du stop par rapport au prix. Plus élevé = stop plus loin = moins de whipsaws mais pertes potentielles plus grandes.", min: 1.5, max: 5.0, step: 0.5, unit: "×ATR", impact: "Distance du stop" },
    ],
  },
  vwap: {
    id: "vwap",
    name: "VWAP",
    compliance: [],
    params: [
      { key: "deviation_threshold", label: "Distance au VWAP", description: "Écart minimum du prix par rapport au VWAP pour déclencher un signal. Plus élevé = signaux sur vraies anomalies.", min: 0.5, max: 3.0, step: 0.5, unit: "%", impact: "Sélectivité des entrées" },
    ],
  },
  dca: {
    id: "dca",
    name: "DCA Intelligent",
    compliance: [],
    params: [
      { key: "drop_threshold", label: "Chute minimale pour acheter", description: "Le prix doit avoir chuté d'au moins X% sous sa moyenne pour déclencher un achat. Plus élevé = accumule seulement sur vrais creux.", min: 1.0, max: 6.0, step: 0.5, unit: "%", impact: "Fréquence d'accumulation" },
      { key: "ma_period", label: "Période de référence", description: "Fenêtre pour calculer le prix moyen de référence. Plus long = référence plus stable.", min: 10, max: 30, step: 1, unit: "bougies", impact: "Stabilité de la référence" },
    ],
  },
  adx_filter: {
    id: "adx_filter",
    name: "ADX Filter",
    compliance: [],
    params: [
      { key: "period", label: "Période ADX", description: "Fenêtre de calcul de la force de tendance. Standard : 14. Plus court = plus réactif aux changements de tendance.", min: 7, max: 21, step: 1, unit: "bougies", impact: "Sensibilité à la tendance" },
      { key: "threshold", label: "Seuil de tendance", description: "Valeur ADX minimale pour considérer qu'une tendance existe. En dessous = marché en CHOP. Au dessus = tendance confirmée.", min: 15, max: 40, step: 5, unit: "", impact: "Filtrage des faux signaux" },
    ],
  },
  obv: {
    id: "obv",
    name: "OBV",
    compliance: [],
    params: [
      { key: "period", label: "Période de lissage", description: "Fenêtre de moyenne mobile appliquée à l'OBV. Plus long = signal plus stable mais moins réactif.", min: 5, max: 30, step: 1, unit: "bougies", impact: "Stabilité du signal volume" },
      { key: "threshold", label: "Divergence minimale", description: "Écart minimum entre l'OBV et sa moyenne pour déclencher un signal. Plus élevé = signaux plus rares mais plus fiables.", min: 0.01, max: 0.1, step: 0.01, unit: "%", impact: "Sélectivité des signaux" },
    ],
  },
  volume_breakout: {
    id: "volume_breakout",
    name: "Volume Breakout",
    compliance: [],
    params: [
      { key: "period", label: "Fenêtre de volume moyen", description: "Nombre de bougies pour calculer le volume moyen de référence. Plus long = référence plus stable.", min: 10, max: 30, step: 1, unit: "bougies", impact: "Référence de volume" },
      { key: "multiplier", label: "Multiplicateur de volume", description: "Le volume actuel doit être X fois supérieur à la moyenne pour déclencher un signal. Plus élevé = cassures plus significatives.", min: 1.5, max: 4.0, step: 0.5, unit: "×", impact: "Force de la cassure requise" },
    ],
  },
  ichimoku: {
    id: "ichimoku",
    name: "Ichimoku Cloud",
    compliance: [],
    params: [
      { key: "tenkan_period", label: "Tenkan (Signal rapide)", description: "Période de la ligne Tenkan-sen. Représente l'équilibre sur la période courte. Standard japonais : 9.", min: 5, max: 15, step: 1, unit: "bougies", impact: "Réactivité du signal" },
      { key: "kijun_period", label: "Kijun (Signal lent)", description: "Période de la ligne Kijun-sen. Représente l'équilibre sur la période moyenne. Standard japonais : 26.", min: 15, max: 35, step: 1, unit: "bougies", impact: "Tendance de fond" },
      { key: "senkou_b_period", label: "Senkou B (Cloud lent)", description: "Période du Senkou Span B. Forme le cloud avec Senkou A. Standard japonais : 52.", min: 40, max: 60, step: 2, unit: "bougies", impact: "Épaisseur du cloud" },
      { key: "displacement", label: "Déplacement", description: "Nombre de bougies de projection du cloud vers le futur. Standard japonais : 26.", min: 20, max: 30, step: 1, unit: "bougies", impact: "Anticipation du support/résistance" },
    ],
  },
  bollinger_squeeze: {
    id: "bollinger_squeeze",
    name: "Bollinger Squeeze",
    compliance: [],
    params: [
      { key: "bb_period", label: "Période Bollinger", description: "Fenêtre de calcul des bandes de Bollinger. Plus long = bandes plus stables.", min: 10, max: 30, step: 1, unit: "bougies", impact: "Stabilité des bandes" },
      { key: "bb_std", label: "Écart-type Bollinger", description: "Largeur des bandes de Bollinger. 2.0 = standard. Plus élevé = moins de signaux mais plus fiables.", min: 1.5, max: 3.0, step: 0.5, unit: "σ", impact: "Sélectivité des signaux" },
      { key: "kc_mult", label: "Multiplicateur Keltner", description: "Largeur des Keltner Channels. Le squeeze est détecté quand BB est à l'intérieur de KC.", min: 1.0, max: 2.5, step: 0.5, unit: "×ATR", impact: "Sensibilité du squeeze" },
      { key: "momentum_period", label: "Période momentum", description: "Fenêtre pour mesurer le momentum au moment du breakout. Détermine la direction de l'explosion.", min: 8, max: 20, step: 2, unit: "bougies", impact: "Direction du breakout" },
    ],
  },
  market_structure: {
    id: "market_structure",
    name: "Market Structure",
    compliance: [],
    params: [
      { key: "swing_period", label: "Période des swings", description: "Nombre de bougies de chaque côté pour identifier un swing high/low. Plus élevé = swings plus significatifs.", min: 3, max: 10, step: 1, unit: "bougies", impact: "Qualité des niveaux structurels" },
      { key: "ob_lookback", label: "Lookback Order Blocks", description: "Nombre de bougies dans lesquelles chercher les Order Blocks institutionnels.", min: 5, max: 20, step: 5, unit: "bougies", impact: "Profondeur de l'analyse institutionnelle" },
      { key: "min_break_pct", label: "Cassure minimale", description: "Pourcentage minimum de cassure au-dessus d'un swing high pour valider un Break of Structure.", min: 0.1, max: 1.0, step: 0.1, unit: "%", impact: "Filtrage des faux breakouts" },
    ],
  },
  stochastic_rsi: {
    id: "stochastic_rsi",
    name: "Stochastic RSI",
    compliance: [],
    params: [
      { key: "period", label: "Période RSI", description: "Période du RSI avant application du Stochastique.", min: 7, max: 21, step: 1, unit: "bougies", impact: "Sensibilité RSI" },
      { key: "oversold", label: "Seuil d'achat", description: "Seuil de survente Stochastique. Standard : 20.", min: 10, max: 30, step: 5, unit: "", impact: "Fréquence d'achat" },
      { key: "overbought", label: "Seuil de vente", description: "Seuil de surachat Stochastique. Standard : 80.", min: 70, max: 90, step: 5, unit: "", impact: "Fréquence de vente" },
    ],
  },
};

const COMPLIANCE_OPTIONS = [
  { id: "shariah", label: "Shariah", icon: "☪️", color: "bg-green-50 text-green-700 border-green-200" },
  { id: "esg", label: "ESG", icon: "🌱", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "mifid2", label: "MiFID II", icon: "🇪🇺", color: "bg-purple-50 text-purple-700 border-purple-200" },
];

interface Props {
  strategyId: string;
  strategyName: string;
  currentParams: Record<string, number>;
  currentCompliance: string[];
  autoMode: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function StrategyConfigModal({
  strategyId, strategyName, currentParams, currentCompliance, autoMode, onClose, onSave
}: Props) {
  const config = STRATEGY_CONFIGS[strategyId];
  const [params, setParams] = useState<Record<string, number>>({ ...currentParams });
  const [compliance, setCompliance] = useState<string[]>(currentCompliance || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any>(null);

  async function runBacktest() {
    setBacktestLoading(true);
    setShowBacktest(true);
    try {
      const res = await fetch(`${API_URL}/api/backtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: strategyId,
          universe: "top20",
          period_days: 30,
        }),
      });
      const data = await res.json();
      setBacktestResult(data);
    } catch {
      setBacktestResult({ error: "Erreur lors du backtest" });
    } finally {
      setBacktestLoading(false);
    }
  }
  const [activeParam, setActiveParam] = useState<string | null>(
    config?.params[0]?.key || null
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!config) return null;

  async function save() {
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/strategies/${strategyId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: true, ...params, compliance }),
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); onSave(); onClose(); }, 1200);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    // Affiche le consentement avant de sauvegarder
    setShowConsent(true);
  }

  function toggleCompliance(id: string) {
    setCompliance(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  const activeParamConfig = config.params.find(p => p.key === activeParam);
  const activeValue = activeParam ? (params[activeParam] ?? 0) : 0;

  return (
    <>
      {showConsent && (
        <ConsentModal
          strategyId={strategyId}
          strategyName={strategyName}
          onAccept={() => { setShowConsent(false); save(); }}
          onBacktest={() => {
              setShowConsent(false);
              runBacktest();
            }}
          onClose={() => setShowConsent(false)}
        />
      )}
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{ width: "min(90vw, 720px)", maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-sm font-bold text-gray-900">{strategyName}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {autoMode ? "Mode AUTO — lecture seule" : "Mode MANUEL — paramètres modifiables"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {autoMode && (
              <div className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg">
                AUTO actif
              </div>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* PARAMÈTRES */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Paramètres</div>

            <div className="grid grid-cols-2 gap-4">
              {/* Liste des paramètres */}
              <div className="space-y-2">
                {config.params.map(param => {
                  const value = params[param.key] ?? param.min;
                  const pct = ((value - param.min) / (param.max - param.min)) * 100;
                  const isActive = activeParam === param.key;

                  return (
                    <div
                      key={param.key}
                      onClick={() => setActiveParam(param.key)}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${isActive ? "border-[#111] bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[11px] font-bold text-gray-900">{param.label}</div>
                        <div className="font-mono text-[11px] font-bold text-gray-900">
                          {typeof value === "number" && param.step < 1
                            ? value.toFixed(2)
                            : value}
                          {param.unit && <span className="text-gray-400 ml-1 text-[9px]">{param.unit}</span>}
                        </div>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={value}
                        disabled={autoMode}
                        onChange={e => {
                          const v = parseFloat(e.target.value);
                          setParams(prev => ({ ...prev, [param.key]: v }));
                        }}
                        className={`w-full h-1.5 rounded-full appearance-none ${autoMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        style={{
                          background: autoMode
                            ? `linear-gradient(to right, #9ca3af ${pct}%, #e5e7eb ${pct}%)`
                            : `linear-gradient(to right, #111 ${pct}%, #e5e5e5 ${pct}%)`,
                        }}
                      />
                      <div className="flex justify-between text-[8px] text-gray-300 mt-1">
                        <span>{param.min}{param.unit}</span>
                        <span>{param.max}{param.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explication du paramètre actif */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col">
                {activeParamConfig ? (
                  <>
                    <div className="text-[11px] font-bold text-gray-900 mb-2">{activeParamConfig.label}</div>
                    <p className="text-[11px] text-gray-600 leading-relaxed flex-1">{activeParamConfig.description}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Impact principal</div>
                      <div className="text-[11px] font-bold text-gray-900">{activeParamConfig.impact}</div>
                    </div>
                    {autoMode && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <div className="text-[10px] text-blue-700">
                          <span className="font-bold">Valeur AUTO :</span> optimisée pour le régime actuel par l'Adaptive Engine.
                          Désactivez le mode AUTO pour modifier manuellement.
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-gray-400 italic">
                    Cliquez sur un paramètre pour voir son explication
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BACKTEST INLINE */}
          {showBacktest && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Performances simulées — 30 jours · Top 20</div>
                <button onClick={() => setShowBacktest(false)} className="text-[10px] text-gray-400 hover:text-gray-600">Masquer</button>
              </div>

              {backtestLoading ? (
                <div className="text-center py-6 text-gray-400 text-sm">Simulation en cours...</div>
              ) : backtestResult?.error ? (
                <div className="text-[11px] text-red-500">{backtestResult.error}</div>
              ) : backtestResult ? (
                <div className="space-y-3">
                  {/* Stats globales */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Trades", value: backtestResult.total_trades?.toString() || "0", color: "text-gray-900" },
                      { label: "Win Rate", value: `${backtestResult.win_rate?.toFixed(0) || 0}%`, color: backtestResult.win_rate >= 50 ? "text-green-600" : "text-red-600" },
                      { label: "P&L", value: `${backtestResult.total_pnl >= 0 ? "+" : ""}${backtestResult.total_pnl?.toFixed(1) || 0}`, color: backtestResult.total_pnl >= 0 ? "text-green-600" : "text-red-600" },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <div className="text-[9px] text-gray-400 uppercase mb-1">{s.label}</div>
                        <div className={`font-mono text-sm font-bold ${s.color}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Par régime */}
                  {backtestResult.by_regime && (
                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 text-left">Régime</th>
                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 text-right">Trades</th>
                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 text-right">P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(backtestResult.by_regime).map(([regime, data]: [string, any]) => (
                            <tr key={regime} className="border-t border-gray-100">
                              <td className="px-3 py-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  regime === "bull" ? "bg-green-50 text-green-700"
                                  : regime === "bear" ? "bg-red-50 text-red-700"
                                  : "bg-yellow-50 text-yellow-700"
                                }`}>{regime.toUpperCase()}</span>
                              </td>
                              <td className="px-3 py-2 text-[11px] text-gray-500 text-right">{data.trades}</td>
                              <td className={`px-3 py-2 font-mono text-[11px] font-bold text-right ${data.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {data.pnl >= 0 ? "+" : ""}{data.pnl?.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Verdict Coach */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold">AI</div>
                      <div className="text-[10px] font-bold text-gray-900">Verdict Coach</div>
                    </div>
                    <div className="text-[11px] text-blue-800 leading-relaxed">
                      {backtestResult.win_rate >= 50
                        ? `${strategyName} est profitable sur cette période (${backtestResult.win_rate?.toFixed(0)}% de succès). Bonne stratégie pour le régime actuel.`
                        : backtestResult.win_rate >= 35
                        ? `${strategyName} est moyennement performante (${backtestResult.win_rate?.toFixed(0)}% de succès). Utilisez le mode AUTO pour optimiser les paramètres.`
                        : `${strategyName} performe mal sur cette période (${backtestResult.win_rate?.toFixed(0)}% de succès). Le mode AUTO ajustera automatiquement les paramètres selon le régime.`
                      }
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* CONFORMITÉ */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cadre réglementaire</div>
            <div className="flex gap-2 flex-wrap">
              {COMPLIANCE_OPTIONS.map(opt => {
                const isActive = compliance.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => !autoMode && toggleCompliance(opt.id)}
                    disabled={autoMode}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-bold transition-all ${
                      isActive ? opt.color : "bg-gray-50 text-gray-400 border-gray-200"
                    } ${autoMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                    {isActive && <span className="text-[9px]">✓</span>}
                  </button>
                );
              })}
            </div>
            {compliance.length > 0 && (
              <div className="mt-2 text-[10px] text-gray-500">
                Cette stratégie appliquera les règles : {compliance.map(c =>
                  COMPLIANCE_OPTIONS.find(o => o.id === c)?.label
                ).join(", ")}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center flex-shrink-0 bg-white">
          <button onClick={onClose} className="text-[11px] text-gray-400 hover:text-gray-600">
            Annuler
          </button>
          {!autoMode ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`text-[11px] font-bold px-5 py-2.5 rounded-xl transition-colors ${
                saved ? "bg-green-500 text-white" : "bg-[#111] text-white"
              } disabled:opacity-50`}
            >
              {saved ? "Sauvegardé !" : saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          ) : (
            <div className="text-[10px] text-gray-400 italic">
              Désactivez le mode AUTO pour modifier
            </div>
          )}
        </div>
      </div>
    </div>
  );
  </>
  );
}
