"use client";

import { useCallback, useEffect, useState } from "react";
import { klubFetch } from "@/lib/klub-api";

type SystemLog = {
  id: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
  actor_id: string | null;
  created_at: string;
};

export default function LogiPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [source, setSource] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (source) params.set("source", source);
      if (level) params.set("level", level);
      const data = await klubFetch<SystemLog[]>(`/api/logs?${params}`);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }, [source, level]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          System
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Logi systemowe
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Źródło (users, cms…)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <select
          className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Wszystkie poziomy</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
        >
          Odśwież
        </button>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {logs.map((log) => (
          <li key={log.id} className="px-4 py-3 text-sm">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-paper/45">
              <span className="font-mono">{log.created_at}</span>
              <span className="uppercase">{log.level}</span>
              <span>{log.source}</span>
            </div>
            <p className="mt-1 text-paper/85">{log.message}</p>
          </li>
        ))}
        {!loading && logs.length === 0 ? (
          <li className="px-4 py-6 text-paper/45">Brak logów.</li>
        ) : null}
      </ul>
    </div>
  );
}
