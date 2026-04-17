"use client";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup }  = useAuth();
  const router      = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Mot de passe trop court (6 chars min)"); return; }
    setLoading(true); setError("");
    const ok = await signup(email, password, name);
    if (ok) router.push("/");
    else setError("Erreur lors de la création du compte");
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
          <p className="text-[12px] text-gray-400 font-mono mt-1">Créer un compte</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ton prénom" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
          />
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe (6 chars min)" required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] focus:border-gray-400 outline-none bg-white"
          />
          {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <a href="/login" className="text-gray-700 font-medium hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
