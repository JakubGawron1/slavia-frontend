"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getApiBaseUrl, getStoredToken, getStoredUser } from "@/lib/auth";
import { KLUB_NAV, PUBLIC_ROUTE_MAP } from "@/lib/klub-nav";
import { FLAG_ROLLOUT_LABELS } from "@/lib/feature-flags-meta";
import { useKlub } from "@/components/klub/KlubProvider";
import {
  getListFlagsQueryKey,
  getListPublicFlagsQueryKey,
  useListFlags,
  useSiteStats,
  useUpdateFlag,
} from "@/lib/api/generated/default/default";
import { useHealth } from "@/lib/api/generated/admin/admin";
import type {
  FeatureFlag,
  FlagKind,
  FlagRolloutStatus,
  SiteStats,
} from "@/lib/api/generated/models";

type Tab = "flags" | "stats" | "routes" | "debug";

function RolloutBadge({ status }: { status: FlagRolloutStatus }) {
  const meta = FLAG_ROLLOUT_LABELS[status];
  const tone =
    status === "wired"
      ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-100"
      : status === "partial"
        ? "border-amber-500/40 bg-amber-500/12 text-amber-100"
        : status === "planned"
          ? "border-paper/20 bg-paper/5 text-paper/55"
          : "border-paper/25 bg-paper/[0.04] text-paper/65";

  return (
    <span
      title={meta.hint}
      className={`inline-flex items-center border px-2 py-0.5 font-display text-[10px] tracking-[0.12em] uppercase ${tone}`}
    >
      {meta.label}
    </span>
  );
}

function FlagRow({
  flag,
  onToggle,
  pending,
}: {
  flag: FeatureFlag;
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border border-paper/10 px-4 py-4">
      <div className="min-w-0 max-w-xl space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-paper">{flag.label}</p>
          <RolloutBadge status={flag.rollout_status} />
        </div>
        <p className="text-sm leading-relaxed text-paper/60">
          {flag.description}
        </p>
        <p className="font-mono text-[11px] text-paper/35">
          {flag.key}
          {flag.updated_at
            ? ` · aktualizacja ${new Date(flag.updated_at).toLocaleString("pl-PL")}`
            : null}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onToggle(flag)}
        disabled={pending}
        className={
          flag.enabled
            ? "shrink-0 bg-brand px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
            : "shrink-0 border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
        }
      >
        {flag.enabled ? "Włączone" : "Wyłączone"}
      </button>
    </div>
  );
}

function FlagCategory({
  title,
  hint,
  flags,
  onToggle,
  pending,
}: {
  title: string;
  hint: string;
  flags: FeatureFlag[];
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          {title}
        </h2>
        <p className="mt-1 text-sm text-paper/50">{hint}</p>
      </div>
      {flags.length === 0 ? (
        <p className="text-sm text-paper/45">Brak flag w tej kategorii.</p>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <FlagRow
              key={flag.key}
              flag={flag}
              onToggle={onToggle}
              pending={pending}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function flagsByKind(flags: FeatureFlag[], kind: FlagKind): FeatureFlag[] {
  return flags.filter((f) => f.kind === kind);
}

export default function DevToolsPage() {
  const { user, activeRole, viewAs } = useKlub();
  const [tab, setTab] = useState<Tab>("flags");
  const [actionError, setActionError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const flagsQuery = useListFlags({ query: { enabled: tab === "flags" } });
  const statsQuery = useSiteStats({ query: { enabled: tab === "stats" } });
  const healthQuery = useHealth({ query: { enabled: tab === "debug" } });
  const updateFlagMutation = useUpdateFlag();

  const flags = (flagsQuery.data?.data as FeatureFlag[] | undefined) ?? [];
  const stableFlags = flagsByKind(flags, "stable");
  const experimentalFlags = flagsByKind(flags, "experimental");
  const stats = (statsQuery.data?.data as SiteStats | undefined) ?? null;
  const health = healthQuery.data
    ? JSON.stringify(healthQuery.data.data)
    : healthQuery.isError
      ? "Błąd połączenia"
      : "—";

  const queryError = flagsQuery.error ?? statsQuery.error ?? healthQuery.error;
  const error =
    actionError ??
    (queryError instanceof Error ? queryError.message : null);

  async function toggleFlag(flag: FeatureFlag) {
    setActionError(null);
    try {
      await updateFlagMutation.mutateAsync({
        key: flag.key,
        data: { enabled: !flag.enabled },
      });
      await queryClient.invalidateQueries({
        queryKey: getListFlagsQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getListPublicFlagsQueryKey(),
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Nie udało się przełączyć",
      );
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

  const rolloutStatuses = Object.keys(FLAG_ROLLOUT_LABELS) as FlagRolloutStatus[];

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
        <div className="space-y-8">
          <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
            <p>
              Katalog flag pochodzi z backendu. Przełącznik zmienia stan w DB —
              badge pokazuje, czy funkcja jest już podpięta w kodzie.
            </p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              {rolloutStatuses.map((status) => (
                <div key={status} className="flex items-start gap-2">
                  <RolloutBadge status={status} />
                  <span className="text-xs leading-snug text-paper/40">
                    {FLAG_ROLLOUT_LABELS[status].hint}
                  </span>
                </div>
              ))}
            </dl>
          </div>

          <FlagCategory
            title="Stable"
            hint="Funkcje produkcyjne — bezpieczne do włączania na żywo."
            flags={stableFlags}
            onToggle={(f) => void toggleFlag(f)}
            pending={updateFlagMutation.isPending}
          />

          <FlagCategory
            title="Experimental"
            hint="Funkcje eksperymentalne / w trakcie rozwoju — domyślnie wyłączone."
            flags={experimentalFlags}
            onToggle={(f) => void toggleFlag(f)}
            pending={updateFlagMutation.isPending}
          />

          {flags.length === 0 && !flagsQuery.isLoading ? (
            <p className="text-sm text-paper/45">Brak flag w bazie.</p>
          ) : null}
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
