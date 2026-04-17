"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 6)  { setError("Mot de passe trop court (6 chars min)"); return; }
    setLoading(true); setError("");
    const r = await fetch(API + "/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const d = await r.json();
    if (d.success) { setDone(true); setTimeout(() => router.push("/login"), 2000); }
    else setError(d.error || "Token invalide ou expiré");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Nouveau mot de passe</h1>
        </div>

        {done ? (
          <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-[13px] text-green-700">Mot de passe mis à jour !</p>
            <p className="text-[11px] text-green-600 mt-1">Redirection vers le login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
            />
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Confirmer le mot de passe" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
            />
            {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
            <button type="submit" disabled={loading || !token}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
