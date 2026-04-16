"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

interface Asset {
  symbol: string;
  name: string;
  logo_url: string;
  price: number;
  change_24h: number;
  change_7d: number;
  rank: number;
  market_cap: number;
  shariah: boolean;
  active_universes: string[];
  funding_sentiment: string;
  funding_rate: number;
  liquidity_score: number;
  trades_count: number;
  win_rate: number;
  total_pnl: number;
  ath_change_pct: number;
  regime: string;
  position: any;
  trades: any[];
}

interface Universe {
  name: string;
  description: string;
  assets: string[];
  scores: Record<string, number>;
  count: number;
}

interface UniversesData {
  universes: Record<string, Universe>;
}

const UNIVERSE_META: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  momentum:    { label: "Momentum",    color: "text-green-400 border-green-400",   icon: "↑", desc: "Assets en forte dynamique haussière" },
  breakout:    { label: "Breakout",    color: "text-blue-400 border-blue-400",     icon: "⚡", desc: "Compression avant explosion imminente" },
  shariah:     { label: "Shariah",     color: "text-purple-400 border-purple-400", icon: "☽", desc: "Assets conformes Shariah" },
  blue_chip:   { label: "Blue Chip",   color: "text-yellow-400 border-yellow-400", icon: "★", desc: "Top assets par market cap" },
  pepites_dex: { label: "Pépites DEX", color: "text-orange-400 border-orange-400", icon: "💎", desc: "Protocoles DEX à fort potentiel TVL" },
};

