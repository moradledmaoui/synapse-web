"use client";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./dashboard-content";
import Landing from "./landing";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm font-mono">Loading...</div>
    </div>
  );

  if (user) return <Dashboard />;
  return <Landing />;
}
