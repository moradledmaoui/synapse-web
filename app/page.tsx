"use client";
import { useState } from "react";
import { useApi } from "./hooks/useApi";
import TradingViewModal from "./components/TradingViewModal";

interface Portfolio {
  total_value: number;
  capital_initial: number;
  pnl_usdt: number;
  pnl_pct: number;
  drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  regime: string;
  regime_data: {
    regime: string;
    micro_regime?: string;
    btc_rsi_1h: number;
    btc_change_14d_pct: number;
    btc_atr_pct: number;
    adx?: number;
    bb_squeeze?: boolean;
    confidence?: number;
  };
  positions_count: number;
  max_positions: number;
  kill_switch: boolean;
}

interface Position {
  symbol: string;
  side: string;
  entry_price: number;
  current_price: number;
  size_usdt: number;
  stop_loss: number;
  take_profit: number;
  strategy: string;
  duration_minutes: number;
  unrealized_pnl: number;
  unrealized_pct: number;
  coach_open: Record<string, string>;
  regime_at_open?: string;
  micro_regime_at_open?: string;
  atr_at_open?: number;
}

interface Positions { positions: Position[]; }

const REGIME_BG: Record<string, string> = {
  bull: "#f0fdf4", bear: "#fef2f2", chop: "#fffbeb", panic: "#fef2f2", unknown: "#f5f5f5",
};
const REGIME_TEXT: Record<string, string> = {
  bull: "#15803d", bear: "#dc2626", chop: "#d97706", panic: "#dc2626", unknown: "#6b7280",
};
const MICRO_COLORS: Record<string, string> = {
  trending: "#2563eb", ranging: "#d97706", volatile: "#dc2626", breakout: "#7c3aed",
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  return `${Math.floor(minutes / 60)}h ${(minutes % 60).toString().padStart(2, "0")}min`;
}

