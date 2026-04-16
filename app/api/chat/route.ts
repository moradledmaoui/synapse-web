import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const [portfolioRes, tradesRes, regimeRes, positionsRes] = await Promise.all([
      fetch(`${API_URL}/api/portfolio`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/trades?limit=50`).then(r => r.json()).catch(() => ({ trades: [] })),
      fetch(`${API_URL}/api/regime`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/positions`).then(r => r.json()).catch(() => ({ positions: [] })),
    ]);

    const portfolio = portfolioRes;
    const trades    = tradesRes.trades || [];
    const regime    = regimeRes.current || {};
    const positions = positionsRes.positions || [];

    const wins     = trades.filter((t: any) => t.won);
    const losses   = trades.filter((t: any) => !t.won);
    const totalPnl = trades.reduce((s: number, t: any) => s + (t.pnl_usdt || 0), 0);
    const winRate  = trades.length ? (wins.length / trades.length * 100).toFixed(1) : "N/A";
    const avgWin   = wins.length ? (wins.reduce((s: number, t: any) => s + t.pnl_pct, 0) / wins.length).toFixed(2) : "0";
    const avgLoss  = losses.length ? (losses.reduce((s: number, t: any) => s + t.pnl_pct, 0) / losses.length).toFixed(2) : "0";

    const byStrat: Record<string, any> = {};
    trades.forEach((t: any) => {
      const s = t.strategy || "unknown";
      if (!byStrat[s]) byStrat[s] = { wins: 0, total: 0, pnl: 0 };
      byStrat[s].total++;
      if (t.won) byStrat[s].wins++;
      byStrat[s].pnl += t.pnl_usdt || 0;
    });

    const stratEntries = Object.entries(byStrat).sort((a: any, b: any) => b[1].pnl - a[1].pnl);
    const bestStrat    = stratEntries[0];
    const worstStrat   = stratEntries[stratEntries.length - 1];

    const positionsDetail = positions.slice(0, 5).map((p: any) =>
      `${p.symbol} ${p.side} | Entrée: ${p.entry_price} | Prix: ${p.current_price} | P&L: ${p.pnl_pct?.toFixed(2)}% (${p.pnl_usdt?.toFixed(2)} USDT) | Stratégie: ${p.strategy}`
    ).join("\n");

    const systemPrompt = `Tu es le Coach SYNAPSE — assistant trading personnel expert.
Tu as accès en temps réel à toutes les données du portfolio de l'utilisateur.
Réponds en français. Sois précis, direct et basé sur les vraies données.
Ne fais jamais de recommandations génériques — utilise toujours les données réelles.

=== PORTFOLIO ACTUEL ===
Capital libre    : ${(portfolio.capital||0).toFixed(2)} USDT
Valeur totale    : ${(portfolio.total_value||0).toFixed(2)} USDT
P&L réalisé      : ${(portfolio.pnl_usdt||0).toFixed(2)} USDT (${(portfolio.pnl_pct||0).toFixed(2)}%)
P&L latent       : ${(portfolio.latent_pnl||0).toFixed(2)} USDT
Drawdown actuel  : ${(portfolio.drawdown_pct||0).toFixed(2)}%
Positions ouv.   : ${portfolio.open_positions || 0}
Win rate global  : ${winRate}% sur ${trades.length} trades

=== RÉGIME DE MARCHÉ ACTUEL ===
Régime           : ${regime.final_regime || "N/A"} (${regime.macro_regime || ""}/${regime.micro_regime || ""})
ADX              : ${regime.adx?.toFixed(1) || "N/A"}
ATR              : ${regime.atr_pct?.toFixed(2) || "N/A"}%
Squeeze          : ${regime.squeeze || false}
Confiance        : ${((regime.confidence || 0) * 100).toFixed(0)}%

=== PERFORMANCE TRADES ===
Total trades     : ${trades.length}
Gagnants         : ${wins.length} | Perdants : ${losses.length}
Win rate         : ${winRate}%
Gain moyen       : +${avgWin}%
Perte moyenne    : ${avgLoss}%
P&L total réalisé: ${totalPnl.toFixed(2)} USDT
${bestStrat ? `Meilleure strat  : ${bestStrat[0]} (${(bestStrat[1] as any).pnl.toFixed(2)} USDT)` : ""}
${worstStrat ? `Pire stratégie   : ${worstStrat[0]} (${(worstStrat[1] as any).pnl.toFixed(2)} USDT)` : ""}

=== POSITIONS OUVERTES (top 5) ===
${positionsDetail || "Aucune position ouverte"}

=== DERNIERS TRADES (5 derniers) ===
${trades.slice(0, 5).map((t: any) =>
  `${t.won ? "✅" : "❌"} ${t.symbol} | ${t.strategy} | ${t.pnl_pct?.toFixed(2)}% | ${t.regime_at_open} | ${t.close_reason}`
).join("\n") || "Aucun trade fermé"}

=== INSTRUCTIONS ===
- Analyse les données réelles pour répondre
- Identifie les patterns et anomalies dans les données
- Donne des recommandations concrètes et actionnables
- Mentionne toujours les données sur lesquelles tu bases ton analyse`;

    // Appel OpenAI GPT-4o
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Erreur de réponse";

    return NextResponse.json({ message: text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
