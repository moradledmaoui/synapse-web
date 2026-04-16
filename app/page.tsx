"use client";
import { useState } from "react";
import { useApi } from "./hooks/useApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface Portfolio {
  capital: number; total_value: number; pnl_usdt: number; pnl_pct: number;
  latent_pnl: number; drawdown_pct: number; win_rate: number;
  total_trades: number; open_positions: number; regime: string; regime_data: any;
}
interface Position {
  id: number; symbol: string; side: string; strategy: string;
  entry_price: number; current_price: number; stop_loss: number; take_profit: number;
  pnl_usdt: number; pnl_pct: number; size_usdt: number;
  score: number; opportunity_score: number;
  regime_at_open: string; opened_at: string; logo_url?: string;
}
interface PositionsData { positions: Position[]; total_pnl: number; }
interface DexPortfolio { positions: any[]; total_positions: number; total_invested: number; total_pnl: number; }
interface Sentiment { summary: { fear_greed_value: number; fear_greed_label: string; btc_dominance_pct: number; }; }

function fmt(n?: number, d = 2) { if (n == null || isNaN(n)) return "—"; return n.toFixed(d); }
function fmtPrice(p?: number) {
  if (!p) return "—";
  if (p < 0.0001) return p.toFixed(8);
  if (p < 0.01) return p.toFixed(6);
  if (p < 1) return p.toFixed(4);
  return p.toFixed(2);
}

const REGIME_COLORS: Record<string, string> = {
  trending_strong: "text-green-400 border-green-400",
  trending_weak:   "text-green-300 border-green-300",
  ranging:         "text-yellow-500 border-yellow-500",
  breakout:        "text-blue-400 border-blue-400",
  volatile:        "text-orange-400 border-orange-400",
  bear:            "text-red-400 border-red-400",
  panic:           "text-red-600 border-red-600",
};

const STRAT_LABELS: Record<string, string> = {
  mean_reversion: "Mean Rev", market_structure: "Mkt Struct",
  obv: "OBV", bollinger_squeeze: "BB Squeeze",
  momentum: "Momentum", rsi: "RSI", ema_crossover: "EMA Cross",
};

function Sparkline({ symbol, entryPrice }: { symbol: string; entryPrice: number }) {
  const points = [45, 42, 48, 38, 35, 40, 30, 28, 22, 18, 15];
  const w = 300; const h = 60;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => p);
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaD = pathD + ` L${w},${h} L0,${h} Z`;
  const entryX = xs[7];
  const entryY = ys[7];
  const currentX = xs[xs.length - 1];
  const currentY = ys[ys.length - 1];

  return (
    <div>
      <div className="border border-[#e5e7eb] rounded-lg p-3 bg-white">
        <svg width="100%" height="60" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#sg)"/>
          <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
          <circle cx={entryX} cy={entryY} r="3.5" fill="#d97706"/>
          <text x={entryX + 5} y={entryY - 4} fontSize="8" fill="#d97706" fontFamily="monospace">entrée</text>
          <circle cx={currentX} cy={currentY} r="4" fill="#16a34a"/>
        </svg>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>7j ago</span>
          <span className="text-gray-700">${fmtPrice(entryPrice * 1.028)}</span>
        </div>
      </div>
      <div className="mt-1.5 text-right">
        
          href={`https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-gray-400 underline hover:text-gray-600 transition-colors"
        >
          Ouvrir sur TradingView ›
        </a>
      </div>
    </div>
  );
}

function SlTpBar({ entry, current, sl, tp, score }: {
  entry: number; current: number; sl: number; tp: number; score: number;
}) {
  if (!sl || !tp || sl >= tp) return null;
  const range  = tp - sl;
  const posPct = Math.max(0, Math.min(100, ((current - sl) / range) * 100));
  const color  = posPct < 20 ? "#ef4444" : posPct > 80 ? "#16a34a" : "#ca8a04";

  return (
    <div className="mt-3">
      <div className="relative h-[3px] rounded-full bg-gray-100">
        <div className="absolute h-full rounded-full transition-all duration-700"
          style={{ width: `${posPct}%`, background: `linear-gradient(90deg, transparent, ${color}55)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
          style={{ left: `${posPct}%` }}>
          <div className="w-[10px] h-[10px] rounded-full border-2 border-white shadow-sm"
            style={{ background: color }} />
        </div>
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] font-mono">
        <span className="text-red-400">SL {fmtPrice(sl)}</span>
        <span className="text-gray-400">score {score?.toFixed(0)}/100</span>
        <span className="text-green-600">TP {fmtPrice(tp)}</span>
      </div>
    </div>
  );
}

