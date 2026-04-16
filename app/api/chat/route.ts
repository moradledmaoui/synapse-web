import { NextRequest, NextResponse } from "next/server";

const API_URL    = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

const MCP_TOOLS = [
  { type: "function", function: { name: "get_market_state", description: "État complet du marché : régime, sentiment, Fear&Greed, BTC dominance, squeeze.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "get_portfolio", description: "Portfolio complet : capital, P&L, positions, win rate, performance par stratégie.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "get_positions", description: "Positions ouvertes avec P&L actuel.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "get_trades", description: "Historique des trades.", parameters: { type: "object", properties: { limit: { type: "number" }, strategy: { type: "string" }, regime: { type: "string" } } } } },
  { type: "function", function: { name: "get_asset", description: "Fiche complète d'un asset : prix, change, funding, historique SYNAPSE.", parameters: { type: "object", required: ["symbol"], properties: { symbol: { type: "string" } } } } },
  { type: "function", function: { name: "get_universes", description: "Univers de trading actifs selon le régime.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "get_dex_pepites", description: "Pépites DEX multichain avec scores de sécurité.", parameters: { type: "object", properties: { tradable_only: { type: "boolean" } } } } },
  { type: "function", function: { name: "get_shadow_analysis", description: "Analyse des signaux rejetés — patterns et insights sur les filtres.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "get_strategy_doc", description: "Documentation d'une stratégie : logique, indicateurs, performance.", parameters: { type: "object", required: ["strategy_name"], properties: { strategy_name: { type: "string" } } } } },
  { type: "function", function: { name: "get_process_doc", description: "Documentation du processus SYNAPSE end-to-end.", parameters: { type: "object", properties: { process_name: { type: "string" } } } } },
  { type: "function", function: { name: "explain_signal", description: "Analyse le signal actuel sur un asset.", parameters: { type: "object", required: ["symbol"], properties: { symbol: { type: "string" } } } } },
  { type: "function", function: { name: "get_performance", description: "Performance détaillée sur N jours.", parameters: { type: "object", properties: { days: { type: "number" } } } } },
  { type: "function", function: { name: "get_exposure", description: "Exposition du portfolio par secteur.", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "update_parameter", description: "Modifie un paramètre SYNAPSE en temps réel. Demande confirmation avant d'agir.", parameters: { type: "object", required: ["category", "key", "value"], properties: { category: { type: "string" }, key: { type: "string" }, value: { type: "number" }, reason: { type: "string" } } } } },
  { type: "function", function: { name: "close_position", description: "Ferme une position. Demande confirmation avant d'agir.", parameters: { type: "object", required: ["symbol"], properties: { symbol: { type: "string" } } } } },
];

async function callMCPTool(toolName: string, args: any): Promise<any> {
  try {
    const params = new URLSearchParams();
    Object.entries(args || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.append(k, String(v));
    });
    const url = `${API_URL}/api/mcp/${toolName}${params.toString() ? "?" + params.toString() : ""}`;
    const r   = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { error: `MCP error ${r.status}` };
    return await r.json();
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `Tu es le Coach SYNAPSE — un expert trading qui parle comme un vrai trader, pas comme une documentation.

Tu as accès à des tools pour lire les données en temps réel. Utilise-les intelligemment.

TON STYLE :
- Direct et humain — comme un trader expérimenté qui parle à son associé
- Commence toujours par l'essentiel : "Tout va bien" / "Attention" / "Opportunité détectée"
- Donne ton opinion réelle : "Je pense que...", "À ta place je..."
- Identifie ce qui est important DANS LE CONTEXTE ACTUEL
- Ne liste jamais les données brutes — interprète-les

QUAND ON TE DEMANDE L'ÉTAT DES POSITIONS :
Ne liste pas les positions. Dis plutôt :
- La tendance globale (toutes en profit ? une qui inquiète ?)
- La position la plus intéressante et pourquoi
- Ce qu'il faut surveiller maintenant
- Ton avis sur les SL/TP par rapport au marché actuel

QUAND ON TE DEMANDE LE MARCHÉ :
Ne liste pas les indicateurs. Dis plutôt :
- Ce que le marché "fait" en ce moment (accumule, explose, chope...)
- Ce que ça signifie pour les prochaines heures
- L'opportunité ou le risque principal

QUAND TU VOIS QUELQUE CHOSE D'INTÉRESSANT :
- Signale-le proactivement : "Au fait, j'ai remarqué..."
- Donne une recommandation concrète

RÈGLES :
- Appelle get_market_state en premier pour le contexte
- Utilise explain_signal pour comprendre pourquoi un asset n'est pas tradé
- Demande toujours confirmation avant update_parameter ou close_position
- Maximum 150 mots par réponse sauf si analyse approfondie demandée
- Réponds en français`;

    let currentMessages: any[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    for (let turn = 0; turn < 5; turn++) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model:       "gpt-4o",
          max_tokens:  1500,
          messages:    currentMessages,
          tools:       MCP_TOOLS,
          tool_choice: "auto",
        }),
      });

      if (!response.ok) throw new Error(`OpenAI error ${response.status}`);

      const data    = await response.json();
      const message = data.choices[0].message;

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return NextResponse.json({ message: message.content });
      }

      currentMessages.push(message);

      const toolResults = await Promise.all(
        message.tool_calls.map(async (tc: any) => {
          const args   = JSON.parse(tc.function.arguments || "{}");
          const result = await callMCPTool(tc.function.name, args);
          return {
            role:         "tool" as const,
            tool_call_id: tc.id,
            content:      JSON.stringify(result),
          };
        })
      );

      currentMessages.push(...toolResults);
    }

    return NextResponse.json({ message: "Analyse complète effectuée." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
