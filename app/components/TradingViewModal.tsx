"use client";
import { useEffect, useRef } from "react";

interface Props {
  symbol: string;
  onClose: () => void;
}

export default function TradingViewModal({ symbol, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Ferme sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Charge le widget TradingView
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: "60",
      timezone: "Europe/Paris",
      theme: "dark",
      style: "1",
      locale: "fr",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget";
    container.style.height = "100%";
    container.style.width = "100%";

    ref.current.appendChild(container);
    ref.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col"
        style={{ width: "min(90vw, 900px)", height: "min(85vh, 600px)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm font-bold text-white">
              {symbol.replace("USDT", "/USDT")}
            </div>
            <div className="text-[10px] text-[#555] bg-[#111] px-2 py-0.5 rounded">
              1H · Binance
            </div>
          </div>
          <div className="flex items-center gap-3">
            
              <a
            
              href={`https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#555] hover:text-white transition-colors no-underline"
            >
              Ouvrir TradingView →
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-[#555] hover:text-white transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* Widget */}
        <div className="flex-1 relative">
          <div
            ref={ref}
            className="tradingview-widget-container"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