function formatPrice(price: number): string {
  if (price < 0.0001) return price.toFixed(8);
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

export default function Dashboard() {
  const { data: portfolio, loading: pLoading } = useApi<Portfolio>("/api/portfolio", 10000);
  const { data: posData } = useApi<Positions>("/api/positions", 10000);
  const [tvSymbol, setTvSymbol] = useState<string | null>(null);
  const [closeConfirm, setCloseConfirm] = useState<string | null>(null);

  if (pLoading || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="text-sm font-semibold text-gray-900">Dashboard</div>
        </div>
        <div className="bg-[#111] px-6 py-6">
          <div className="text-[9px] text-[#555] uppercase tracking-widest mb-2">Valeur du portfolio</div>
          <div className="font-mono text-4xl font-bold text-[#333] leading-none mb-2">—</div>
          <div className="text-sm text-[#444]">Connexion au moteur...</div>
        </div>
        <div className="bg-[#111] px-6 pb-5 grid grid-cols-3 gap-2">
          {["Positions", "Win Rate", "Drawdown"].map(l => (
            <div key={l} className="bg-[#1a1a1a] rounded-lg px-3 py-2.5">
              <div className="text-[9px] text-[#555] uppercase tracking-wide mb-1">{l}</div>
              <div className="font-mono text-sm font-bold text-[#333]">—</div>
            </div>
          ))}
        </div>
        <div className="px-6 py-8 text-center text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  const pnlUp = portfolio.pnl_usdt >= 0;
  const pnlSign = pnlUp ? "+" : "";
  const positions = posData?.positions || [];
  const microRegime = portfolio.regime_data?.micro_regime;
  const confidence = portfolio.regime_data?.confidence;
  const adx = portfolio.regime_data?.adx;
  const squeeze = portfolio.regime_data?.bb_squeeze;

  return (
    <>
      {tvSymbol && <TradingViewModal symbol={tvSymbol} onClose={() => setTvSymbol(null)} />}
      <div className="min-h-screen bg-gray-100">

        {/* TOPBAR */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm font-semibold text-gray-900">Dashboard</div>
          <div className="flex items-center gap-2">
            {/* Macro régime */}
            <div className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
              style={{ background: REGIME_BG[portfolio.regime], color: REGIME_TEXT[portfolio.regime], borderColor: REGIME_TEXT[portfolio.regime] }}>
              {portfolio.regime.toUpperCase()}
            </div>
            {/* Micro régime */}
            {microRegime && (
              <div className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-current"
                style={{ color: MICRO_COLORS[microRegime] || "#888", background: "#f8f8f8" }}>
                {microRegime.toUpperCase()}
              </div>
            )}
            {/* Squeeze */}
            {squeeze && (
              <div className="text-[9px] font-bold px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                SQUEEZE 🔥
              </div>
            )}
          </div>
        </div>

        {portfolio.kill_switch && (
          <div className="bg-red-600 text-white text-center py-2 text-sm font-bold">
            KILL SWITCH ACTIF — Trading suspendu
          </div>
        )}

        {/* HERO */}
        <div className="bg-[#111] px-6 py-6">
          <div className="text-[9px] text-[#555] uppercase tracking-widest mb-2">Valeur du portfolio</div>
          <div className="font-mono text-4xl font-bold text-white leading-none mb-2">
            {portfolio.total_value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-lg text-[#444] ml-2">USDT</span>
          </div>
          <div className={`font-mono text-sm ${pnlUp ? "text-green-400" : "text-red-400"}`}>
            {pnlSign}{portfolio.pnl_usdt.toFixed(2)} USDT · {pnlSign}{portfolio.pnl_pct.toFixed(3)}%
          </div>
        </div>

        {/* STATS */}
        <div className="bg-[#111] px-6 pb-4 grid grid-cols-4 gap-2">
          {[
            { label: "Positions", value: `${portfolio.positions_count}/${portfolio.max_positions}` },
            { label: "Win Rate", value: `${portfolio.win_rate}%` },
            { label: "Drawdown", value: `${portfolio.drawdown_pct}%` },
            { label: "ADX", value: adx ? `${adx.toFixed(0)}` : "—" },
          ].map(s => (
            <div key={s.label} className="bg-[#1a1a1a] rounded-lg px-3 py-2.5">
              <div className="text-[9px] text-[#555] uppercase tracking-wide mb-1">{s.label}</div>
              <div className="font-mono text-sm font-bold text-[#e5e5e5]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Confiance + contexte */}
        {confidence && (
          <div className="bg-[#111] px-6 pb-5">
            <div className="bg-[#1a1a1a] rounded-lg px-4 py-2.5 flex items-center gap-3">
              <div className="text-[9px] text-[#555] uppercase">Confiance détection</div>
              <div className="flex-1 h-1.5 bg-[#333] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${confidence * 100}%` }} />
              </div>
              <div className="font-mono text-[11px] font-bold text-green-400">{(confidence * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}

        {/* Indicateur confiance si peu de trades */}
        {portfolio.total_trades < 100 && (
          <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="text-[11px] font-medium text-amber-800 mb-1">Statistiques en cours de constitution</div>
            <div className="text-[10px] text-amber-700 mb-2">{portfolio.total_trades}/100 trades — les métriques seront fiables à 100 trades</div>
            <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{width: `${Math.min(portfolio.total_trades, 100)}%`}}></div>
            </div>
          </div>
        )}

        {/* POSITIONS */}
        <div className="px-6 py-4">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Positions ouvertes
          </div>

          {positions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="text-gray-300 text-3xl mb-3">○</div>
              <div className="text-sm text-gray-400">Aucune position — le système analyse le marché</div>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map(pos => {
                const isUp = pos.unrealized_pnl >= 0;
                const sign = isUp ? "+" : "";
                const slDist = Math.abs((pos.current_price - pos.stop_loss) / pos.current_price * 100);
                const tpDist = Math.abs((pos.take_profit - pos.current_price) / pos.current_price * 100);
                const totalRange = pos.take_profit - pos.stop_loss;
                const progress = totalRange !== 0
                  ? Math.max(0, Math.min(100, (pos.current_price - pos.stop_loss) / totalRange * 100))
                  : 50;

                return (
                  <div key={pos.symbol} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-3 flex justify-between items-start border-b border-gray-100">
                      <div>
                        <div className="font-mono text-sm font-bold text-gray-900">
                          {pos.symbol.replace("USDT", "/USDT")}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                          {pos.strategy.replace(/_/g, " ").toUpperCase()} · {formatDuration(pos.duration_minutes)}
                          {pos.micro_regime_at_open && (
                            <span className="font-bold" style={{ color: MICRO_COLORS[pos.micro_regime_at_open] || "#888" }}>
                              · {pos.micro_regime_at_open.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`font-mono text-sm font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                        {sign}{pos.unrealized_pnl.toFixed(2)} USDT
                        <span className="text-[10px] opacity-60 ml-1">({sign}{pos.unrealized_pct.toFixed(2)}%)</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="px-5 py-2 flex gap-1.5 border-b border-gray-100 flex-wrap">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${pos.side === "BUY" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {pos.side === "BUY" ? "ACHAT" : "VENTE"}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {pos.strategy.replace(/_/g, " ").toUpperCase()}
                      </span>
                      {pos.atr_at_open && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                          ATR {(pos.atr_at_open / pos.entry_price * 100).toFixed(2)}%
                        </span>
                      )}
                    </div>

                    {/* Prix */}
                    <div className="px-5 py-3 grid grid-cols-3 gap-2 border-b border-gray-100">
                      {[
                        { label: "Entrée", value: formatPrice(pos.entry_price), color: "text-gray-900" },
                        { label: "Prix actuel", value: formatPrice(pos.current_price), color: pos.current_price >= pos.entry_price ? "text-green-600" : "text-red-600" },
                        { label: "Taille", value: `${pos.size_usdt.toFixed(0)} USDT`, color: "text-gray-900" },
                      ].map(p => (
                        <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                          <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{p.label}</div>
                          <div className={`font-mono text-[11px] font-bold ${p.color}`}>{p.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* SL → TP */}
                    <div className="px-5 py-3 border-b border-gray-100">
                      <div className="flex justify-between text-[9px] mb-1.5">
                        <span className="text-red-500 font-medium">SL {formatPrice(pos.stop_loss)} (-{slDist.toFixed(1)}%)</span>
                        <span className="text-green-600 font-medium">TP {formatPrice(pos.take_profit)} (+{tpDist.toFixed(1)}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isUp ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* Coach */}
                    {pos.coach_open?.why && (
                      <details className="group">
                        <summary className="px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gray-50 border-b border-gray-100 list-none">
                          <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">AI</div>
                          <span className="text-[10px] font-bold text-gray-900 flex-1">Pourquoi ce trade a été ouvert</span>
                          <span className="text-[9px] text-gray-400">▼</span>
                        </summary>
                        <div className="px-5 py-3 bg-gray-50">
                          {pos.coach_open.probability && (
                            <div className="inline-block text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full mb-2">
                              Chances : {pos.coach_open.probability}
                            </div>
                          )}
                          <p className="text-[11px] text-gray-600 leading-relaxed mb-2">{pos.coach_open.why}</p>
                          {pos.coach_open.risk_note && (
                            <p className="text-[10px] text-gray-400 mb-3">{pos.coach_open.risk_note}</p>
                          )}
                          <a href={`/coach?symbol=${pos.symbol}&pnl=${pos.unrealized_pnl}&strategy=${pos.strategy}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#111] text-white px-3 py-1.5 rounded-lg no-underline">
                            Discuter avec le Coach
                          </a>
                        </div>
                      </details>
                    )}

                    {/* Actions */}
                    <div className="px-5 py-3 flex justify-between items-center">
                      <button onClick={() => setTvSymbol(pos.symbol)}
                        className="text-[10px] font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 7 L3 4 L5 5.5 L7 2.5 L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Graphique
                      </button>
                      {closeConfirm === pos.symbol ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] text-gray-500">Confirmer ?</span>
                          <button onClick={async () => {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000"}/api/positions/${pos.symbol}/close`, { method: "POST" });
                            setCloseConfirm(null);
                          }} className="text-[10px] font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg">Oui</button>
                          <button onClick={() => setCloseConfirm(null)}
                            className="text-[10px] font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setCloseConfirm(pos.symbol)}
                          className="text-[10px] font-bold bg-[#111] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                          Clôturer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className={`text-right font-mono text-sm font-bold pb-2 ${positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                P&L latent : {positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "+" : ""}
                {positions.reduce((s, p) => s + p.unrealized_pnl, 0).toFixed(2)} USDT
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
