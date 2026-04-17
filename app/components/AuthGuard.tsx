"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC = ["/login", "/signup", "/forgot-password", "/reset-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user && !PUBLIC.includes(pathname)) router.push("/login");
    if (user && PUBLIC.includes(pathname)) router.push("/");
  }, [user, loading, pathname, router]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm font-mono">Chargement...</div>
    </div>
  );

  if (!user && !PUBLIC.includes(pathname)) return null;
  return <>{children}</>;
}
