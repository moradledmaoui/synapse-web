"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

interface DexToken {
  name: string;
  symbol: string;
  network: string;
  contract: string;
  pool_address: string;
  price_usd: number;
  liquidity: number;
  volume_24h: number;
  market_cap: number;
  price_change_24h: number;
  vol_liq_ratio: number;
  age_days: number;
  score: number;
  signals: string[];
  tradable: boolean;
  dex_url: string;
  security?: {
    rug_score: number;
    verdict: string;
    verdict_color: string;
    is_honeypot: boolean;
    lp_locked: boolean;
    buy_tax: number;
    sell_tax: number;
    top10_percent: number;
    risks: string[];
    goods: string[];
  };
}

interface TokensData {
  tokens: DexToken[];
  total: number;
  tradable: number;
  collected_at: string;
}

interface Sentiment {
  summary: {
    fear_greed_value: number;
    fear_greed_label: string;
    btc_dominance_pct: number;
    dominance_signal: string;
  };
}

function SecurityBadge({ security }: { security?: DexToken["security"] }) {
  if (!security) return <span className="text-[9px] text-gray-600">Non analysé</span>;
  const rug = security.rug_score;
  const color = rug <= 20 ? "text-green-400" : rug <= 40 ? "text-yellow-400" : "text-red-400";
  const label = rug <= 20 ? "Sûr" : rug <= 40 ? "Prudence" : "Risqué";
  return (
    <span className={`text-[9px] font-medium ${color}`}>
      {security.is_honeypot ? "🔴 HONEYPOT" : `${label} (${rug}/100)`}
    </span>
  );
}

