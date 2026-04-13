"use client";
import { useApi } from "./hooks/useApi";

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
}

const REGIME_COLORS: Record<string, string> = {
  bull: "#4ade80",
  bear: "#f87171",
  chop: "#fbbf24",
  panic: "#f87171",
  unknown: "#6b7280",
};

const REGIME_BG: Record<string, string> = {
  bull: "#f0fdf4",
  bear: "#fef2f2",
  chop: "#fffbeb",
  panic: "#fef2f2",
  unknown: "#f5f5f5",
};

const REGIME_TEXT: Record<string, string> = {
  bull: "#15803d",
  bear: "#dc2626",
  chop: "#d97706",
  panic: "#dc2626",
  unknown: "#6b7280",
};

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
  const { data: posData } = useApi<Positions>("/api/positions", 10000);

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
        <div className="px-6 py-8 text-center text-gray-400 text-sm">
          Chargement des données...
        </div>
      </div>
    );
  }

  const pnlUp = portfolio.pnl_usdt >= 0;
  const pnlSign = pnlUp ? "+" : "";
  const positions = posData?.positions || [];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Dashboard</div>
        <div
          className="text-[10px] font-bold px-3 py-1 rounded-full border"
          style={{
            background: REGIME_BG[portfolio.regime] || "#f5f5f5",
            color: REGIME_TEXT[portfolio.regime] || "#888",
            borderColor: REGIME_TEXT[portfolio.regime] || "#e5e5e5",
          }}
        >
          {portfolio.regime.toUpperCase()}
        </div>
      </div>

      {/* KILL SWITCH */}
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
      <div className="bg-[#111] px-6 pb-5 grid grid-cols-3 gap-2">
        {[
          { label: "Positions", value: `${portfolio.positions_count}/${portfolio.max_positions}` },
          { label: "Win Rate", value: `${portfolio.win_rate}%` },
          { label: "Drawdown", value: `${portfolio.drawdown_pct}%` },
        ].map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] rounded-lg px-3 py-2.5">
            <div className="text-[9px] text-[#555] uppercase tracking-wide mb-1">{s.label}</div>
            <div className="font-mono text-sm font-bold text-[#e5e5e5]">{s.value}</div>
          </div>
        ))}
      </div>

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
                  <div className="px-5 pt-4 pb-3 flex justify-between items-start border-b border-gray-100">
                    <div>
                      <div className="font-mono text-sm font-bold text-gray-900">
                        {pos.symbol.replace("USDT", "/USDT")}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {pos.strategy.replace(/_/g, " ").toUpperCase()} · {formatDuration(pos.duration_minutes)}
                      </div>
                    </div>
                    <div className={`font-mono text-sm font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                      {sign}{pos.unrealized_pnl.toFixed(2)} USDT
                      <span className="text-[10px] opacity-60 ml-1">({sign}{pos.unrealized_pct.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-5 py-2 flex gap-1.5 border-b border-gray-100">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      pos.side === "BUY"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {pos.side === "BUY" ? "ACHAT" : "VENTE"}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {pos.strategy.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Prix */}
                  <div className="px-5 py-3 grid grid-cols-3 gap-2 border-b border-gray-100">
                    {[
                      { label: "Entrée", value: formatPrice(pos.entry_price), color: "text-gray-900" },
                      { label: "Prix actuel", value: formatPrice(pos.current_price), color: pos.current_price >= pos.entry_price ? "text-green-600" : "text-red-600" },
                      { label: "Taille", value: `${pos.size_usdt.toFixed(0)} USDT`, color: "text-gray-900" },
                    ].map((p) => (
                      <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">{p.label}</div>
                        <div className={`font-mono text-[11px] font-bold ${p.color}`}>{p.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress SL to TP */}
                  <div className="px-5 py-3 border-b border-gray-100">
                    <div className="flex justify-between text-[9px] mb-1.5">
                      <span className="text-red-500 font-medium">SL {formatPrice(pos.stop_loss)} (-{slDist.toFixed(1)}%)</span>
                      <span className="text-green-600 font-medium">TP {formatPrice(pos.take_profit)} (+{tpDist.toFixed(1)}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isUp ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Coach avis */}
                  {pos.coach_open?.why && (
                    <details className="group">
                      <summary className="px-5 py-2.5 flex items-center gap-2 cursor-pointer bg-gray-50 border-b border-gray-100 list-none">
                        <div className="w-4 h-4 bg-[#111] rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0">AI</div>
                        <span className="text-[10px] font-bold text-gray-900 flex-1">Pourquoi ce trade a été ouvert</span>
                        <span className="text-[9px] text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-5 py-3 bg-gray-50">
                        {pos.coach_open.probability && (
                          <div className="inline-block text-[9px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full mb-2">
                            Chances de succès : {pos.coach_open.probability}
                          </div>
                        )}
                        <p className="text-[11px] text-gray-600 leading-relaxed mb-2">{pos.coach_open.why}</p>
                        {pos.coach_open.risk_note && (
                          <p className="text-[10px] text-gray-400 mb-3">{pos.coach_open.risk_note}</p>
                        )}
                        <a
                          href={`/coach?symbol=${pos.symbol}&pnl=${pos.unrealized_pnl}&strategy=${pos.strategy}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#111] text-white px-3 py-1.5 rounded-lg no-underline"
                        >
                          Discuter avec le Coach
                        </a>
                      </div>
                    </details>
                  )}

                  {/* Clôturer */}
                  <div className="px-5 py-3 flex justify-end">
                    <button className="text-[10px] font-bold bg-[#111] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      Clôturer
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Total latent */}
            <div className={`text-right font-mono text-sm font-bold pb-2 ${
              positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              P&L latent total : {positions.reduce((s, p) => s + p.unrealized_pnl, 0) >= 0 ? "+" : ""}
              {positions.reduce((s, p) => s + p.unrealized_pnl, 0).toFixed(2)} USDT
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
