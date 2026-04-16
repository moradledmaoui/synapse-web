"use client";
import { useState } from "react";
import { useApi } from "./hooks/useApi";
import { Header } from "./components/Header";
import { PositionCard } from "./components/PositionCard";

interface Portfolio {
  capital: number;
  capital_initial: number;
  total_value: number;
  pnl_usdt: number;
  pnl_pct: number;
  latent_pnl: number;
  drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  open_positions: number;
  kill_switch: boolean;
  regime: string;
  regime_data: any;
}

interface PositionsData {
  positions: any[];
  total_pnl: number;
}

interface DexPortfolio {
  positions: any[];
  total_positions: number;
  total_invested: number;
  total_pnl: number;
}

interface Sentiment {
  summary: {
    fear_greed_value: number;
    fear_greed_label: string;
    btc_dominance_pct: number;
    dominance_signal: string;
    funding_sentiment: string;
  };
}

function MarketContext({ sentiment, regime }: { sentiment: any; regime: any }) {
  const fg   = sentiment?.summary?.fear_greed_value || 50;
  const dom  = sentiment?.summary?.btc_dominance_pct || 50;
  const fund = sentiment?.summary?.funding_sentiment || "neutre";
  const adx  = regime?.adx || 0;
  const sq   = regime?.squeeze || false;

  const fgEmoji = fg < 20 ? "😨" : fg < 40 ? "😟" : fg < 60 ? "😐" : fg < 80 ? "🙂" : "🤑";
  const fgColor = fg < 25 ? "#FF4444" : fg < 45 ? "#F97316" : fg > 75 ? "#00D4AA" : "#F59E0B";

  return (
    <div className="mx-5 mb-4 rounded-2xl border border-[#21262D] bg-[#0D1117] p-4">
      <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-3">Contexte marché</div>
      <div className="flex items-center gap-4">
        <div className="flex-1 text-center">
          <div className="text-lg">{fgEmoji}</div>
          <div className="font-mono text-[15px] font-bold mt-0.5" style={{ color: fgColor }}>{fg}</div>
          <div className="text-[9px] text-[#8B949E] mt-0.5">Fear & Greed</div>
        </div>
        <div className="w-px h-10 bg-[#21262D]" />
        <div className="flex-1 text-center">
          <div className="font-mono text-[15px] font-bold text-[#E6EDF3]">{dom?.toFixed(1)}%</div>
          <div className="text-[9px] text-[#8B949E] mt-1">BTC Dom</div>
        </div>
        <div className="w-px h-10 bg-[#21262D]" />
        <div className="flex-1 text-center">
          <div className="font-mono text-[15px] font-bold text-[#E6EDF3]">{adx?.toFixed(0)}</div>
          <div className="text-[9px] text-[#8B949E] mt-1">ADX</div>
        </div>
        <div className="w-px h-10 bg-[#21262D]" />
        <div className="flex-1 text-center">
          <div className={`text-[13px] font-bold ${sq ? "text-[#F59E0B]" : "text-[#8B949E]"}`}>
            {sq ? "💥" : "·"}
          </div>
          <div className="text-[9px] text-[#8B949E] mt-1">Squeeze</div>
        </div>
      </div>
      {fg < 25 && (
        <div className="mt-3 pt-3 border-t border-[#21262D] text-[10px] text-[#F59E0B]">
          ⚡ Peur Extrême — historiquement favorable aux entrées DEX
        </div>
      )}
      {sq && (
        <div className="mt-3 pt-3 border-t border-[#21262D] text-[10px] text-[#3B82F6]">
          💥 Squeeze actif — explosion de volatilité imminente
        </div>
      )}
    </div>
  );
}

