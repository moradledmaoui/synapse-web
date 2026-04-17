"use client";
import { useApi } from "../hooks/useApi";

const API = "";  // Proxy Next.js

interface Trade {
  id: number; symbol: string; side: string; strategy: string;
  entry_price: number; exit_price: number; size_usdt: number;
  pnl_usdt: number; pnl_pct: number; won: boolean;
  regime_at_open: string; close_reason: string;
  duration_minutes: number; opened_at: string; closed_at: string;
  opportunity_score: number;
}

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}

const STRAT: Record<string, string> = {
  mean_reversion: "Mean Rev", market_structure: "Mkt Struct",
  obv: "OBV", bollinger_squeeze: "BB Squeeze",
  momentum: "Momentum", rsi: "RSI", ema_crossover: "EMA Cross",
};

const CLOSE_REASON: Record<string, string> = {
  take_profit: "TP atteint",
  stop_loss: "SL touche",
  trailing_stop: "Trailing stop",
  manual: "Ferme manuellement",
  timeout: "Timeout",
};

function duration(minutes?: number): string {
  if (!minutes) return "--";
  if (minutes < 60) return minutes + "min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h + "h" + (m > 0 ? m + "m" : "");
}

function TradeRow({ trade }: { trade: Trade }) {
  const up = trade.won;
  const strat = STRAT[trade.strategy] || trade.strategy;
  const reason = CLOSE_REASON[trade.close_reason] || trade.close_reason || "--";
  const date = trade.closed_at
    ? new Date(trade.closed_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "--";

  return (
    <div className="border border-gray-200 bg-white rounded-xl px-4 py-3.5 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className={"w-1.5 h-10 rounded-full flex-shrink-0 " + (up ? "bg-green-400" : "bg-red-400")} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{trade.symbol.replace("USDT", "")}/USDT</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">{strat}</span>
            <span className="text-[10px] text-gray-400 font-mono">{trade.regime_at_open}</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
            {reason} · {duration(trade.duration_minutes)} · {date}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={"text-sm font-mono font-medium " + (up ? "text-green-600" : "text-red-500")}>
            {up ? "+" : ""}{fmt(trade.pnl_usdt)} USDT
          </div>
          <div className={"text-[11px] font-mono " + (up ? "text-green-500" : "text-red-400")}>
            {up ? "+" : ""}{fmt(trade.pnl_pct)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JournalPage() {
  const { data: rawTrades } = useApi<any>("/api/trades", 30000);

  const trades: Trade[] = Array.isArray(rawTrades)
    ? rawTrades
    : rawTrades?.trades || [];

  const wins   = trades.filter((t) => t.won);
  const losses = trades.filter((t) => !t.won);
  const totalPnl = trades.reduce((s, t) => s + (t.pnl_usdt || 0), 0);
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0;
  const avgWin  = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl_usdt, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.pnl_usdt, 0) / losses.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Journal</h1>
            <p className="text-[11px] text-gray-400">{trades.length} trades fermes</p>
          </div>
          <div className={"text-sm font-mono font-semibold " + (totalPnl >= 0 ? "text-green-600" : "text-red-500")}>
            {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)} USDT
          </div>
        </div>
      </div>

      <div className="px-6 pt-5 space-y-5">

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Win Rate</div>
            <div className="text-2xl font-mono font-semibold text-gray-900">{winRate}%</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{wins.length}W · {losses.length}L</div>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">P&L Total</div>
            <div className={"text-2xl font-mono font-semibold " + (totalPnl >= 0 ? "text-green-600" : "text-red-500")}>
              {totalPnl >= 0 ? "+" : ""}{fmt(totalPnl)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">USDT realise</div>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Gain moyen</div>
            <div className="text-xl font-mono font-semibold text-green-600">+{fmt(avgWin)}</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">USDT par win</div>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
            <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-1">Perte moyenne</div>
            <div className="text-xl font-mono font-semibold text-red-500">{fmt(avgLoss)}</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">USDT par loss</div>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Historique</div>
          {trades.length === 0 ? (
            <div className="border border-gray-200 rounded-xl p-8 text-center bg-white">
              <p className="text-gray-400 text-sm">Aucun trade ferme</p>
              <p className="text-gray-300 text-xs mt-1 font-mono">Les trades apparaitront ici apres fermeture</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trades.map((t) => <TradeRow key={t.id} trade={t} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
