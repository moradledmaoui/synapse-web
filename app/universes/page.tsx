"use client";
import { useState } from "react";
import { useApi } from "../hooks/useApi";

const API = "";  // Proxy Next.js

interface Universe {
  label: string; icon: string; count: number;
  assets: string[]; is_active: boolean; is_secondary: boolean;
}
interface UniverseData {
  regime: string; active_universe: string;
  secondary: string[]; universes: Record<string, Universe>;
}
interface AssetRef {
  name: string; logo_url: string; rank: number;
  market_cap: number; change_24h: number; change_7d: number;
  ath_change_pct: number; sector: string; shariah: boolean;
  funding_sentiment: string;
}

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}

const UNIVERSE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  short_squeeze:       { label: "Short Squeeze",    icon: "SQ", color: "text-purple-500 border-purple-300 bg-purple-50" },
  accumulation:        { label: "Accumulation",     icon: "AC", color: "text-blue-500 border-blue-300 bg-blue-50" },
  momentum_confirme:   { label: "Momentum",         icon: "MO", color: "text-green-500 border-green-300 bg-green-50" },
  bas_de_cycle:        { label: "Bas de cycle",     icon: "BC", color: "text-orange-500 border-orange-300 bg-orange-50" },
  pepites_naissantes:  { label: "Pepites",          icon: "PE", color: "text-yellow-500 border-yellow-300 bg-yellow-50" },
  defensif:            { label: "Defensif",         icon: "DE", color: "text-gray-500 border-gray-300 bg-gray-50" },
};

function AssetCard({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const { data: asset } = useApi<any>("/api/asset/" + symbol, 60000);
  const { data: signal } = useApi<any>("/api/mcp/explain_signal?symbol=" + symbol, 60000);

  if (!asset) return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-2xl p-6">
        <div className="text-gray-400 text-sm text-center">Chargement...</div>
      </div>
    </div>
  );

  const sig = signal?.result || {};
  const up = (asset.change_24h || 0) >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-5 pb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {asset.logo_url && <img src={asset.logo_url} alt="" className="w-10 h-10 rounded-full" />}
              <div>
                <div className="text-base font-semibold text-gray-900">{symbol.replace("USDT", "")}/USDT</div>
                <div className="text-[11px] text-gray-400 font-mono">{asset.name} · Rang #{asset.rank}</div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 text-xl">x</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "24h",       value: (up ? "+" : "") + fmt(asset.change_24h) + "%", color: up ? "text-green-600" : "text-red-500" },
              { label: "7j",        value: (asset.change_7d >= 0 ? "+" : "") + fmt(asset.change_7d) + "%", color: asset.change_7d >= 0 ? "text-green-600" : "text-red-500" },
              { label: "vs ATH",   value: fmt(asset.ath_change_pct) + "%", color: "text-orange-500" },
              { label: "Secteur",  value: asset.sector || "--" },
              { label: "Funding",  value: asset.funding_sentiment || "--" },
              { label: "Shariah",  value: asset.shariah ? "Oui" : "Non", color: asset.shariah ? "text-green-600" : "text-gray-400" },
            ].map((m) => (
              <div key={m.label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{m.label}</div>
                <div className={"text-[11px] font-mono " + (m.color || "text-gray-900")}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Signal SYNAPSE</div>
            <div className="flex items-center gap-3">
              <div className={"text-sm font-mono font-semibold " + (sig.action === "BUY" ? "text-green-600" : sig.action === "SELL" ? "text-red-500" : "text-gray-400")}>
                {sig.action || "--"}
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                score {fmt(sig.score, 3)} / min {fmt(sig.min_score, 2)}
              </div>
            </div>
            {sig.reason && <p className="text-[11px] text-gray-500 mt-1 font-mono">{sig.reason}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversePage() {
  const { data: univData } = useApi<UniverseData>("/api/universes", 60000);
  const [selectedUniverse, setSelectedUniverse] = useState<string>("accumulation");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const universes = univData?.universes || {};
  const activeUniverse = univData?.active_universe || "";
  const regime = univData?.regime || "--";

  const currentUniverse = universes[selectedUniverse];
  const assets = currentUniverse?.assets || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      {selectedAsset && <AssetCard symbol={selectedAsset} onClose={() => setSelectedAsset(null)} />}

      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Univers</h1>
            <p className="text-[11px] text-gray-400">Regime {regime.toUpperCase()}</p>
          </div>
          <div className="text-[11px] text-gray-400 font-mono border border-gray-200 px-2.5 py-1 rounded-lg">
            {activeUniverse || "--"}
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.entries(UNIVERSE_LABELS).map(([key, cfg]) => {
            const u = universes[key];
            const isActive = key === activeUniverse;
            const isSelected = key === selectedUniverse;
            return (
              <button
                key={key}
                onClick={() => setSelectedUniverse(key)}
                className={"flex-shrink-0 px-3 py-2 rounded-xl border text-[11px] font-mono transition-colors " + (isSelected ? "border-gray-400 bg-white text-gray-900" : "border-gray-200 bg-white text-gray-400 hover:border-gray-300")}
              >
                <span className="mr-1">{cfg.icon}</span>
                {cfg.label}
                {isActive && <span className="ml-1 text-green-500">●</span>}
                {u && <span className="ml-1 text-gray-300">{u.count}</span>}
              </button>
            );
          })}
        </div>

        {currentUniverse && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                {UNIVERSE_LABELS[selectedUniverse]?.label}
                {selectedUniverse === activeUniverse && <span className="ml-2 text-green-500">ACTIF</span>}
              </div>
              <span className="text-[11px] text-gray-400 font-mono">{currentUniverse.count} assets</span>
            </div>

            <div className="space-y-2">
              {assets.map((symbol: string) => (
                <button
                  key={symbol}
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-left hover:border-gray-300 transition-colors"
                  onClick={() => setSelectedAsset(symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{symbol.replace("USDT", "")}/USDT</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">{symbol}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