function PositionCard({ pos }: { pos: Position }) {
  const [open, setOpen] = useState(false);
  const up    = (pos.pnl_usdt || 0) >= 0;
  const strat = STRAT_LABELS[pos.strategy] || pos.strategy;
  const score = pos.score || pos.opportunity_score || 0;
  const dur   = pos.opened_at ? Math.round((Date.now() - new Date(pos.opened_at).getTime()) / 3600000) : 0;

  async function handleClose() {
    if (!confirm(`Fermer ${pos.symbol} ?`)) return;
    await fetch(`${API}/api/mcp/close_position?symbol=${pos.symbol}`, { method: "POST" });
  }

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      open ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
    }`}>
      <button className="w-full px-4 pt-3.5 pb-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {pos.logo_url
              ? <img src={pos.logo_url} alt="" className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = "none"; }} />
              : <span className="text-[10px] text-gray-400 font-mono">{pos.symbol.replace("USDT","").slice(0,3)}</span>
            }
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${up ? "bg-green-400" : "bg-red-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {pos.symbol.replace("USDT","")}
              <span className="text-gray-400 font-normal">/USDT</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              {strat} · {dur}h · ${fmt(pos.size_usdt, 0)}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-mono font-medium ${up ? "text-green-600" : "text-red-500"}`}>
              {up ? "+" : ""}{fmt(pos.pnl_usdt)} USDT
            </div>
            <div className={`text-[11px] font-mono ${up ? "text-green-500" : "text-red-400"}`}>
              {up ? "+" : ""}{fmt(pos.pnl_pct)}%
            </div>
          </div>
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <SlTpBar entry={pos.entry_price} current={pos.current_price}
          sl={pos.stop_loss} tp={pos.take_profit} score={score} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50 space-y-3">
          <Sparkline symbol={pos.symbol} entryPrice={pos.entry_price} />
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Entrée",  value: `$${fmtPrice(pos.entry_price)}` },
              { label: "Actuel",  value: `$${fmtPrice(pos.current_price)}`, color: up ? "text-green-600" : "text-red-500" },
              { label: "Régime",  value: pos.regime_at_open || "—" },
              { label: "Taille",  value: `$${fmt(pos.size_usdt, 0)}` },
              { label: "SL",      value: `$${fmtPrice(pos.stop_loss)}`, color: "text-red-400" },
              { label: "TP",      value: `$${fmtPrice(pos.take_profit)}`, color: "text-green-600" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{m.label}</div>
                <div className={`text-[11px] font-mono ${m.color || "text-gray-900"}`}>{m.value}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleClose}
              className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-50 transition-colors">
              Fermer la position
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 text-xs hover:border-gray-300 transition-colors">
              Analyser →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DexCard({ pos }: { pos: any }) {
  const [open, setOpen] = useState(false);
  const x       = parseFloat(pos.x_multiplier || 1);
  const target  = parseFloat(pos.target_x2 || 0);
  const current = parseFloat(pos.current_price || pos.entry_price || 0);
  const entry   = parseFloat(pos.entry_price || 0);
  const pnl     = parseFloat(pos.pnl_usdt || 0);
  const progPct = entry > 0 && target > entry
    ? Math.min(100, ((current - entry) / (target - entry)) * 100) : 0;

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      <button className="w-full px-4 pt-3.5 pb-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">💎</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{pos.symbol}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">{pos.network}</span>
              <span className="text-[10px] text-gray-400 font-mono">SIM</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">${fmt(pos.size_usdt, 0)} · target ×2</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono font-medium text-yellow-600">{x.toFixed(2)}×</div>
            <div className="text-[11px] font-mono text-gray-400">{pnl >= 0 ? "+" : ""}{fmt(pnl)} USDT</div>
          </div>
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="mt-3">
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-green-400 transition-all duration-700"
              style={{ width: `${Math.max(2, progPct)}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] font-mono text-gray-400">
            <span>${fmtPrice(entry)}</span>
            <span>{progPct.toFixed(0)}% vers ×2</span>
            <span>${fmtPrice(target)}</span>
          </div>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
            Position simulée · Prix mis à jour toutes les heures via GeckoTerminal.
            À ×2 : récupère ${fmt(pos.size_usdt / 2, 0)} USDT et laisse courir le reliquat.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 10000);
  const { data: posData }   = useApi<PositionsData>("/api/positions", 10000);
  const { data: dexData }   = useApi<DexPortfolio>("/api/dex/positions", 60000);
  const { data: sentiment } = useApi<Sentiment>("/api/sentiment", 300000);

  const positions    = posData?.positions || [];
  const dexPositions = dexData?.positions || [];
  const regimeColor  = REGIME_COLORS[portfolio?.regime || ""] || "text-gray-400 border-gray-400";
  const pnlUp        = (portfolio?.pnl_usdt || 0) >= 0;
  const fg           = sentiment?.summary?.fear_greed_value;
  const dom          = sentiment?.summary?.btc_dominance_pct;
  const adx          = portfolio?.regime_data?.adx;
  const squeeze      = portfolio?.regime_data?.squeeze;

  if (!portfolio) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Connexion au moteur...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">SYNAPSE</h1>
            <p className="text-[11px] text-gray-400">Trading Intelligence</p>
          </div>
          <div className={`text-[11px] border px-2.5 py-1 rounded-lg font-mono ${regimeColor}`}>
            {portfolio.regime?.toUpperCase() || "—"}
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        {/* P&L Global + Capital */}
        <div>
          <div className={`text-3xl font-mono font-semibold ${pnlUp ? "text-green-600" : "text-red-500"}`}>
            {pnlUp ? "+" : ""}{fmt(portfolio.pnl_usdt)} USDT
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-[12px] font-mono">
            <span className={pnlUp ? "text-green-500" : "text-red-400"}>
              {pnlUp ? "+" : ""}{fmt(portfolio.pnl_pct)}%
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">${portfolio.total_value?.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} total</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">${portfolio.capital?.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} libre</span>
            {(portfolio.drawdown_pct || 0) > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-orange-400">DD {fmt(portfolio.drawdown_pct)}%</span>
              </>
            )}
          </div>
        </div>

        {/* Contexte marché */}
        {(fg != null || dom != null) && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Contexte marché</div>
            <div className="flex items-center gap-6">
              {fg != null && (
                <div>
                  <div className={`text-xl font-mono font-semibold ${
                    fg < 25 ? "text-red-500" : fg < 45 ? "text-orange-400" : fg > 75 ? "text-green-500" : "text-yellow-500"
                  }`}>{fg}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Fear & Greed</div>
                </div>
              )}
              {dom != null && (
                <div>
                  <div className="text-xl font-mono font-semibold text-gray-900">{fmt(dom, 1)}%</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">BTC Dom</div>
                </div>
              )}
              {adx != null && (
                <div>
                  <div className="text-xl font-mono font-semibold text-gray-900">{fmt(adx, 0)}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">ADX</div>
                </div>
              )}
              {squeeze != null && (
                <div>
                  <div className={`text-lg font-mono font-semibold ${squeeze ? "text-yellow-500" : "text-gray-300"}`}>
                    {squeeze ? "SQ" : "—"}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Squeeze</div>
                </div>
              )}
            </div>
            {squeeze && (
              <p className="text-[11px] text-yellow-500 mt-3 pt-3 border-t border-gray-100 font-mono">
                Squeeze actif — explosion de volatilité imminente
              </p>
            )}
            {fg != null && fg < 25 && (
              <p className="text-[11px] text-blue-400 mt-3 pt-3 border-t border-gray-100 font-mono">
                Peur extrême ({fg}) — moment historique d'accumulation
              </p>
            )}
          </div>
        )}

        {/* Positions CEX */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">Positions CEX</div>
            <div className="flex items-center gap-3">
              {(posData?.total_pnl || 0) !== 0 && (
                <span className={`text-sm font-mono ${(posData?.total_pnl||0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {(posData?.total_pnl||0) >= 0 ? "+" : ""}{fmt(posData?.total_pnl)} USDT
                </span>
              )}
              <span className="text-[11px] text-gray-400 font-mono">{positions.length} open</span>
            </div>
          </div>
          {positions.length === 0 ? (
            <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
              <p className="text-gray-400 text-sm">Aucune position ouverte</p>
              <p className="text-gray-300 text-xs mt-1 font-mono">
                {squeeze ? "Signal imminent (Squeeze actif)" : "En attente du prochain signal"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map(pos => <PositionCard key={pos.id} pos={pos} />)}
            </div>
          )}
        </div>

        {/* Positions DEX */}
        {dexPositions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                Pépites DEX <span className="text-yellow-500">· Simulation</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">${fmt(dexData?.total_invested, 0)} investi</span>
            </div>
            <div className="space-y-3">
              {dexPositions.map((pos, i) => <DexCard key={i} pos={pos} />)}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Capital libre",  value: `$${(portfolio.capital/1000).toFixed(1)}k` },
            { label: "Win Rate",       value: `${fmt(portfolio.win_rate, 0)}%`, sub: `${portfolio.total_trades} trades` },
            { label: "Drawdown",       value: `${fmt(portfolio.drawdown_pct)}%`, red: (portfolio.drawdown_pct||0) > 5 },
          ].map(s => (
            <div key={s.label} className="border border-gray-200 rounded-xl px-3 py-3 bg-white">
              <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
              <div className={`text-base font-mono font-medium ${s.red ? "text-red-500" : "text-gray-900"}`}>{s.value}</div>
              {s.sub && <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{s.sub}</div>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
