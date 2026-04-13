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

const SUGGESTIONS = [
  "Que faire en CHOP ?",
  "Analyse mes pertes",
  "Optimiser mes seuils",
  "Réduire le risque",
];

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

  // Charge la clé API depuis le serveur au démarrage
  useEffect(() => {
    fetch(`${API_URL}/api/config/coach/status`)
      .then(r => r.json())
      .then(d => {
        if (d.configured) {
          setApiKey(d.api_key || "");
          setProvider(d.provider || "openai");
          setModel(d.model || "gpt-4o-mini");
          setConnected(true);
        }
      })
      .catch(() => {});
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeId);
  const messages = activeConv?.messages || [];

  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);

    // Contexte depuis Dashboard
    const symbol = searchParams.get("symbol");
    const pnl = searchParams.get("pnl");
    const strategy = searchParams.get("strategy");
    const context = searchParams.get("context");

    if (symbol) {
      const title = `${symbol.replace("USDT", "/USDT")} — ${context === "closed" ? "analyse clôture" : "position ouverte"}`;
      const contextMsg = context === "closed"
        ? `Je regarde le trade fermé sur ${symbol} — P&L : ${parseFloat(pnl || "0").toFixed(2)} USDT via ${strategy || "–"}.`
        : `Je regarde ma position ouverte sur ${symbol} — P&L actuel : ${parseFloat(pnl || "0").toFixed(2)} USDT via ${strategy || "–"}.`;

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
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync liste sidebar
  useEffect(() => {
    const list = document.getElementById("coach-conv-list");
    if (!list) return;
    const filtered = searchQuery
      ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : conversations;
    list.innerHTML = filtered.map(c => `
      <div
        data-id="${c.id}"
        class="conv-item px-2 py-2 rounded-lg cursor-pointer mb-0.5 ${c.id === activeId ? "bg-[#1f1f1f]" : "hover:bg-[#1a1a1a]"}"
      >
        <div class="text-[11px] text-${c.id === activeId ? "white" : "[#ccc]"} truncate">${c.title}</div>
        <div class="text-[9px] text-[#444] mt-0.5">${new Date(c.createdAt).toLocaleDateString("fr-FR")}</div>
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

  async function connect() {
    if (!apiKey) return;
    setConnected(true);
    try {
      await fetch(`${API_URL}/api/config/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, provider, model }),
      });
    } catch {}
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
        title: content.slice(0, 40),
        messages: [],
        createdAt: new Date().toISOString(),
      };
    }

    const updatedMessages = [...currentConv.messages, userMsg];
    const updatedConv = {
      ...currentConv,
      messages: updatedMessages,
      title: currentConv.title === "Nouvelle conversation" ? content.slice(0, 40) : currentConv.title,
    };

    const updatedConvs = conversations.map(c => c.id === updatedConv.id ? updatedConv : c);
    const finalConvs = updatedConvs.find(c => c.id === updatedConv.id)
      ? updatedConvs
      : [updatedConv, ...conversations];

    setConversations(finalConvs);
    saveConversations(finalConvs);
    setActiveId(updatedConv.id);
    setLoading(true);

    try {
      const context = portfolio
        ? `Portfolio: ${portfolio.total_value.toFixed(2)} USDT, P&L: ${portfolio.pnl_usdt.toFixed(2)} USDT, Régime: ${portfolio.regime}, Positions: ${portfolio.positions_count}, Win rate: ${portfolio.win_rate}%`
        : "";

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
      const errorMsg: Message = { role: "assistant", content: "Erreur de connexion. Vérifiez votre clé API." };
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
        {activeConv && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-gray-600 max-w-[200px] truncate">{activeConv.title}</span>
          </div>
        )}
      </div>



      {/* BRIEFING */}
      {connected && portfolio && (
        <div className="mx-6 mt-3 bg-white rounded-xl border border-gray-200 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
          <div className="text-[11px] text-gray-600">
            Régime <span className="font-bold text-gray-900">{portfolio.regime.toUpperCase()}</span>
            {" · "}{portfolio.positions_count} positions
            {" · "}{portfolio.win_rate}% win rate
            {" · "}<span className={portfolio.pnl_usdt >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {portfolio.pnl_usdt >= 0 ? "+" : ""}{portfolio.pnl_usdt.toFixed(2)} USDT
            </span>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && connected && (
          <div>
            <div className="text-center py-8">
              <div className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3">AI</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Coach SYNAPSE</div>
              <div className="text-[11px] text-gray-400">Je connais votre portfolio en temps réel</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-medium text-gray-700 text-left hover:bg-gray-50 transition-colors">
                  {s}
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
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
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
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-sm text-[12px] text-gray-400">
              Le Coach réfléchit...
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
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={connected ? "Posez votre question..." : "Configurez votre clé API pour activer le Coach"}
            disabled={!connected}
            className="flex-1 text-[12px] outline-none bg-transparent text-gray-700 placeholder-gray-300"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!connected || !input.trim() || loading}
            className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center disabled:opacity-30 flex-shrink-0"
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