function DexPositionCard({ pos }: { pos: any }) {
  const [expanded, setExpanded] = useState(false);
  const x = parseFloat(pos.x_multiplier || 1);
  const target = parseFloat(pos.target_x2 || 0);
  const current = parseFloat(pos.current_price || pos.entry_price || 0);
  const entry = parseFloat(pos.entry_price || 0);
  const progressPct = entry > 0 ? Math.min(100, ((current - entry) / (target - entry)) * 100) : 0;
  const pnl = parseFloat(pos.pnl_usdt || 0);
  const up  = pnl >= 0;

  return (
    <div className="rounded-2xl border border-[#21262D] bg-[#0D1117] overflow-hidden">
      <button className="w-full px-4 pt-4 pb-3 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-black text-white">💎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-semibold text-[#E6EDF3]">
                {pos.symbol}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B15] text-[#F59E0B] font-mono">
                {pos.network?.toUpperCase()}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8B949E15] text-[#8B949E]">
                SIM
              </span>
            </div>
            <div className="text-[10px] text-[#8B949E] mt-0.5">
              ${parseFloat(pos.size_usdt || 0).toFixed(0)} investi · Target ×2
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`font-mono text-[13px] font-semibold ${up ? "text-[#00D4AA]" : "text-[#8B949E]"}`}>
              {x.toFixed(2)}×
            </div>
            <div className="text-[10px] font-mono text-[#8B949E]">
              {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)} USDT
            </div>
          </div>
        </div>

        {/* Barre progression vers X2 */}
        <div className="mt-3">
          <div className="h-1 bg-[#21262D] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#00D4AA] transition-all duration-1000"
              style={{ width: `${Math.max(2, progressPct)}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-mono text-[#8B949E]">
              ${entry.toFixed(entry < 0.001 ? 8 : 4)}
            </span>
            <span className="text-[9px] font-mono text-[#F59E0B]">
              {progressPct.toFixed(0)}% vers ×2
            </span>
            <span className="text-[9px] font-mono text-[#00D4AA]">
              ${target.toFixed(target < 0.001 ? 8 : 4)}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#21262D] pt-3">
          <div className="text-[10px] text-[#8B949E] leading-relaxed">
            Position simulée · Mis à jour toutes les heures via GeckoTerminal.
            À ×2 : récupère ${ (parseFloat(pos.size_usdt||0)/2).toFixed(0) } USDT et laisse courir le reliquat.
          </div>
        </div>
      )}
    </div>
  );
}

function SignalStatus({ regime, positions }: { regime: any; positions: any[] }) {
  const sq  = regime?.squeeze || false;
  const adx = regime?.adx || 0;

  return (
    <div className="mx-5 mb-4 rounded-2xl border border-[#21262D] bg-[#0D1117] p-4">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${sq ? "bg-[#F59E0B] animate-pulse" : "bg-[#8B949E]"}`} />
        <div className="flex-1">
          <div className="text-[11px] font-medium text-[#E6EDF3]">
            {sq
              ? "Squeeze actif — signal imminent"
              : adx > 35
              ? "Tendance présente — analyse en cours"
              : "Marché en chop — en attente de signal"
            }
          </div>
          <div className="text-[10px] text-[#8B949E] mt-0.5">
            {positions.length} positions ouvertes · prochain cycle à la bougie 1h
          </div>
        </div>
        <div className="text-[10px] font-mono text-[#8B949E]">
          ADX {adx?.toFixed(0)}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 10000);
  const { data: posData }   = useApi<PositionsData>("/api/positions", 10000);
  const { data: dexData }   = useApi<DexPortfolio>("/api/dex/positions", 60000);
  const { data: sentiment } = useApi<Sentiment>("/api/sentiment", 300000);

  const positions = posData?.positions || [];
  const dexPositions = dexData?.positions || [];
  const regime = portfolio?.regime_data || {};

  async function handleClose(symbol: string) {
    if (!confirm(`Fermer la position ${symbol} ?`)) return;
    await fetch(`/api/close/${symbol}`, { method: "POST" });
  }

  if (!portfolio) return (
    <div className="min-h-screen bg-[#080B0F] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-lg bg-[#00D4AA] flex items-center justify-center mx-auto mb-3">
          <span className="text-[#080B0F] text-[12px] font-black">S</span>
        </div>
        <div className="text-[#8B949E] text-[12px]">Connexion au moteur...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080B0F] text-[#E6EDF3]">
      <Header portfolio={portfolio} />

      <div className="pt-4 pb-28 space-y-4">

        {/* Contexte marché */}
        <MarketContext sentiment={sentiment} regime={regime} />

        {/* Signal status */}
        <SignalStatus regime={regime} positions={positions} />

        {/* Positions CEX */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-[#8B949E] uppercase tracking-widest">
              Positions CEX
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-[11px] font-mono font-medium ${
                (posData?.total_pnl || 0) >= 0 ? "text-[#00D4AA]" : "text-[#FF4444]"
              }`}>
                {(posData?.total_pnl || 0) >= 0 ? "+" : ""}
                {(posData?.total_pnl || 0).toFixed(2)} USDT
              </div>
              <div className="text-[10px] text-[#8B949E]">
                {positions.length} open
              </div>
            </div>
          </div>

          {positions.length === 0 ? (
            <div className="rounded-2xl border border-[#21262D] bg-[#0D1117] p-8 text-center">
              <div className="text-[#8B949E] text-[12px]">Aucune position CEX ouverte</div>
              <div className="text-[10px] text-[#8B949E] mt-1 opacity-60">
                En attente du prochain signal...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map(pos => (
                <PositionCard key={pos.id} pos={pos} onClose={handleClose} />
              ))}
            </div>
          )}
        </div>

        {/* Positions DEX */}
        {dexPositions.length > 0 && (
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] text-[#8B949E] uppercase tracking-widest">
                Pépites DEX <span className="text-[#F59E0B]">· Simulation</span>
              </div>
              <div className="text-[11px] font-mono text-[#8B949E]">
                ${(dexData?.total_invested || 0).toFixed(0)} investi
              </div>
            </div>
            <div className="space-y-3">
              {dexPositions.map((pos, i) => (
                <DexPositionCard key={i} pos={pos} />
              ))}
            </div>
          </div>
        )}

        {/* Stats rapides */}
        <div className="px-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Capital libre",  value: `$${(portfolio.capital/1000).toFixed(1)}k`, sub: "USDT" },
              { label: "Win Rate",       value: `${portfolio.win_rate || 0}%`,               sub: `${portfolio.total_trades} trades` },
              { label: "Drawdown",       value: `${portfolio.drawdown_pct?.toFixed(1)}%`,   sub: "depuis le pic", color: (portfolio.drawdown_pct || 0) > 5 ? "#FF4444" : undefined },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-[#21262D] bg-[#0D1117] px-3 py-3 text-center">
                <div className="text-[9px] text-[#8B949E] uppercase tracking-wide mb-1">{s.label}</div>
                <div className="font-mono text-[14px] font-semibold" style={{ color: s.color || "#E6EDF3" }}>
                  {s.value}
                </div>
                <div className="text-[9px] text-[#8B949E] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
