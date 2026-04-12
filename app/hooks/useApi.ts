import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://116.203.235.44:8000";

export function useApi<T>(endpoint: string, refreshInterval = 10000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_data = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetch_data();
    const interval = setInterval(fetch_data, refreshInterval);
    return () => clearInterval(interval);
  }, [fetch_data, refreshInterval]);

  return { data, loading, error, refetch: fetch_data };
}
