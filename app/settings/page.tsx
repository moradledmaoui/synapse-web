"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("risk");

  const [risk, setRisk] = useState({
    stop_loss: 2.0,
    take_profit: 4.0,
    max_positions: 8,
    allocation_pct: 10.0,
    max_drawdown: 15.0,
  });

  const [compliance, setCompliance] = useState({
    shariah: false,
    esg: false,
    mifid2: false,
  });

  const [coach, setCoach] = useState({
    provider: "openai",
    model: "gpt-4o-mini",
    api_key: "",
    auto_open_analysis: true,
    auto_close_analysis: true,
  });

  async function save() {
    try {
      await fetch(`${API_URL}/api/config/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ risk, compliance }),
      });
      if (coach.api_key) {
        await fetch(`${API_URL}/api/config/coach`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coach),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  }

  const SECTIONS = [
    { id: "risk", label: "Risque" },
    { id: "compliance", label: "Éthique" },
    { id: "coach", label: "Coach AI" },
    { id: "info", label: "Système" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm font-semibold text-gray-900">Config</div>
        <button
          onClick={save}
          className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-colors ${
            saved ? "bg-green-500 text-white" : "bg-[#111] text-white"
          }`}
        >
          {saved ? "Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>

      {/* SECTION TABS */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-1 overflow-x-auto">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`text-[11px] font-bold px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? "border-[#111] text-gray-900"
                : "border-transparent text-gray-400"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* RISQUE */}
        {activeSection === "risk" && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Gestion du risque</div>
            <div className="space-y-5">
              {[
                { label: "Stop Loss", key: "stop_loss", min: 0.5, max: 10, step: 0.5, suffix: "%", desc: "Perte maximale par trade avant fermeture automatique" },
                { label: "Take Profit", key: "take_profit", min: 1, max: 20, step: 0.5, suffix: "%", desc: "Gain cible par trade avant fermeture automatique" },
                { label: "Positions max", key: "max_positions", min: 1, max: 20, step: 1, suffix: "", desc: "Nombre maximum de trades ouverts simultanément" },
                { label: "Allocation par trade", key: "allocation_pct", min: 1, max: 50, step: 1, suffix: "%", desc: "Pourcentage du capital alloué à chaque trade" },
                { label: "Drawdown max", key: "max_drawdown", min: 5, max: 50, step: 1, suffix: "%", desc: "Perte totale maximale avant activation du Kill Switch" },
              ].map(({ label, key, min, max, step, suffix, desc }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <div className="text-[12px] font-medium text-gray-900">{label}</div>
                      <div className="text-[10px] text-gray-400">{desc}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-gray-900 ml-4">
                      {risk[key as keyof typeof risk]}{suffix}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={risk[key as keyof typeof risk]}
                    onChange={e => setRisk({ ...risk, [key]: parseFloat(e.target.value) })}
                    className="w-full accent-[#111] mt-1"
                  />
                  <div className="flex justify-between text-[9px] text-gray-300 mt-0.5">
                    <span>{min}{suffix}</span>
                    <span>{max}{suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLIANCE */}
        {activeSection === "compliance" && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Préférences éthiques</div>
              <div className="space-y-3">
                {[
                  {
                    key: "shariah",
                    label: "Conformité Shariah",
                    desc: "Exclut les assets et pratiques non conformes aux principes islamiques (AAOIFI). Pas de levier, pas de vente à découvert, exclusion des secteurs Haram.",
                  },
                  {
                    key: "esg",
                    label: "Critères ESG",
                    desc: "Favorise les blockchains durables et exclut les secteurs controversés (armes, surveillance, jeux, tabac).",
                  },
                  {
                    key: "mifid2",
                    label: "MiFID II — Union Européenne",
                    desc: "Applique les règles réglementaires européennes sur les marchés d'instruments financiers.",
                  },
                ].map(({ key, label, desc }) => {
                  const isActive = compliance[key as keyof typeof compliance];
                  return (
                    <div
                      key={key}
                      onClick={() => setCompliance({ ...compliance, [key]: !isActive })}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        isActive ? "bg-[#111] border-[#111]" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        isActive ? "bg-white border-white" : "border-gray-300"
                      }`}>
                        {isActive && (
                          <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                            <path d="M1 3.5l2 2 4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className={`text-[12px] font-bold mb-1 ${isActive ? "text-white" : "text-gray-900"}`}>{label}</div>
                        <div className={`text-[11px] leading-relaxed ${isActive ? "text-gray-400" : "text-gray-500"}`}>{desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* COACH */}
        {activeSection === "coach" && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Configuration Coach AI</div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1.5">Provider</div>
                    <select
                      value={coach.provider}
                      onChange={e => setCoach({ ...coach, provider: e.target.value })}
                      className="w-full text-[11px] border border-gray-200 rounded-lg px-3 py-2 outline-none bg-gray-50"
                    >
                      <option value="openai">OpenAI (GPT)</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="google">Google (Gemini)</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1.5">Modèle</div>
                    <select
                      value={coach.model}
                      onChange={e => setCoach({ ...coach, model: e.target.value })}
                      className="w-full text-[11px] border border-gray-200 rounded-lg px-3 py-2 outline-none bg-gray-50"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini</option>
                      <option value="gpt-4o">gpt-4o</option>
                      <option value="claude-3-5-haiku-20241022">claude-haiku</option>
                      <option value="gemini-pro">gemini-pro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 mb-1.5">Clé API</div>
                  <input
                    type="password"
                    value={coach.api_key}
                    onChange={e => setCoach({ ...coach, api_key: e.target.value })}
                    placeholder="sk-... — stockée de façon sécurisée"
                    className="w-full text-[11px] border border-gray-200 rounded-lg px-3 py-2 outline-none bg-gray-50"
                  />
                  <div className="text-[10px] text-gray-400 mt-1">
                    Obtenir une clé :
                    <a href="https://platform.openai.com" target="_blank" className="text-blue-500 ml-1">OpenAI</a>
                    {" · "}
                    <a href="https://console.anthropic.com" target="_blank" className="text-blue-500">Anthropic</a>
                    {" · "}
                    <a href="https://makersuite.google.com" target="_blank" className="text-blue-500">Google</a>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="text-[10px] font-bold text-gray-500 mb-2">Avis automatiques</div>
                  {[
                    { key: "auto_open_analysis", label: "Avis à l'ouverture de chaque trade" },
                    { key: "auto_close_analysis", label: "Avis à la clôture de chaque trade" },
                  ].map(({ key, label }) => {
                    const isOn = coach[key as keyof typeof coach] as boolean;
                    return (
                      <div
                        key={key}
                        onClick={() => setCoach({ ...coach, [key]: !isOn })}
                        className="flex items-center justify-between py-2 cursor-pointer"
                      >
                        <div className="text-[11px] text-gray-700">{label}</div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isOn ? "bg-[#111]" : "bg-gray-200"}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isOn ? "right-0.5" : "left-0.5"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTÈME */}
        {activeSection === "info" && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informations système</div>
            <div className="space-y-0">
              {[
                { label: "Version", value: "SYNAPSE v1.0 alpha" },
                { label: "Moteur", value: "Python · Hetzner Nuremberg" },
                { label: "Frontend", value: "Next.js · Vercel" },
                { label: "Stratégies", value: "10 stratégies actives" },
                { label: "Assets surveillés", value: "55 assets Binance" },
                { label: "Mode", value: "Paper trading" },
                { label: "Cycle moteur", value: "60 secondes" },
                { label: "Données", value: "Binance API publique" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                  <div className="text-[11px] text-gray-500">{label}</div>
                  <div className="text-[11px] font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  if (confirm("Remettre le portfolio à zéro ?")) {
                    fetch(`${API_URL}/api/portfolio/reset`, { method: "POST" });
                  }
                }}
                className="w-full text-[11px] font-bold text-red-600 border border-red-200 bg-red-50 py-2.5 rounded-lg hover:bg-red-100 transition-colors"
              >
                Remettre le portfolio à zéro
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