function AssetCard({ symbol, score, onSelect }: { symbol: string; score: number; onSelect: (s: string) => void }) {
  const { data } = useApi<Asset>(`/api/asset/${symbol}`, 60000);
  if (!data) return (
    <div className="bg-[#1a1a1a] rounded-xl p-3 animate-pulse h-20" />
  );
  const up = (data.change_24h || 0) >= 0;
  return (
    <button onClick={() => onSelect(symbol)}
      className="w-full bg-[#1a1a1a] border border-[#222] hover:border-[#444] rounded-xl p-3 text-left transition-all active:scale-95">
      <div className="flex items-center gap-2 mb-2">
        {data.logo_url ? (
          <img src={data.logo_url} alt="" className="w-6 h-6 rounded-full flex-shrink-0"
            onError={e => { e.currentTarget.style.display="none"; }} />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#333] flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-white">{symbol.replace("USDT","")}</div>
          <div className="text-[9px] text-gray-500 truncate">{data.name}</div>
        </div>
        <div className={`text-[10px] font-mono font-medium ${up ? "text-green-400" : "text-red-400"}`}>
          {up?"+":""}{(data.change_24h||0).toFixed(1)}%
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono text-gray-400">
          ${(data.price||0) > 1000 ? Math.round(data.price||0).toLocaleString() : (data.price||0).toFixed(4)}
        </div>
        <div className="flex items-center gap-1">
          {data.shariah && <span className="text-[8px] text-purple-400">☽</span>}
          <span className="text-[9px] text-gray-600">{score}/100</span>
        </div>
      </div>
    </button>
  );
}

function AssetSheet({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const { data, loading } = useApi<Asset>(`/api/asset/${symbol}`, 30000);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  async function generateAI() {
    if (!data) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analyse ${data.name} (${symbol}) : Prix $${data.price?.toFixed(2)}, Change 24h: ${data.change_24h?.toFixed(2)}%, 7j: ${data.change_7d?.toFixed(2)}%, Rang #${data.rank}, ATH distance: ${data.ath_change_pct?.toFixed(0)}%, Funding: ${data.funding_sentiment}, Univers actifs: ${data.active_universes?.join(", ")}, Régime SYNAPSE: ${data.regime}. Analyse en 4 phrases max sur le potentiel et les risques actuels.`
          }]
        })
      });
      const d = await res.json();
      setAiAnalysis(d.message || "Analyse non disponible");
    } catch { setAiAnalysis("Erreur lors de l'analyse"); }
    finally { setAiLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-[#111] border-t border-[#222] rounded-t-2xl max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-[#111] px-6 pt-5 pb-4 border-b border-[#1a1a1a] flex items-center gap-3">
          {data?.logo_url && (
            <img src={data.logo_url} alt="" className="w-10 h-10 rounded-full"
              onError={e => { e.currentTarget.style.display="none"; }} />
          )}
          <div className="flex-1">
            <div className="font-medium text-white">{loading ? symbol : data?.name}</div>
            <div className="text-[11px] text-gray-500">{symbol}{data?.rank ? ` · Rang #${data.rank}` : ""}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white text-xl">×</button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500 text-sm">Chargement...</div>
        ) : data ? (
          <div className="px-6 py-4 space-y-4">

            {/* Prix */}
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="font-mono text-2xl font-medium text-white mb-2">
                ${(data.price||0) > 1000
                  ? (data.price||0).toLocaleString("fr-FR", {maximumFractionDigits: 2})
                  : (data.price||0).toFixed(4)}
              </div>
              <div className="flex gap-4">
                {[
                  { label: "24h", val: data.change_24h },
                  { label: "7j",  val: data.change_7d },
                ].map(c => (
                  <span key={c.label} className={`text-[11px] font-mono ${(c.val||0)>=0?"text-green-400":"text-red-400"}`}>
                    {(c.val||0)>=0?"+":""}{(c.val||0).toFixed(2)}% ({c.label})
                  </span>
                ))}
              </div>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Market Cap",    value: data.market_cap ? "$"+Math.round((data.market_cap||0)/1e9)+"B" : "—" },
                { label: "ATH Distance",  value: `${(data.ath_change_pct||0).toFixed(0)}%`, color: "text-orange-400" },
                { label: "Liquidité",     value: `${data.liquidity_score||0}/100` },
                { label: "Funding",       value: data.funding_sentiment || "—",
                  color: data.funding_sentiment === "très_baissier" ? "text-green-400" :
                         data.funding_sentiment === "très_haussier" ? "text-red-400" : "" },
                { label: "Trades SYNAPSE",value: `${data.trades_count||0}` },
                { label: "Win rate",      value: data.trades_count ? `${data.win_rate}%` : "—",
                  color: (data.win_rate||0)>=50 ? "text-green-400" : (data.win_rate||0)>0 ? "text-red-400" : "" },
              ].map(m => (
                <div key={m.label} className="bg-[#1a1a1a] rounded-xl px-3 py-2.5">
                  <div className="text-[9px] text-gray-500 uppercase mb-1">{m.label}</div>
                  <div className={`font-mono text-[12px] font-medium ${m.color||"text-white"}`}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Univers + badges */}
            {(data.active_universes?.length > 0 || data.shariah) && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-2">Univers actifs</div>
                <div className="flex flex-wrap gap-1.5">
                  {data.active_universes?.map(u => {
                    const m = UNIVERSE_META[u];
                    return m ? (
                      <span key={u} className={`text-[10px] px-2 py-1 border rounded-lg ${m.color}`}>
                        {m.icon} {m.label}
                      </span>
                    ) : null;
                  })}
                  {data.shariah && (
                    <span className="text-[10px] px-2 py-1 border border-purple-600 text-purple-400 rounded-lg">☽ Shariah</span>
                  )}
                </div>
              </div>
            )}

            {/* Position ouverte */}
            {data.position && (
              <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3">
                <div className="text-[10px] text-green-400 font-medium mb-1">Position ouverte</div>
                <div className="text-[11px] text-green-300">
                  {data.position.side} · {parseFloat(data.position.size_usdt||0).toFixed(0)} USDT ·
                  Score {parseFloat(data.position.opportunity_score||0).toFixed(0)}/100
                </div>
              </div>
            )}

            {/* Analyse IA */}
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] text-gray-500 uppercase">Analyse IA</div>
                {!aiAnalysis && (
                  <button onClick={generateAI} disabled={aiLoading}
                    className="text-[10px] bg-[#222] hover:bg-[#333] text-gray-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40">
                    {aiLoading ? "Analyse en cours..." : "Générer l'analyse →"}
                  </button>
                )}
              </div>
              {aiAnalysis ? (
                <div className="text-[11px] text-gray-300 leading-relaxed">{aiAnalysis}</div>
              ) : (
                <div className="text-[11px] text-gray-600 italic">
                  Cliquez pour générer une analyse IA basée sur toutes les données disponibles
                </div>
              )}
            </div>

            {/* Historique trades */}
            {data.trades?.length > 0 && (
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-2">
                  Historique SYNAPSE · {data.trades_count} trades ·
                  <span className={data.total_pnl>=0?"text-green-400":"text-red-400"}>
                    {" "}{data.total_pnl>=0?"+":""}{data.total_pnl?.toFixed(2)} USDT
                  </span>
                </div>
                <div className="space-y-1.5">
                  {data.trades.slice(0,5).map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]">{t.won ? "✅" : "❌"}</span>
                        <span className="text-[10px] text-gray-400">{(t.strategy||"").replace(/_/g," ")}</span>
                        <span className="text-[9px] text-gray-600 bg-[#222] px-1.5 py-0.5 rounded">{t.regime_at_open}</span>
                      </div>
                      <span className={`text-[11px] font-mono ${parseFloat(t.pnl_usdt||0)>=0?"text-green-400":"text-red-400"}`}>
                        {parseFloat(t.pnl_usdt||0)>=0?"+":""}{parseFloat(t.pnl_usdt||0).toFixed(2)} USDT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function UniversesPage() {
  const { data, loading } = useApi<UniversesData>("/api/universes", 3600000);
  const [active, setActive]   = useState("momentum");
  const [selected, setSelected] = useState<string | null>(null);

  const universe = data?.universes?.[active];
  const meta     = UNIVERSE_META[active];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-6 pt-6 pb-4">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Universe Engine · Data Platform</div>
        <div className="text-xl font-medium text-white">Univers de Trading</div>
        <div className="text-[11px] text-gray-500 mt-1">Sélection dynamique · Mis à jour toutes les heures</div>
      </div>

      {/* Tabs univers */}
      <div className="px-6 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(UNIVERSE_META).map(([key, m]) => {
            const u = data?.universes?.[key];
            const isActive = active === key;
            return (
              <button key={key} onClick={() => setActive(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all ${
                  isActive ? `${m.color} bg-[#1a1a1a]` : "text-gray-500 border-[#222] hover:border-[#333]"
                }`}>
                <span>{m.icon}</span>
                <span>{m.label}</span>
                {u && <span className="text-[9px] opacity-50 ml-0.5">({u.count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      {meta && universe && (
        <div className="px-6 mb-4">
          <div className="bg-[#141414] border border-[#222] rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <div className={`text-[12px] font-medium ${meta.color}`}>{meta.label} — {universe.count} assets</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{meta.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Assets grid */}
      <div className="px-6">
        {loading && (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && universe && active !== "pepites_dex" && (
          <div className="grid grid-cols-2 gap-2">
            {universe.assets.map(symbol => (
              <AssetCard key={symbol} symbol={symbol}
                score={Math.round(universe.scores[symbol] || 0)}
                onSelect={setSelected} />
            ))}
          </div>
        )}

        {!loading && universe && active === "pepites_dex" && (
          <div className="space-y-3">
            {universe.assets.map((name, i) => (
              <div key={i} className="bg-[#141414] border border-[#222] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Protocole DEX · Voir analyse →</div>
                </div>
                <div className="text-right">
                  <div className="text-orange-400 font-mono text-sm font-medium">
                    {Math.round(universe.scores[name] || 0)}/100
                  </div>
                  <div className="text-[9px] text-gray-600">Score</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !universe && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-sm">Univers en construction...</div>
            <div className="text-gray-600 text-[11px] mt-1">Les données arrivent dans quelques minutes</div>
          </div>
        )}
      </div>

      {/* Fiche asset */}
      {selected && <AssetSheet symbol={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
