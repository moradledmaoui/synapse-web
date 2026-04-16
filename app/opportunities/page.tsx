"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface DexToken {
  name: string; symbol: string; network: string; contract: string;
  price_usd: number; liquidity: number; volume_24h: number;
  price_change_24h: number; vol_liq_ratio: number; age_days: number;
  score: number; signals: string[]; tradable: boolean; dex_url: string;
  security?: { rug_score: number; is_honeypot: boolean; verdict: string; };
}
interface TokensData { tokens: DexToken[]; total: number; tradable: number; }
interface Sentiment { summary: { fear_greed_value: number; fear_greed_label: string; btc_dominance_pct: number; }; }

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}
function fmtLiq(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "k";
  return "$" + n.toFixed(0);
}

const NET_COLORS: Record<string, string> = {
  Ethereum: "text-blue-500 bg-blue-50 border-blue-200",
  BSC:      "text-yellow-600 bg-yellow-50 border-yellow-200",
  Solana:   "text-purple-500 bg-purple-50 border-purple-200",
  Arbitrum: "text-cyan-500 bg-cyan-50 border-cyan-200",
  Base:     "text-blue-400 bg-blue-50 border-blue-200",
};

function TokenCard({ token }: { token: DexToken }) {
  const [open, setOpen] = useState(false);
  const up  = token.price_change_24h >= 0;
  const sec = token.security;
  const rug = sec?.rug_score ?? null;
  const netColor = NET_COLORS[token.network] || "text-gray-500 bg-gray-50 border-gray-200";

  return (
    <div className={"border rounded-xl overflow-hidden transition-colors " + (token.tradable ? "border-green-200 bg-white" : "border-gray-200 bg-white hover:border-gray-300")}>
      <button className="w-full px-4 pt-3.5 pb-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 font-mono">
            {token.symbol.slice(0, 3)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{token.name || token.symbol}</span>
              <span className={"text-[9px] px-1.5 py-0.5 rounded border font-mono " + netColor}>{token.network}</span>
              {token.tradable && <span className="text-[9px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">AUTO</span>}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              Liq {fmtLiq(token.liquidity)} · Vol/Liq {fmt(token.vol_liq_ratio, 1)}x · Score {token.score}/100
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={"text-sm font-mono font-medium " + (up ? "text-green-600" : "text-red-500")}>
              {up ? "+" : ""}{fmt(token.price_change_24h, 1)}%
            </div>
            {rug != null && (
              <div className={"text-[10px] font-mono " + (rug <= 20 ? "text-green-500" : rug <= 40 ? "text-yellow-500" : "text-red-400")}>
                rug {rug}
              </div>
            )}
          </div>
          <svg className={"w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 " + (open ? "rotate-180" : "")} viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mt-2.5">
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className={"h-full rounded-full " + (token.score >= 70 ? "bg-green-400" : token.score >= 50 ? "bg-yellow-400" : "bg-red-300")}
              style={{ width: token.score + "%" }} />
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50 space-y-3">
          {token.signals && token.signals.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {token.signals.map((s, i) => (
                <span key={i} className="text-[10px] text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg font-mono">{s}</span>
              ))}
            </div>
          )}
          {sec && !sec.is_honeypot && (
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase mb-1">Securite</div>
                <div className={rug != null && rug <= 20 ? "text-green-600" : rug != null && rug <= 40 ? "text-yellow-500" : "text-red-400"}>
                  {sec.verdict || ("Rug score " + rug + "/100")}
                </div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase mb-1">Honeypot</div>
                <div className={sec.is_honeypot ? "text-red-500" : "text-green-600"}>
                  {sec.is_honeypot ? "OUI" : "Non"}
                </div>
              </div>
            </div>
          )}
          {sec?.is_honeypot && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[11px] text-red-500 font-mono">
              HONEYPOT detecte - ne pas trader
            </div>
          )}
          <div className="flex gap-2">
            <a href={token.dex_url} target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-500 text-[11px] text-center hover:border-gray-300 transition-colors font-mono">
              Voir sur DEX
            </a>
            {token.contract && (
              <button
                onClick={() => navigator.clipboard.writeText(token.contract)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-400 text-[11px] hover:border-gray-300 transition-colors font-mono"
              >
                Copier contrat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  const { data: tokensData } = useApi<TokensData>("/api/dex/tokens", 3600000);
  const { data: sentiment }  = useApi<Sentiment>("/api/sentiment", 300000);
  const [filter, setFilter]  = useState<"all" | "tradable">("all");

  const fg = sentiment?.summary?.fear_greed_value;
  const tokens = (tokensData?.tokens || []).filter((t) =>
    filter === "tradable" ? t.tradable : true
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Pepites DEX</h1>
            <p className="text-[11px] text-gray-400">GeckoTerminal · GoPlus · Multichain</p>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {tokensData?.total || 0} tokens · {tokensData?.tradable || 0} auto
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        {fg != null && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-6">
              <div>
                <div className={"text-xl font-mono font-semibold " + (fg < 25 ? "text-red-500" : fg < 45 ? "text-orange-400" : fg > 75 ? "text-green-500" : "text-yellow-500")}>{fg}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Fear & Greed</div>
              </div>
              <div>
                <div className="text-xl font-mono font-semibold text-gray-900">{fmt(sentiment?.summary?.btc_dominance_pct, 1)}%</div>
                <div className="text-[10px] text-gray-400 mt-0.5">BTC Dom</div>
              </div>
            </div>
            {fg < 25 && <p className="text-[11px] text-blue-400 mt-3 pt-3 border-t border-gray-100 font-mono">Peur extreme - moment favorable aux pepites DEX</p>}
          </div>
        )}

        <div className="flex gap-2">
          {[
            { key: "all",      label: "Tous (" + (tokensData?.total || 0) + ")" },
            { key: "tradable", label: "Auto-valides (" + (tokensData?.tradable || 0) + ")" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className={"text-[11px] px-4 py-2 rounded-xl border transition-colors font-mono " + (filter === f.key ? "border-gray-400 bg-white text-gray-900" : "border-gray-200 bg-white text-gray-400 hover:border-gray-300")}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tokens.length === 0 ? (
            <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
              <p className="text-gray-400 text-sm">Collecte en cours...</p>
              <p className="text-gray-300 text-xs mt-1 font-mono">Mise a jour toutes les 2 heures</p>
            </div>
          ) : (
            tokens.map((t, i) => <TokenCard key={i} token={t} />)
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center font-mono">
          Donnees informatives. Verifier le projet avant d investir.
        </p>
      </div>
    </div>
  );
}
