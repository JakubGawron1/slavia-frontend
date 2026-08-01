"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiBaseUrl, getStoredToken, getStoredUser } from "@/lib/auth";
import { klubFetch } from "@/lib/klub-api";
import { KLUB_NAV, PUBLIC_ROUTE_MAP } from "@/lib/klub-nav";
import { useKlub } from "@/components/klub/KlubProvider";

type FeatureFlag = {
  key: string;
  label: string;
  enabled: boolean;
  kind: "stable" | "experimental";
  updated_at: string;
};

type SiteStats = {
  users: number;
  active_users: number;
  athlete_profiles: number;
  cms_pages: number;
  cms_published: number;
  results_pending: number;
  results_total: number;
  feature_flags: number;
  system_logs: number;
};

type Tab = "flags" | "stats" | "routes" | "debug";

export default function DevToolsPage() {
  const { user, activeRole, viewAs } = useKlub();
  const [tab, setTab] = useState<Tab>("flags");
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [health, setHealth] = useState<string>("—");
  const [error, setError] = useState<string | null>(null);

  const loadFlags = useCallback(async () => {
    setFlags(await klubFetch<FeatureFlag[]>("/api/admin/flags"));
  }, []);

  const loadStats = useCallback(async () => {
    setStats(await klubFetch<SiteStats>("/api/admin/stats"));
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        if (tab === "flags") await loadFlags();
        if (tab === "stats") await loadStats();
        if (tab === "debug") {
          const res = await fetch(`${getApiBaseUrl()}/api/health`);
          setHealth(res.ok ? JSON.stringify(await res.json()) : `HTTP ${res.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd DevTools");
      }
    })();
  }, [tab, loadFlags, loadStats]);

  async function toggleFlag(flag: FeatureFlag) {
    try {
      await klubFetch(`/api/admin/flags/${flag.key}`, {
        method: "PATCH",
        body: { enabled: !flag.enabled },
      });
      await loadFlags();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się przełączyć");
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "flags", label: "Flagi" },
    { id: "stats", label: "Statystyki" },
    { id: "routes", label: "Mapa tras" },
    { id: "debug", label: "Debug" },
  ];

  const klubRoutes = [
    { path: "/klub", label: "Pulpit" },
    ...KLUB_NAV.flatMap((c) =>
      c.items.map((i) => ({ path: i.href, label: i.label })),
    ),
  ];

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          DevTools
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/60 uppercase"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {tab === "flags" ? (
        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.key}
              className="flex flex-wrap items-center justify-between gap-3 border border-paper/10 px-4 py-3"
            >
              <div>
                <p className="font-medium">{flag.label}</p>
                <p className="text-xs text-paper/45">
                  {flag.key} · {flag.kind}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggleFlag(flag)}
                className={
                  flag.enabled
                    ? "bg-brand px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                    : "border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                }
              >
                {flag.enabled ? "Włączone" : "Wyłączone"}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "stats" && stats ? (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Konta", stats.users],
              ["Aktywne konta", stats.active_users],
              ["Profile zawodników", stats.athlete_profiles],
              ["Strony CMS", stats.cms_pages],
              ["CMS opublikowane", stats.cms_published],
              ["Wyniki (łącznie)", stats.results_total],
              ["Wyniki oczekujące", stats.results_pending],
              ["Flagi", stats.feature_flags],
              ["Logi", stats.system_logs],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border border-paper/10 bg-paper/[0.03] px-4 py-3">
              <dt className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                {label}
              </dt>
              <dd className="mt-1 font-display text-2xl">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {tab === "routes" ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
              Publiczne
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {PUBLIC_ROUTE_MAP.map((r) => (
                <li key={r.path} className="font-mono text-paper/70">
                  {r.path}{" "}
                  <span className="font-sans text-paper/40">— {r.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
              Panel /klub
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {klubRoutes.map((r) => (
                <li key={r.path} className="font-mono text-paper/70">
                  {r.path}{" "}
                  <span className="font-sans text-paper/40">— {r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "debug" ? (
        <pre className="overflow-x-auto border border-paper/10 bg-ink/50 p-4 text-xs leading-relaxed text-paper/75">
          {JSON.stringify(
            {
              api: getApiBaseUrl(),
              health,
              activeRole,
              viewAs,
              user: user ?? getStoredUser(),
              tokenPresent: Boolean(getStoredToken()),
            },
            null,
            2,
          )}
        </pre>
      ) : null}
    </div>
  );
}
