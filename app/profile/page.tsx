"use client";
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

const API = "";  // Proxy Next.js — pas besoin de l URL complète

function fmt(n?: number, d = 2): string {
  if (n == null || isNaN(n)) return "--";
  return n.toFixed(d);
}

function Avatar({ initials, size = "lg" }: { initials: string; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-16 h-16 text-xl" : "w-8 h-8 text-sm";
  return (
    <div className={"rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold flex-shrink-0 " + sz}>
      {(initials || "TR").slice(0, 2).toUpperCase()}
    </div>
  );
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={"relative w-11 h-6 rounded-full transition-colors " + (disabled ? "opacity-40 cursor-not-allowed " : "cursor-pointer ") + (enabled ? "bg-green-500" : "bg-gray-200")}
    >
      <div className={"absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform " + (enabled ? "translate-x-5" : "")} />
    </button>
  );
}

function ChecklistItem({ item }: { item: any }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className={"w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 " + (item.ok ? "bg-green-100" : "bg-gray-100")}>
          {item.ok
            ? <svg className="w-3 h-3 text-green-600" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <svg className="w-3 h-3 text-gray-400" viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }
        </div>
        <span className={"text-[13px] " + (item.ok ? "text-gray-900" : "text-gray-500")}>{item.label}</span>
      </div>
      <span className={"text-[11px] font-mono " + (item.ok ? "text-green-600" : "text-gray-400")}>
        {typeof item.value === "boolean" ? (item.value ? "OK" : "--") : item.value}
        {typeof item.required === "number" && !item.ok && <span className="text-gray-300"> / {item.required}</span>}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{title}</div>
      </div>
      <div className="px-4 py-3 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-gray-600">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile, refetch: refresh } = useApi<any>("/api/profile", 0);
  const [saving, setSaving]        = useState(false);
  const [testing, setTesting]      = useState(false);
  const [msg, setMsg]              = useState("");
  const [apiKey, setApiKey]        = useState("");
  const [apiSecret, setApiSecret]  = useState("");
  const [name, setName]            = useState("");
  const [telegram, setTelegram]    = useState("");
  const [chatId, setChatId]        = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setTelegram(profile.telegram_token || "");
      setChatId(profile.telegram_chat_id || "");
    }
  }, [profile]);

  async function save(data: any) {
    setSaving(true);
    setMsg("");
    try {
      const r = await fetch(API + "/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      setMsg(d.success ? "Sauvegarde OK" : "Erreur");
      if (d.success && refresh) refresh();
    } catch { setMsg("Erreur reseau"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function testBinance() {
    setTesting(true);
    setMsg("");
    await save({ binance_api_key: apiKey, binance_api_secret: apiSecret });
    try {
      const r = await fetch(API + "/api/profile/test-binance", { method: "POST" });
      const d = await r.json();
      setMsg(d.success ? "Connexion OK - Solde $" + (d.usdt_balance || 0).toFixed(0) : "Erreur: " + d.error);
      if (d.success && refresh) refresh();
    } catch { setMsg("Erreur reseau"); }
    setTesting(false);
  }

  async function toggleLive(enable: boolean) {
    if (enable && !profile?.live_ready) {
      setMsg("Checklist incomplete - validez tous les criteres d abord");
      setTimeout(() => setMsg(""), 4000);
      return;
    }
    if (enable && !confirm("Passer en mode LIVE ? Les vrais ordres seront envoyes a Binance.")) return;
    await save({ trading_mode: enable ? "live" : "simulation" });
  }

  async function toggleStrategy(key: string, val: boolean) {
    const current = profile?.strategies_enabled || {};
    await save({ strategies_enabled: { ...current, [key]: val } });
  }

  async function toggleAlert(key: string, val: boolean) {
    const current = profile?.alerts_config || {};
    await save({ alerts_config: { ...current, [key]: val } });
  }

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm font-mono">Chargement...</div>
    </div>
  );

  const checklist  = profile.checklist || {};
  const strategies = profile.strategies_enabled || {};
  const alerts     = profile.alerts_config || {};
  const isLive     = profile.trading_mode === "live";
  const score      = profile.checklist_score || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">Profil</h1>
          {msg && <span className={"text-[11px] font-mono " + (msg.includes("OK") ? "text-green-600" : "text-red-500")}>{msg}</span>}
        </div>
      </div>

      <div className="px-6 pt-5 space-y-4">

        <div className="border border-gray-200 rounded-xl bg-white px-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar initials={name.slice(0,2) || "TR"} />
            <div className="flex-1 min-w-0">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => save({ name, avatar_initials: name.slice(0,2).toUpperCase() })}
                className="text-base font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-400 outline-none w-full"
                placeholder="Ton nom"
              />
              <div className="text-[11px] text-gray-400 font-mono mt-1">
                {profile.stats?.total_trades || 0} trades
                {profile.stats?.win_rate ? " · WR " + fmt(profile.stats.win_rate, 0) + "%" : ""}
              </div>
            </div>
            <div className={"text-[10px] font-mono px-2.5 py-1 rounded-lg border " + (isLive ? "text-red-600 border-red-300 bg-red-50" : "text-gray-400 border-gray-200")}>
              {isLive ? "LIVE" : "SIM"}
            </div>
          </div>
        </div>

        <Section title="Mode Trading">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-gray-600">Validation Live</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: score + "%" }} />
                </div>
                <span className="text-[11px] font-mono text-gray-500">{score}%</span>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl px-3 py-1">
              {Object.values(checklist).map((item: any, i: number) => (
                <ChecklistItem key={i} item={item} />
              ))}
            </div>
          </div>
          <Field label="Mode actuel">
            <span className={"text-[11px] font-mono " + (isLive ? "text-red-600" : "text-gray-500")}>
              {isLive ? "LIVE" : "Simulation"}
            </span>
            <Toggle enabled={isLive} onChange={toggleLive} disabled={!profile.live_ready && !isLive} />
          </Field>
          {!profile.live_ready && (
            <p className="text-[10px] text-gray-400 font-mono">
              {profile.stats?.total_trades || 0}/100 trades completes. Continuez la simulation.
            </p>
          )}
        </Section>

        <Section title="Capital & Risque">
          {[
            { label: "Risque par trade", key: "risk_per_trade_pct", value: profile.risk_per_trade_pct, suffix: "%" },
            { label: "Capital scalp",    key: "capital_scalp_pct",  value: profile.capital_scalp_pct,  suffix: "%" },
            { label: "Capital DEX Lab",  key: "capital_dex_pct",    value: profile.capital_dex_pct,    suffix: "%" },
            { label: "Max drawdown",     key: "max_drawdown_pct",   value: profile.max_drawdown_pct,   suffix: "%" },
            { label: "Max positions",    key: "max_positions",      value: profile.max_positions,      suffix: "" },
          ].map(f => (
            <Field key={f.key} label={f.label}>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  defaultValue={f.value}
                  onBlur={e => save({ [f.key]: parseFloat(e.target.value) })}
                  className="w-16 text-right text-[13px] font-mono border border-gray-200 rounded-lg px-2 py-1 focus:border-gray-400 outline-none"
                />
                {f.suffix && <span className="text-[11px] text-gray-400">{f.suffix}</span>}
              </div>
            </Field>
          ))}
          <Field label="Mode Shariah">
            <Toggle enabled={!!profile.shariah_mode} onChange={v => save({ shariah_mode: v })} />
          </Field>
        </Section>

        <Section title="Strategies actives">
          {[
            { key: "mean_reversion",   label: "Mean Reversion (1h)" },
            { key: "market_structure", label: "Market Structure" },
            { key: "momentum",         label: "Momentum" },
            { key: "scalp",            label: "Scalp 5m/15m" },
            { key: "dex_lab",          label: "DEX Lab Phase 1" },
          ].map(s => (
            <Field key={s.key} label={s.label}>
              <Toggle enabled={!!strategies[s.key]} onChange={v => toggleStrategy(s.key, v)} />
            </Field>
          ))}
        </Section>

        <Section title="Alertes Telegram">
          <p className="text-[10px] text-gray-400 font-mono">
            Creez un bot via @BotFather et recuperez le token + chat ID.
          </p>
          <input
            value={telegram}
            onChange={e => setTelegram(e.target.value)}
            onBlur={() => save({ telegram_token: telegram })}
            placeholder="Bot Token"
            className="w-full text-[12px] font-mono border border-gray-200 rounded-lg px-3 py-2 focus:border-gray-400 outline-none placeholder:text-gray-300"
          />
          <input
            value={chatId}
            onChange={e => setChatId(e.target.value)}
            onBlur={() => save({ telegram_chat_id: chatId })}
            placeholder="Chat ID"
            className="w-full text-[12px] font-mono border border-gray-200 rounded-lg px-3 py-2 focus:border-gray-400 outline-none placeholder:text-gray-300"
          />
          <div className="border border-gray-100 rounded-xl px-3 py-1">
            {[
              { key: "trade_open",    label: "Trade ouvert" },
              { key: "trade_close",   label: "Trade ferme (TP/SL)" },
              { key: "drawdown",      label: "Drawdown alert" },
              { key: "dex_detected",  label: "DEX Lab : token detecte" },
              { key: "regime_change", label: "Changement de regime" },
            ].map(a => (
              <div key={a.key} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                <span className="text-[13px] text-gray-600">{a.label}</span>
                <Toggle enabled={!!alerts[a.key]} onChange={v => toggleAlert(a.key, v)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="API Binance">
          <p className="text-[11px] text-gray-400 font-mono">
            Requis pour le mode Live. Permissions : Spot Trading + Read.
          </p>
          <input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="API Key"
            type="password"
            className="w-full text-[12px] font-mono border border-gray-200 rounded-lg px-3 py-2 focus:border-gray-400 outline-none placeholder:text-gray-300"
          />
          <input
            value={apiSecret}
            onChange={e => setApiSecret(e.target.value)}
            placeholder="API Secret"
            type="password"
            className="w-full text-[12px] font-mono border border-gray-200 rounded-lg px-3 py-2 focus:border-gray-400 outline-none placeholder:text-gray-300"
          />
          <button
            onClick={testBinance}
            disabled={testing || !apiKey || !apiSecret}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-[13px] font-mono text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-40"
          >
            {testing ? "Test en cours..." : "Tester la connexion"}
          </button>
          {profile.binance_verified && (
            <p className="text-[11px] text-green-600 font-mono text-center">API verifiee</p>
          )}
        </Section>

        <Section title="Compte">
          <button
            onClick={() => { if (confirm("Se déconnecter ?")) logout(); }}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-[13px] font-mono text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Se déconnecter
          </button>
        </Section>

        <Section title="Danger Zone">
          <button
            onClick={() => { if (confirm("Fermer TOUTES les positions ?")) fetch(API + "/api/emergency/close-all", { method: "POST" }); }}
            className="w-full py-2.5 rounded-xl border border-orange-200 text-[13px] font-mono text-orange-500 hover:bg-orange-50 transition-colors"
          >
            Fermer toutes les positions
          </button>
          <button
            onClick={() => { if (confirm("Mode urgence : le moteur sera mis en pause.")) fetch(API + "/api/emergency/pause", { method: "POST" }); }}
            className="w-full py-2.5 rounded-xl border border-red-200 text-[13px] font-mono text-red-500 hover:bg-red-50 transition-colors"
          >
            Mode urgence - tout couper
          </button>
        </Section>

        <p className="text-center text-[10px] text-gray-300 font-mono pb-2">SYNAPSE v3.0 · Paper Trading</p>

      </div>
    </div>
  );
}