function NetworkBadge({ network }: { network: string }) {
  const colors: Record<string, string> = {
    Ethereum: "bg-blue-900/30 text-blue-400",
    Solana:   "bg-purple-900/30 text-purple-400",
    BSC:      "bg-yellow-900/30 text-yellow-400",
    Arbitrum: "bg-cyan-900/30 text-cyan-400",
    Base:     "bg-blue-900/20 text-blue-300",
    Optimism: "bg-red-900/20 text-red-400",
    Polygon:  "bg-purple-900/20 text-purple-300",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${colors[network] || "bg-gray-800 text-gray-400"}`}>
      {network}
    </span>
  );
}

function TokenCard({ token, onValidate }: { token: DexToken; onValidate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const up = token.price_change_24h >= 0;
  const sec = token.security;

  return (
    <div className={`bg-[#141414] border rounded-xl overflow-hidden transition-all ${
      token.tradable ? "border-green-800/50" : "border-[#222]"
    }`}>
      {/* Header */}
      <div className="px-4 py-3" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white truncate">{token.name || token.symbol}</span>
              {token.tradable && (
                <span className="text-[8px] bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                  AUTO ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <NetworkBadge network={token.network} />
              <span className="text-[9px] text-gray-500">{token.symbol}</span>
              {token.age_days < 7 && (
                <span className="text-[8px] text-orange-400">NEW {token.age_days?.toFixed(0)}j</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <div className={`text-sm font-mono font-medium ${up ? "text-green-400" : "text-red-400"}`}>
              {up ? "+" : ""}{token.price_change_24h?.toFixed(1)}%
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              ${token.price_usd < 0.01 ? token.price_usd?.toFixed(6) : token.price_usd?.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${token.score >= 70 ? "bg-green-500" : token.score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${token.score}%` }} />
          </div>
          <span className="text-[10px] font-mono text-white">{token.score}/100</span>
        </div>

        {/* Métriques clés */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>Liq: <span className="text-gray-300">${token.liquidity >= 1e6 ? (token.liquidity/1e6).toFixed(1)+"M" : (token.liquidity/1000).toFixed(0)+"k"}</span></span>
          <span>Vol/Liq: <span className="text-gray-300">{token.vol_liq_ratio?.toFixed(1)}×</span></span>
          <span><SecurityBadge security={sec} /></span>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1a1a1a] pt-3 space-y-3">
          {/* Signaux */}
          <div className="flex flex-wrap gap-1">
            {token.signals?.map((s, i) => (
              <span key={i} className="text-[9px] bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded-lg">{s}</span>
            ))}
          </div>

          {/* Sécurité détaillée */}
          {sec && !sec.is_honeypot && (
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-1.5">
              <div className="text-[10px] text-gray-500 uppercase mb-2">Analyse sécurité</div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <span className={sec.lp_locked ? "text-green-400" : "text-red-400"}>
                  {sec.lp_locked ? "✅" : "❌"} LP lockée
                </span>
                <span className={sec.buy_tax === 0 ? "text-green-400" : "text-yellow-400"}>
                  Buy tax: {sec.buy_tax}%
                </span>
                <span className={sec.sell_tax <= 5 ? "text-green-400" : "text-red-400"}>
                  Sell tax: {sec.sell_tax}%
                </span>
                <span className={sec.top10_percent <= 50 ? "text-green-400" : "text-red-400"}>
                  Top 10: {sec.top10_percent?.toFixed(0)}%
                </span>
              </div>
              {sec.risks?.slice(0,2).map((r, i) => (
                <div key={i} className="text-[9px] text-red-400">{r}</div>
              ))}
              {sec.goods?.slice(0,2).map((g, i) => (
                <div key={i} className="text-[9px] text-green-400">{g}</div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <a href={token.dex_url} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] bg-[#1a1a1a] text-gray-300 px-3 py-2 rounded-lg hover:bg-[#222] transition-colors">
              Voir sur DEX →
            </a>
            {token.contract && (
              <button onClick={() => {navigator.clipboard.writeText(token.contract)}}
                className="text-[10px] bg-[#1a1a1a] text-gray-500 px-3 py-2 rounded-lg hover:bg-[#222]">
                📋 Contrat
              </button>
            )}
            <button onClick={onValidate}
              className="flex-1 text-center text-[10px] bg-green-900/40 text-green-400 border border-green-800/50 px-3 py-2 rounded-lg hover:bg-green-900/60 transition-colors font-medium">
              ✅ Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  const { data: tokensData, refetch } = useApi<TokensData>("/api/dex/tokens?limit=20", 3600000);
  const { data: sentiment }           = useApi<Sentiment>("/api/sentiment", 3600000);
  const [filter, setFilter]           = useState<"all" | "tradable">("all");

  const fg      = sentiment?.summary?.fear_greed_value || 0;
  const fgColor = fg < 25 ? "text-red-400" : fg < 45 ? "text-orange-400" : fg > 75 ? "text-green-400" : "text-yellow-400";

  const tokens = (tokensData?.tokens || []).filter(t =>
    filter === "tradable" ? t.tradable : true
  );

  async function handleValidate(token: DexToken) {
    // Pour l'instant — copie le contrat et ouvre le DEX
    if (token.contract) {
      navigator.clipboard.writeText(token.contract);
    }
    window.open(token.dex_url, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">DEX Scanner · Multichain</div>
        <div className="text-xl font-medium">Pépites DEX</div>
        <div className="text-[11px] text-gray-500 mt-1">
          GeckoTerminal + DexScreener · GoPlus Security · Mis à jour toutes les 2h
        </div>
      </div>

      {/* Contexte */}
      <div className="px-6 mb-4">
        <div className="bg-[#141414] border border-[#222] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 mb-1">Fear & Greed</div>
            <div className={`text-2xl font-mono font-medium ${fgColor}`}>{fg}</div>
            <div className={`text-[10px] ${fgColor}`}>{sentiment?.summary?.fear_greed_label}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 mb-1">BTC Dominance</div>
            <div className="text-lg font-mono text-white">{sentiment?.summary?.btc_dominance_pct?.toFixed(1)}%</div>
            <div className="text-[10px] text-gray-500">{sentiment?.summary?.dominance_signal}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 mb-1">Tokens qualifiés</div>
            <div className="text-lg font-mono text-white">{tokensData?.total || 0}</div>
            <div className="text-[10px] text-green-400">{tokensData?.tradable || 0} auto-validés</div>
          </div>
        </div>

        {fg < 30 && (
          <div className="mt-2 bg-green-900/20 border border-green-800/30 rounded-xl px-4 py-2">
            <div className="text-[11px] text-green-400 font-medium">
              Peur Extrême ({fg}) — Moment historique d'accumulation sur DEX
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="px-6 mb-4 flex gap-2">
        {[
          { key: "all",      label: `Tous (${tokensData?.total || 0})` },
          { key: "tradable", label: `Auto-validés (${tokensData?.tradable || 0})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as any)}
            className={`text-[11px] px-4 py-2 rounded-xl border transition-colors ${
              filter === f.key
                ? "border-white text-white bg-[#1a1a1a]"
                : "border-[#222] text-gray-500"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste tokens */}
      <div className="px-6 space-y-3">
        {tokens.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Collecte en cours... Données disponibles dans quelques minutes
          </div>
        ) : (
          tokens.map((token, i) => (
            <TokenCard key={i} token={token} onValidate={() => handleValidate(token)} />
          ))
        )}
      </div>

      <div className="px-6 mt-6 text-[10px] text-gray-600 border-t border-[#222] pt-4">
        ⚠️ Ces données sont informatives. Toujours vérifier le projet avant d'investir.
        Le bouton "Valider" copie le contrat et ouvre le DEX pour trading manuel.
      </div>
    </div>
  );
}
