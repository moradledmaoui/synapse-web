"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

interface User { id: number; email: string; name: string; role: string; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("synapse_token");
    const u = localStorage.getItem("synapse_user");
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const r = await fetch(API + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (d.success) {
      setToken(d.access_token);
      setUser(d.user);
      localStorage.setItem("synapse_token", d.access_token);
      localStorage.setItem("synapse_user", JSON.stringify(d.user));
      localStorage.setItem("synapse_refresh", d.refresh_token);
      return true;
    }
    return false;
  }

  async function signup(email: string, password: string, name: string): Promise<boolean> {
    const r = await fetch(API + "/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const d = await r.json();
    if (d.success) {
      setToken(d.access_token);
      setUser(d.user);
      localStorage.setItem("synapse_token", d.access_token);
      localStorage.setItem("synapse_user", JSON.stringify(d.user));
      localStorage.setItem("synapse_refresh", d.refresh_token);
      return true;
    }
    return false;
  }

  function logout() {
    const refresh = localStorage.getItem("synapse_refresh");
    if (refresh) fetch(API + "/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: refresh }) });
    setUser(null); setToken(null);
    localStorage.removeItem("synapse_token");
    localStorage.removeItem("synapse_user");
    localStorage.removeItem("synapse_refresh");
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
