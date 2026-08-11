"use client";

import { useState } from "react";
import { useListLogs } from "@/lib/api/generated/default/default";
import type { SystemLog } from "@/lib/api/generated/models";

export default function LogiPage() {
  const [source, setSource] = useState("");
  const [level, setLevel] = useState("");

  const logsQuery = useListLogs(
    {
      limit: 200,
      source: source || undefined,
      level: level || undefined,
    },
    { query: { placeholderData: (prev) => prev } },
  );

  const logs = (logsQuery.data?.data as SystemLog[] | undefined) ?? [];
  const loading = logsQuery.isLoading;
  const error =
    logsQuery.error instanceof Error ? logsQuery.error.message : null;

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          System
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Logi systemowe
        </h1>
        <p className="mt-2 text-sm text-paper/50">
          Przechowywane przez 7 dni.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Źródło
          </span>
          <input
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="users, cms…"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Poziom
          </span>
          <select
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Wszystkie poziomy</option>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="error">error</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => void logsQuery.refetch()}
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
