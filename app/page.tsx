"use client";
import { useApi } from "./hooks/useApi";
import BottomNav from "./components/BottomNav";
import RegimeBadge from "./components/RegimeBadge";

interface Portfolio {
  total_value: number;
  capital_initial: number;
  pnl_usdt: number;
  pnl_pct: number;
  drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  regime: string;
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
}

interface Positions {
  positions: Position[];
  total: number;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function formatPrice(price: number): string {
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}

export default function Dashboard() {
  const { data: portfolio, loading: pLoading } = useApi<Portfolio>("/api/portfolio", 10000);
  const { data: posData, loading: posLoading, refetch } = useApi<Positions>("/api/positions", 10000);

  if (pLoading || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-black mb-2">⚡ SYNAPSE</div>
          <div className="text-sm text-gray-500">Connexion au moteur...</div>
        </div>
      </div>
    );
  }

  const pnlUp = portfolio.pnl_usdt >= 0;
  const pnlSign = pnlUp ? "+" : "";
  const positions = posData?.positions || [];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">

      {/* NAV */}
      <div className="bg-white border-b-2 border-black px-5 flex items-center justify-between h-13 py-3">
        <div className="font-mono text-sm font-bold text-black">
          ⚡ SYNAPSE <span className="text-gray-400 font-normal">Terminal</span>
        </div>
        <RegimeBadge regime={portfolio.regime} />
      </div>

      {/* KILL SWITCH */}
      {portfolio.kill_switch && (
        <div className="bg-red-600 text-white text-center py-2 text-sm font-bold">
          🛑 KILL SWITCH ACTIF — Trading suspendu
        </div>
      )}

      {/* HERO */}
      <div className="bg-black px-5 py-5">
        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Valeur du portfolio</div>
        <div className="font-mono text-3xl font-bold text-white leading-none">
          {portfolio.total_value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-base text-gray-500 ml-2">USDT</span>
        </div>
        <div className={`font-mono text-sm mt-1 ${pnlUp ? "text-green-400" : "text-red-400"}`}>
          {pnlSign}{portfolio.pnl_usdt.toFixed(2)} USDT · {pnlSign}{portfolio.pnl_pct.toFixed(3)}%
        </div>
      </div>

      {/* STATS */}
      <div className="bg-black px-5 pb-4 grid grid-cols-3 gap-2">
        {[
          { label: "Positions", value: `${portfolio.positions_count}/${portfolio.max_positions}` },
          { label: "Win Rate", value: `${portfolio.win_rate}%` },
          { label: "Drawdown", value: `${portfolio.drawdown_pct}%` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-lg px-3 py-2">
            <div className="text-[9px] text-gray-600 uppercase tracking-wide mb-1">{s.label}</div>
            <div className="font-mono text-sm font-bold text-gray-200">{s.value}</div>
          </div>
        ))}
      </div>

      {/* POSITIONS */}
      <div className="px-4 mt-3">
        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          Positions ouvertes
        </div>

        {positions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-2xl mb-2">📭</div>
            <div className="text-sm text-gray-400">Aucune position — le système analyse le marché</div>
          </div>
        ) : (
          <div className="space-y-3">
            {positions.map((pos) => {
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
                  <div className="px-4 pt-3 pb-2 flex justify-between items-start">
                    <div>
                      <div className="font-mono text-sm font-bold text-black">
                        {pos.symbol.replace("USDT", "/USDT")}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {pos.strategy.replace(/_/g, " ").toUpperCase()} · {formatDuration(pos.duration_minutes)}
                      </div>
                    </div>
                    <div className={`font-mono text-sm font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                      {sign}{pos.unrealized_pnl.toFixed(2)} USDT
                      <span className="text-[10px] opacity-70 ml-1">({sign}{pos.unrealized_pct.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-4 pb-2 flex gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${pos.side === "BUY" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {pos.side === "BUY" ? "ACHAT" : "VENTE"}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      {pos.strategy.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Prix */}
                  <div className="px-4 pb-2 grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Entrée", value: formatPrice(pos.entry_price) },
                      { label: "Prix actuel", value: formatPrice(pos.current_price), color: pos.current_price >= pos.entry_price ? "text-green-600" : "text-red-600" },
                      { label: "Taille", value: `${pos.size_usdt.toFixed(0)} USDT` },
                    ].map((p) => (
                      <div key={p.label} className="bg-gray-50 rounded-md px-2 py-1.5 border border-gray-100">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-0.5">{p.label}</div>
                        <div className={`font-mono text-[11px] font-bold ${p.color || "text-black"}`}>{p.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress SL → TP */}
                  <div className="px-4 pb-3">
                    <div className="flex justify-between text-[9px] mb-1">
                      <span className="text-red-500">SL {formatPrice(pos.stop_loss)} (-{slDist.toFixed(1)}%)</span>
                      <span className="text-green-600">TP {formatPrice(pos.take_profit)} (+{tpDist.toFixed(1)}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isUp ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Coach avis */}
                  {pos.coach_open && pos.coach_open.why && (
                    <details className="border-t border-gray-100">
                      <summary className="px-4 py-2 text-[10px] font-bold text-black cursor-pointer flex items-center gap-2">
                        <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white text-[7px] font-bold">AI</div>
                        Pourquoi ce trade a été ouvert
                      </summary>
                      <div className="px-4 pb-3 pt-1">
                        {pos.coach_open.probability && (
                          <div className="inline-block text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded mb-2">
                            Chances de succès : {pos.coach_open.probability}
                          </div>
                        )}
                        <p className="text-[11px] text-gray-600 leading-relaxed">{pos.coach_open.why}</p>
                        {pos.coach_open.risk_note && (
                          <p className="text-[10px] text-gray-400 mt-1">{pos.coach_open.risk_note}</p>
                        )}
                      </div>
                    </details>
                  )}

                  {/* Bouton clôture */}
                  <div className="border-t border-gray-100 px-4 py-2 flex justify-end">
                    <button className="text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded-md">
                      Clôturer
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Total latent */}
            <div className={`text-right font-mono text-sm font-bold ${positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
              P&L latent total : {positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "+" : ""}{positions.reduce((s, p) => s + p.unrealized_pnl, 0).toFixed(2)} USDT
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
