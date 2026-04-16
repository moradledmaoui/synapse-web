"use client";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../hooks/useApi";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

interface Portfolio {
  capital: number;
  pnl_usdt: number;
  pnl_pct: number;
  open_positions: number;
  win_rate: number;
  regime: string;
  drawdown_pct: number;
  latent_pnl: number;
}

const SUGGESTIONS = [
  "Comment se portent mes positions actuellement ?",
  "Quelle est ma stratégie la plus rentable ?",
  "Analyse mes derniers trades et dis-moi ce qui se passe",
  "Que recommandes-tu pour le régime actuel ?",
  "Quel est mon drawdown et comment le réduire ?",
  "Quels sont mes points forts et faiblesses en trading ?",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const { data: portfolio }     = useApi<Portfolio>("/api/portfolio", 15000);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        ts: Date.now(),
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Erreur : ${err.message}`,
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  const regimeColor: Record<string, string> = {
    trending_strong: "bg-green-100 text-green-800",
    trending_weak:   "bg-green-50 text-green-700",
    ranging:         "bg-yellow-50 text-yellow-700",
    breakout:        "bg-blue-50 text-blue-700",
    volatile:        "bg-orange-50 text-orange-700",
    bear:            "bg-red-50 text-red-700",
    panic:           "bg-red-100 text-red-900",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Coach SYNAPSE</div>
            <div className="text-[10px] text-gray-400">Données réelles · PostgreSQL temps réel</div>
          </div>
          {portfolio && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-xs font-mono font-medium ${(portfolio.pnl_usdt||0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {(portfolio.pnl_usdt||0) >= 0 ? "+" : ""}{(portfolio.pnl_usdt||0).toFixed(2)} USDT
                </div>
                <div className="text-[10px] text-gray-400">{portfolio.open_positions} positions</div>
              </div>
              {portfolio.regime && portfolio.regime !== "unknown" && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${regimeColor[portfolio.regime] || "bg-gray-100 text-gray-600"}`}>
                  {portfolio.regime.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context bar */}
      {portfolio && (
        <div className="bg-gray-900 px-6 py-2 flex gap-4 text-[10px] text-gray-400 overflow-x-auto whitespace-nowrap">
          <span>Capital: <span className="text-white font-mono">{(portfolio.capital||0).toFixed(0)} USDT</span></span>
          <span>·</span>
          <span>Win rate: <span className="text-white">{portfolio.win_rate||0}%</span></span>
          <span>·</span>
          <span>DD: <span className={(portfolio.drawdown_pct||0) > 5 ? "text-red-400" : "text-white"}>{(portfolio.drawdown_pct||0).toFixed(1)}%</span></span>
          <span>·</span>
          <span>Latent: <span className={`font-mono ${(portfolio.latent_pnl||0) >= 0 ? "text-green-400" : "text-red-400"}`}>{(portfolio.latent_pnl||0) >= 0 ? "+" : ""}{(portfolio.latent_pnl||0).toFixed(2)} USDT</span></span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">Coach SYNAPSE</div>
              <div className="text-[11px] text-gray-500 max-w-xs mx-auto">
                J'ai accès à toutes tes données en temps réel. Pose-moi n'importe quelle question sur tes trades, positions et performances.
              </div>
            </div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className="w-full text-left text-[11px] bg-white border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-white text-[9px] font-bold">S</span>
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-gray-900 text-white text-[12px]"
                : "bg-white border border-gray-200 text-gray-800 text-[12px]"
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <div className="text-[9px] mt-1 opacity-50">
                {new Date(msg.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-white text-[9px] font-bold">S</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
            placeholder="Pose une question sur tes trades, positions, performances..."
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-[12px] focus:outline-none focus:border-gray-400 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-gray-700 transition-colors flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="text-[9px] text-gray-400 mt-2 text-center">
          Données PostgreSQL · Mis à jour toutes les 15s
        </div>
      </div>
    </div>
  );
}
