"use client";
import { useState } from "react";

const API = "";  // Proxy Next.js — pas besoin de l URL complète

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const r = await fetch(API + "/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await r.json();
    if (d.success) setSent(true);
    else setError(d.error || "Erreur");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Mot de passe oublié</h1>
          <p className="text-[12px] text-gray-400 font-mono mt-1">On t envoie un lien de reset</p>
        </div>

        {sent ? (
          <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-[13px] text-green-700 font-medium">Email envoyé !</p>
            <p className="text-[11px] text-green-600 mt-1">Vérifie ta boite mail et clique sur le lien.</p>
            <a href="/login" className="block mt-4 text-[12px] text-gray-500 hover:underline">Retour au login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Ton email" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
            />
            {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
            <a href="/login" className="block text-center text-[12px] text-gray-400 hover:underline">Retour au login</a>
          </form>
        )}
      </div>
    </div>
  );
}
