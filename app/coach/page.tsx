"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface Portfolio {
  total_value: number;
  pnl_usdt: number;
  regime: string;
  positions_count: number;
  win_rate: number;
  total_trades: number;
  drawdown_pct: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveConversations(convs: Conversation[]) {
  try { localStorage.setItem("synapse_conversations", JSON.stringify(convs)); } catch {}
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem("synapse_conversations");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function getContextualSuggestions(portfolio: Portfolio | null): { label: string; prompt: string }[] {
  if (!portfolio) return [
    { label: "Présente-toi", prompt: "Présente-toi et explique comment tu peux m'aider" },
    { label: "Comment ça marche ?", prompt: "Comment fonctionne le trading algorithmique ?" },
  ];

  const suggestions: { label: string; prompt: string }[] = [];
  const regime = portfolio.regime;
  const winRate = portfolio.win_rate;
  const drawdown = portfolio.drawdown_pct;
  const pnl = portfolio.pnl_usdt;
  const positions = portfolio.positions_count;

  // Suggestions basées sur le régime
  if (regime === "bull") {
    suggestions.push({
      label: "Optimiser pour le BULL",
      prompt: `Le marché est en BULL (RSI BTC élevé). Quelles stratégies dois-je privilégier et comment optimiser mes paramètres pour profiter au maximum de cette tendance haussière ?`
    });
  } else if (regime === "chop") {
    suggestions.push({
      label: "Survivre au CHOP",
      prompt: `Le marché est en CHOP — sans direction claire. Quelles stratégies résistent le mieux et comment ajuster mes paramètres pour limiter les pertes dans ce contexte ?`
    });
  } else if (regime === "bear") {
    suggestions.push({
      label: "Protéger en BEAR",
      prompt: `Le marché est en BEAR. Comment dois-je adapter ma stratégie pour protéger mon capital et éviter les pertes ? Faut-il tout désactiver ?`
    });
  }

  // Suggestion basée sur le win rate
  if (winRate < 30 && portfolio.total_trades > 5) {
    suggestions.push({
      label: `Win rate à ${winRate.toFixed(0)}% — pourquoi ?`,
      prompt: `Mon win rate est de ${winRate.toFixed(1)}% sur ${portfolio.total_trades} trades. Analyse mes résultats et dis-moi quelle est la cause principale : mauvaises stratégies, mauvais timing, ou contexte de marché défavorable ?`
    });
  } else if (winRate >= 50) {
    suggestions.push({
      label: "Capitaliser sur ma performance",
      prompt: `Mon win rate est de ${winRate.toFixed(1)}%. Comment puis-je capitaliser sur cette performance et l'améliorer encore ?`
    });
  }

  // Suggestion basée sur le drawdown
  if (drawdown > 5) {
    suggestions.push({
      label: `Drawdown ${drawdown.toFixed(1)}% — que faire ?`,
      prompt: `Mon drawdown est de ${drawdown.toFixed(1)}%. C'est préoccupant. Analyse la situation et dis-moi comment réduire ce drawdown et protéger mon capital restant.`
    });
  }

  // Suggestion basée sur les positions ouvertes
  if (positions > 0) {
    suggestions.push({
      label: `Analyser mes ${positions} positions`,
      prompt: `J'ai ${positions} positions ouvertes en ce moment. Analyse-les dans le contexte du régime ${regime.toUpperCase()} et dis-moi lesquelles ont le plus de chances de réussir.`
    });
  }

  // Suggestions toujours utiles
  suggestions.push({
    label: "Améliorer une stratégie",
    prompt: `En régime ${regime.toUpperCase()}, quelle est ma stratégie la moins performante et comment l'améliorer ou la désactiver temporairement ?`
  });

  if (pnl < 0) {
    suggestions.push({
      label: "Analyser mes pertes",
      prompt: `Mon P&L est de ${pnl.toFixed(2)} USDT. Analyse les causes de ces pertes et donne-moi un plan concret pour inverser la tendance.`
    });
  }

  return suggestions.slice(0, 4);
}

function CoachContent() {
  const searchParams = useSearchParams();
  const { data: portfolio } = useApi<Portfolio>("/api/portfolio", 30000);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeId);
  const messages = activeConv?.messages || [];
  const suggestions = getContextualSuggestions(portfolio);

  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);

    const symbol = searchParams.get("symbol");
    const pnl = searchParams.get("pnl");
    const strategy = searchParams.get("strategy");
    const context = searchParams.get("context");

    if (symbol) {
      const title = `${symbol.replace("USDT", "/USDT")} — ${context === "closed" ? "analyse clôture" : "position ouverte"}`;
      const contextMsg = context === "closed"
        ? `Analysons ensemble le trade fermé sur ${symbol}. P&L final : ${parseFloat(pnl || "0").toFixed(2)} USDT via ${strategy || "–"}. Explique-moi ce qui s'est passé et ce que je peux améliorer.`
        : `J'ai une position ouverte sur ${symbol} via ${strategy || "–"}, P&L actuel : ${parseFloat(pnl || "0").toFixed(2)} USDT. Donne-moi ton analyse et tes conseils.`;

      const newConv: Conversation = {
        id: generateId(),
        title,
        messages: [{ role: "user", content: contextMsg }],
        createdAt: new Date().toISOString(),
      };
      const updated = [newConv, ...convs];
      setConversations(updated);
      saveConversations(updated);
      setActiveId(newConv.id);
    }

    // Auto-connect depuis config
    fetch(`${API_URL}/api/config/coach/status`)
      .then(r => r.json())
      .then(d => {
        if (d.configured && d.api_key) {
          setApiKey(d.api_key);
          setProvider(d.provider || "openai");
          setModel(d.model || "gpt-4o-mini");
          setConnected(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const list = document.getElementById("coach-conv-list");
    if (!list) return;
    const filtered = searchQuery
      ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : conversations;
    list.innerHTML = filtered.map(c => `
      <div data-id="${c.id}" class="conv-item px-2 py-2 rounded-lg cursor-pointer mb-0.5 ${c.id === activeId ? "bg-[#1f1f1f]" : ""}">
        <div class="text-[11px] truncate" style="color: ${c.id === activeId ? "#fff" : "#aaa"}">${c.title}</div>
        <div class="text-[9px] mt-0.5" style="color: #444">${new Date(c.createdAt).toLocaleDateString("fr-FR")}</div>
      </div>
    `).join("");
    list.querySelectorAll(".conv-item").forEach(el => {
      el.addEventListener("click", () => setActiveId(el.getAttribute("data-id")));
    });
  }, [conversations, activeId, searchQuery]);

  useEffect(() => {
    const handleNew = () => newConversation();
    const handleSearch = (e: Event) => setSearchQuery((e as CustomEvent).detail);
    window.addEventListener("coach:new", handleNew);
    window.addEventListener("coach:search", handleSearch);
    return () => {
      window.removeEventListener("coach:new", handleNew);
      window.removeEventListener("coach:search", handleSearch);
    };
  }, [conversations]);

  function newConversation() {
    const conv: Conversation = {
      id: generateId(),
      title: "Nouvelle conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [conv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveId(conv.id);
  }

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content || loading || !connected) return;
    setInput("");

    const userMsg: Message = { role: "user", content };
    let currentConv = activeConv;

    if (!currentConv) {
      currentConv = {
        id: generateId(),
        title: content.slice(0, 45) + (content.length > 45 ? "..." : ""),
        messages: [],
        createdAt: new Date().toISOString(),
      };
    }

    const updatedMessages = [...currentConv.messages, userMsg];
    const updatedConv = {
      ...currentConv,
      messages: updatedMessages,
      title: currentConv.title === "Nouvelle conversation"
        ? content.slice(0, 45) + (content.length > 45 ? "..." : "")
        : currentConv.title,
    };

    const updatedConvs = conversations.map(c => c.id === updatedConv.id ? updatedConv : c);
    const finalConvs = updatedConvs.find(c => c.id === updatedConv.id)
      ? updatedConvs : [updatedConv, ...conversations];

    setConversations(finalConvs);
    saveConversations(finalConvs);
    setActiveId(updatedConv.id);
    setLoading(true);

    try {
      const context = portfolio ? `
Portfolio SYNAPSE :
- Valeur totale : ${portfolio.total_value.toFixed(2)} USDT
- P&L : ${portfolio.pnl_usdt.toFixed(2)} USDT
- Régime marché : ${portfolio.regime.toUpperCase()}
- Positions ouvertes : ${portfolio.positions_count}
- Win rate : ${portfolio.win_rate}%
- Drawdown : ${portfolio.drawdown_pct}%
- Trades fermés : ${portfolio.total_trades}` : "";

      const res = await fetch(`${API_URL}/api/coach/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          context,
          api_key: apiKey,
          provider,
          model,
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.response };
      const finalMessages = [...updatedMessages, assistantMsg];
      const finalConv = { ...updatedConv, messages: finalMessages };
      const finalList = finalConvs.map(c => c.id === finalConv.id ? finalConv : c);
      setConversations(finalList);
      saveConversations(finalList);
    } catch {
      const errorMsg: Message = { role: "assistant", content: "Erreur de connexion. Vérifiez votre clé API dans Config." };
      const finalMessages = [...updatedMessages, errorMsg];
      const finalConv = { ...updatedConv, messages: finalMessages };
      const finalList = finalConvs.map(c => c.id === finalConv.id ? finalConv : c);
      setConversations(finalList);
      saveConversations(finalList);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="text-sm font-semibold text-gray-900">Coach AI</div>
        <div className="flex items-center gap-2">
          {connected ? (
            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Connecté
            </div>
          ) : (
            <a href="/settings" className="text-[10px] text-orange-500 font-medium">
              Configurer la clé API →
            </a>
          )}
        </div>
      </div>

      {/* BRIEFING */}
      {portfolio && (
        <div className="mx-6 mt-3 bg-white rounded-xl border border-gray-200 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
          <div className="text-[11px] text-gray-600 flex-1">
            Régime <span className="font-bold text-gray-900">{portfolio.regime.toUpperCase()}</span>
            {" · "}{portfolio.positions_count} position{portfolio.positions_count > 1 ? "s" : ""}
            {" · "}Win rate <span className={`font-bold ${portfolio.win_rate >= 40 ? "text-green-600" : "text-red-600"}`}>{portfolio.win_rate}%</span>
            {" · "}<span className={`font-bold ${portfolio.pnl_usdt >= 0 ? "text-green-600" : "text-red-600"}`}>
              {portfolio.pnl_usdt >= 0 ? "+" : ""}{portfolio.pnl_usdt.toFixed(2)} USDT
            </span>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        {messages.length === 0 && (
          <div>
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3">AI</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Coach SYNAPSE</div>
              <div className="text-[11px] text-gray-400 mb-1">Je connais votre portfolio en temps réel</div>
              {!connected && (
                <a href="/settings" className="text-[11px] text-orange-500 underline">
                  Configurez votre clé API pour activer le Coach
                </a>
              )}
            </div>

            {/* Suggestions contextuelles */}
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.prompt)}
                  disabled={!connected}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="text-[11px] font-bold text-gray-900 mb-0.5">{s.label}</div>
                  <div className="text-[10px] text-gray-400 line-clamp-2">{s.prompt.slice(0, 60)}...</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 bg-[#111] rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-1">AI</div>
            )}
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-[#111] text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-[#111] rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">AI</div>
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <span className="text-[11px] text-gray-400">Le Coach réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="px-6 pb-4 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl flex items-center px-4 py-2.5 gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={connected ? "Posez votre question au Coach..." : "Configurez votre clé API dans Config"}
            disabled={!connected}
            className="flex-1 text-[12px] outline-none bg-transparent text-gray-700 placeholder-gray-300"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!connected || !input.trim() || loading}
            className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center disabled:opacity-30 flex-shrink-0 transition-opacity"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Chargement...</div>}>
      <CoachContent />
    </Suspense>
  );
}
