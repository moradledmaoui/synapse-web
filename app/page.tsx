"use client";
import { useApi } from "./hooks/useApi";

interface Portfolio {
  capital: number;
  capital_initial: number;
  total_value: number;
  pnl_usdt: number;
  pnl_pct: number;
  peak_capital: number;
  drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  open_positions: number;
  latent_pnl: number;
  kill_switch: boolean;
  regime: string;
  regime_data: any;
}

interface Position {
  id: number;
  symbol: string;
  side: string;
  entry_price: number;
  current_price: number;
  size_usdt: number;
  pnl_usdt: number;
  pnl_pct: number;
  strategy: string;
  opportunity_score: number;
  regime_at_open: string;
  opened_at: string;
  stop_loss: number;
  take_profit: number;
}

interface PositionsData { positions: Position[]; total_pnl: number; }

function fmt(n: number | undefined, decimals = 2): string {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return n.toFixed(decimals);
}

function fmtPrice(p: number | undefined): string {
  if (!p) return "—";
  if (p < 0.0001) return p.toFixed(8);
  if (p < 0.01) return p.toFixed(6);
  if (p < 1) return p.toFixed(4);
  return p.toFixed(2);
}

const REGIME_COLORS: Record<string, string> = {
  trending_strong: "text-green-400 border-green-400",
  trending_weak:   "text-green-300 border-green-300",
  ranging:         "text-yellow-400 border-yellow-400",
  breakout:        "text-blue-400 border-blue-400",
  volatile:        "text-orange-400 border-orange-400",
  bear:            "text-red-400 border-red-400",
  panic:           "text-red-600 border-red-600",
};

export default function DashboardPage() {
  const { data: portfolio, loading: pLoading } = useApi<Portfolio>("/api/portfolio", 10000);
  const { data: posData } = useApi<PositionsData>("/api/positions", 10000);

  const positions = posData?.positions || [];
  const regimeColor = REGIME_COLORS[portfolio?.regime || ""] || "text-gray-400 border-gray-400";
  const pnlUp = (portfolio?.pnl_usdt || 0) >= 0;
  const adx = portfolio?.regime_data?.adx;
  const confidence = portfolio?.regime_data?.confidence || 0;

  if (pLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-gray-500 text-sm">Connexion au moteur...</div>
    </div>
  );

  if (!portfolio) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-red-400 text-sm">API non disponible</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-6 pb-24">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Portfolio</div>
          <div className={`font-mono text-3xl font-medium ${pnlUp ? "text-green-400" : "text-red-400"}`}>
            {pnlUp ? "+" : ""}{fmt(portfolio.pnl_usdt)} USDT
          </div>
          <div className={`text-sm mt-1 ${pnlUp ? "text-green-500" : "text-red-500"}`}>
            {pnlUp ? "+" : ""}{fmt(portfolio.pnl_pct)}% · {fmt(portfolio.total_value)} USDT total
          </div>
        </div>
        <div className={`border rounded-lg px-3 py-1.5 text-[11px] font-bold ${regimeColor}`}>
          {(portfolio.regime || "—").toUpperCase()}
        </div>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Capital libre", value: `${fmt(portfolio.capital, 0)} USDT` },
          { label: "P&L latent", value: `${(portfolio.latent_pnl||0) >= 0 ? "+" : ""}${fmt(portfolio.latent_pnl)} USDT`, color: (portfolio.latent_pnl||0) >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Positions", value: `${portfolio.open_positions}` },
          { label: "Win rate", value: `${fmt(portfolio.win_rate, 1)}%` },
          { label: "Drawdown", value: `${fmt(portfolio.drawdown_pct)}%`, color: (portfolio.drawdown_pct||0) > 5 ? "text-red-400" : "text-gray-300" },
          { label: "ADX", value: adx ? `${fmt(adx, 0)}` : "—" },
          { label: "Trades fermés", value: `${portfolio.total_trades}` },
          { label: "Confiance", value: `${fmt(confidence * 100, 0)}%` },
        ].map(m => (
          <div key={m.label} className="bg-[#141414] border border-[#222] rounded-xl px-4 py-3">
            <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{m.label}</div>
            <div className={`font-mono text-base font-medium ${m.color || "text-white"}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Positions */}
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Positions ouvertes</div>
      {positions.length === 0 ? (
        <div className="bg-[#141414] border border-[#222] rounded-xl px-4 py-8 text-center text-gray-500 text-sm">
          Aucune position ouverte
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map(pos => {
            const pnlUp = (pos.pnl_pct || 0) >= 0;
            return (
              <div key={pos.id} className="bg-[#141414] border border-[#222] rounded-xl px-4 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-mono text-sm font-medium">
                      {pos.symbol.replace("USDT", "/USDT")}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {(pos.strategy || "").replace(/_/g, " ").toUpperCase()} · {pos.regime_at_open?.toUpperCase()}
                    </div>
                  </div>
                  <div className={`font-mono text-sm font-medium ${pnlUp ? "text-green-400" : "text-red-400"}`}>
                    {pnlUp ? "+" : ""}{fmt(pos.pnl_usdt)} USDT
                    <span className="text-[10px] opacity-60 ml-1">({pnlUp ? "+" : ""}{fmt(pos.pnl_pct)}%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "Entrée", value: fmtPrice(pos.entry_price) },
                    { label: "Actuel", value: fmtPrice(pos.current_price), color: pnlUp ? "text-green-400" : "text-red-400" },
                    { label: "Taille", value: `${fmt(pos.size_usdt, 0)} USDT` },
                  ].map(f => (
                    <div key={f.label} className="bg-[#1a1a1a] rounded-lg px-2.5 py-2">
                      <div className="text-[9px] text-gray-500 uppercase mb-0.5">{f.label}</div>
                      <div className={`font-mono text-[11px] font-medium ${f.color || "text-white"}`}>{f.value}</div>
                    </div>
                  ))}
                </div>

                {/* SL/TP bar */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-red-400">SL {fmtPrice(pos.stop_loss)}</span>
                  <span className="text-gray-500">Score {fmt(pos.opportunity_score, 0)}/100</span>
                  <span className="text-green-400">TP {fmtPrice(pos.take_profit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* P&L latent total */}
      {positions.length > 0 && (
        <div className={`mt-4 text-center font-mono text-sm font-medium ${(posData?.total_pnl||0) >= 0 ? "text-green-400" : "text-red-400"}`}>
          P&L latent total : {(posData?.total_pnl||0) >= 0 ? "+" : ""}{fmt(posData?.total_pnl)} USDT
        </div>
      )}
    </div>
  );
}
