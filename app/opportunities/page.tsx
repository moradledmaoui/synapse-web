"use client";
import { useApi } from "../hooks/useApi";

interface Pepite {
  name: string;
  chain: string;
  tvl: number;
  tvl_1d: number;
  tvl_7d: number;
  score: number;
  signals: string[];
  url: string;
  category: string;
}

interface DexData {
  pepites: Pepite[];
  total: number;
  context: {
    fear_greed: number;
    fear_greed_label: string;
    btc_dominance: number;
    dominance_signal: string;
    funding_sentiment: string;
    note: string;
  };
}

interface Sentiment {
  summary: {
    fear_greed_value: number;
    fear_greed_label: string;
    btc_dominance_pct: number;
    dominance_signal: string;
    funding_sentiment: string;
    global_sentiment_score: number;
  };
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-mono font-medium text-white w-8 text-right">{score}</span>
    </div>
  );
}

export default function OpportunitiesPage() {
  const { data: dexData } = useApi<DexData>("/api/dex/pepites?limit=20", 3600000);
  const { data: sentiment } = useApi<Sentiment>("/api/sentiment", 3600000);

  const fg = sentiment?.summary?.fear_greed_value || 0;
  const fgLabel = sentiment?.summary?.fear_greed_label || "";
  const fgColor = fg < 25 ? "text-red-400" : fg < 45 ? "text-orange-400" : fg > 75 ? "text-green-400" : "text-yellow-400";
  const domSignal = sentiment?.summary?.dominance_signal || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-6 pb-24">

      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Data Platform · DEX Scanner</div>
        <div className="text-xl font-medium text-white">Pépites DEX</div>
        <div className="text-[11px] text-gray-500 mt-1">
          Protocoles avec croissance TVL anormale · Mis à jour toutes les heures
        </div>
      </div>

      {/* Contexte marché */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-4 mb-5">
        <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3">Contexte marché actuel</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Fear & Greed</div>
            <div className={`font-mono text-xl font-medium ${fgColor}`}>{fg}</div>
            <div className={`text-[10px] ${fgColor}`}>{fgLabel}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">BTC Dominance</div>
            <div className="font-mono text-xl font-medium text-white">
              {sentiment?.summary?.btc_dominance_pct?.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400">{domSignal}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Funding</div>
            <div className="font-mono text-xl font-medium text-white">
              {sentiment?.summary?.funding_sentiment || "—"}
            </div>
            <div className="text-[10px] text-gray-400">BTC + ETH</div>
          </div>
        </div>

        {/* Signal contextuel */}
        {fg < 30 && (
          <div className="mt-3 bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2">
            <div className="text-[11px] text-green-400 font-medium">
              Opportunité historique — Fear & Greed {fg} (Peur Extrême)
            </div>
            <div className="text-[10px] text-green-600 mt-0.5">
              Les pépites s'accumulent discrètement avant le retour de la cupidité
            </div>
          </div>
        )}
        {domSignal === "altseason" && (
          <div className="mt-3 bg-blue-900/20 border border-blue-800/40 rounded-lg px-3 py-2">
            <div className="text-[11px] text-blue-400 font-medium">Altseason détectée</div>
            <div className="text-[10px] text-blue-600 mt-0.5">
              Capital en rotation vers les altcoins — opportunités DEX maximales
            </div>
          </div>
        )}
      </div>

      {/* Liste pépites */}
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-3">
        {dexData?.total || 0} pépites identifiées aujourd'hui
      </div>

      <div className="space-y-3">
        {(dexData?.pepites || []).map((p, i) => (
          <div key={i} className="bg-[#141414] border border-[#222] rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{p.name}</span>
                  <span className="text-[9px] px-2 py-0.5 bg-[#222] text-gray-400 rounded-full">
                    {p.chain}
                  </span>
                  {p.category && (
                    <span className="text-[9px] px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-500">
                  TVL : ${(p.tvl / 1_000_000).toFixed(2)}M
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-mono text-sm font-medium">
                  +{p.tvl_7d?.toFixed(0)}%
                </div>
                <div className="text-[10px] text-gray-500">en 7 jours</div>
              </div>
            </div>

            <ScoreBar score={p.score} />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(p.signals || []).map((s, j) => (
                <span key={j} className="text-[10px] bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded-lg">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[10px] text-gray-600">
                Validation humaine recommandée avant entrée
              </div>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 hover:text-blue-300">
                  Voir le projet →
                </a>
              )}
            </div>
          </div>
        ))}

        {(!dexData?.pepites || dexData.pepites.length === 0) && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Collecte en cours... Données disponibles dans quelques minutes
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-[10px] text-gray-600 leading-relaxed border-t border-[#222] pt-4">
        ⚠️ Ces données sont informatives uniquement. La croissance TVL peut être le résultat
        de manipulation (pump & dump). Toujours valider le projet, l'équipe et le cas d'usage
        avant tout investissement. SYNAPSE ne garantit pas les performances futures.
      </div>
    </div>
  );
}
