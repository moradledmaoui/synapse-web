"use client";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login }   = useAuth();
  const router      = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const ok = await login(email, password);
    if (ok) router.push("/");
    else setError("Email ou mot de passe incorrect");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SYNAPSE</h1>
          <p className="text-[12px] text-gray-400 font-mono mt-1">Trading Intelligence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
          />
          {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          Pas de compte ?{" "}
          <a href="/signup" className="text-gray-700 font-medium hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}
