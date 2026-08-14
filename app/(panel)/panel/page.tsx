"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  useAthleteStats,
  useListPlans,
  useListPublicFlags,
  useListResults,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import type {
  AthleteProfile,
  AthleteStats,
  CompetitionResult,
  TrainingPlan,
} from "@/lib/api/generated/models";
import { formatKg, resultEventInstant } from "@/lib/athletes";
import {
  ATHLETE_STAT_LINKS,
  PANEL_MODULES,
} from "@/lib/panel-nav";
import { isFlagEnabled, TRAINING_PLANS_FLAG } from "@/lib/public-flags";
import { ProgressChart } from "@/components/zawodnicy/ProgressChart";
import { usePanel } from "@/components/panel/PanelProvider";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

const LIFT_CARDS: {
  key: string;
  label: string;
  href: string;
  get: (s: AthleteStats) => string;
}[] = [
  {
    key: "category",
    label: "Kat. wagowa",
    href: "/panel/wyniki",
    get: (s) => s.category?.trim() || "—",
  },
  {
    key: "best_total",
    label: "Dwubój",
    href: "/panel/wyniki",
    get: (s) => formatKg(s.best_total_kg),
  },
  {
    key: "best_snatch",
    label: "Rwanie",
    href: "/panel/wyniki",
    get: (s) => formatKg(s.best_snatch_kg),
  },
  {
    key: "best_cj",
    label: "Podrzut",
    href: "/panel/wyniki",
    get: (s) => formatKg(s.best_clean_jerk_kg),
  },
  {
    key: "starts",
    label: "Starty",
    href: "/panel/wyniki",
    get: (s) => String(s.starts_count),
  },
];

const OPS_CARDS: {
  key: keyof typeof ATHLETE_STAT_LINKS;
  label: string;
  get: (s: AthleteStats) => number | string;
}[] = [
  {
    key: "results_pending",
    label: "Oczekujące",
    get: (s) => s.results_pending,
  },
  {
    key: "attendance_month",
    label: "Obecności (miesiąc)",
    get: (s) => s.attendance_month,
  },
  {
    key: "plans_active",
    label: "Aktywne plany",
    get: (s) => s.plans_active,
  },
];

function buildChartProfile(
  userId: string,
  displayName: string,
  stats: AthleteStats | null,
  profiles: AthleteProfile[],
): AthleteProfile {
  const matched = profiles.find((p) => p.user_id === userId);
  if (matched) return matched;
  const now = new Date().toISOString();
  return {
    id: `local-${userId}`,
    user_id: userId,
    display_name: displayName,
    bodyweight_kg: stats?.bodyweight_kg ?? null,
    category: stats?.category ?? null,
    notes: null,
    photo_url: null,
    birth_date: null,
    sex: null,
    created_at: now,
    updated_at: now,
  };
}

export default function PanelHomePage() {
  const { user, viewAs } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const statsQuery = useAthleteStats({
    query: { queryKey: ["/api/athlete/stats", scopeKey] },
  });
  const resultsQuery = useListResults(
    { mine: true },
    { query: { queryKey: ["/api/results", { mine: true }, scopeKey] } },
  );
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  const plansEnabled = isFlagEnabled(flags, TRAINING_PLANS_FLAG);
  const plansQuery = useListPlans(
    { mine: true },
    {
      query: {
        queryKey: ["/api/plans", { mine: true }, scopeKey],
        staleTime: 30_000,
        enabled: plansEnabled,
      },
    },
  );
  const modules = PANEL_MODULES.filter(
    (mod) => !mod.flag || isFlagEnabled(flags, mod.flag),
  );
  const opsCards = OPS_CARDS.filter(
    (card) => card.key !== "plans_active" || plansEnabled,
  );
  const stats = (statsQuery.data?.data as AthleteStats | undefined) ?? null;
  const seasonPlan = useMemo(() => {
    if (!plansEnabled) return null;
    const list = (plansQuery.data?.data as TrainingPlan[] | undefined) ?? [];
    return list.find((p) => p.is_season_active) ?? null;
  }, [plansEnabled, plansQuery.data]);
  const error =
    statsQuery.error instanceof Error
      ? statsQuery.error.message
      : statsQuery.isError
        ? "Błąd statystyk"
        : resultsQuery.isError
          ? "Nie udało się wczytać wyników."
          : plansQuery.isError
            ? "Nie udało się wczytać planów."
            : null;
  const statsLoading = statsQuery.isPending;

  const chartResults = useMemo(() => {
    const all = (resultsQuery.data?.data as CompetitionResult[] | undefined) ?? [];
    return all
      .filter(
        (r) =>
          r.status === "accepted" &&
          (r.kind ?? "competition").toLowerCase() === "competition",
      )
      .sort((a, b) => resultEventInstant(a) - resultEventInstant(b));
  }, [resultsQuery.data]);

  const chartProfile = useMemo(() => {
    if (!user) return null;
    const profiles =
      (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];
    return buildChartProfile(user.id, user.display_name, stats, profiles);
  }, [user, profilesQuery.data, stats]);

  if (!user) return null;

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Pulpit"
        title={`Cześć, ${user.display_name}`}
        titleSize="hero"
        description={
          <>
            {stats?.category
              ? `Kategoria ${stats.category}`
              : "Twój profil zawodnika"}
            {stats?.bodyweight_kg != null ? ` · ${stats.bodyweight_kg} kg` : ""}
          </>
        }
      />

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}

      {seasonPlan ? (
        <section aria-label="Plan sezonu">
          <Link
            href={`/panel/plany?plan=${encodeURIComponent(seasonPlan.id)}`}
            className="group block border border-brand/40 bg-brand/[0.08] px-4 py-5 transition-colors hover:border-brand hover:bg-brand/15 sm:px-5"
          >
            <p className="font-display text-[11px] tracking-[0.18em] text-brand uppercase">
              Plan sezonu
            </p>
            <p className="mt-2 font-display text-xl uppercase group-hover:text-brand sm:text-2xl">
              {seasonPlan.title}
            </p>
            {seasonPlan.week_label || seasonPlan.description ? (
              <p className="mt-1 text-sm text-paper/55">
                {seasonPlan.week_label ||
                  (seasonPlan.description?.slice(0, 120) ?? "")}
              </p>
            ) : (
              <p className="mt-1 text-sm text-paper/55">
                Otwórz aktywny plan treningowy
              </p>
            )}
          </Link>
        </section>
      ) : null}

      <section aria-label="Wyniki sportowe">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LIFT_CARDS.map((card) => {
            const value = stats ? card.get(stats) : "—";
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group border border-paper/10 bg-paper/[0.03] px-4 py-4 transition-colors hover:border-brand/50 hover:bg-brand/10"
              >
                <p className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-2xl group-hover:text-brand sm:text-3xl">
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse bg-paper/10" />
                  ) : (
                    value
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Progres startów"
        className="border border-paper/10 bg-paper/[0.03] px-4 py-5 sm:px-5"
      >
        <p className="font-display text-[11px] tracking-[0.18em] text-brand uppercase">
          Progres startów
        </p>
        <p className="mt-1 text-sm text-paper/55">
          Dwubój na zaakceptowanych zawodach — jak na stronie zawodników.
        </p>
        <div className="mt-3">
          {chartProfile ? (
            <ProgressChart
              profile={chartProfile}
              results={chartResults}
              tone="panel"
            />
          ) : (
            <InlineStatus kind="loading">Ładowanie progresu…</InlineStatus>
          )}
        </div>
      </section>

      <section aria-label="Statystyki panelu">
        <div className="grid gap-3 sm:grid-cols-3">
          {opsCards.map((card) => {
            const href = ATHLETE_STAT_LINKS[card.key];
            const value = stats ? card.get(stats) : "—";
            return (
              <Link
                key={card.key}
                href={href}
                className="group border border-paper/10 bg-paper/[0.03] px-4 py-4 transition-colors hover:border-brand/50 hover:bg-brand/10"
              >
                <p className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl group-hover:text-brand">
                  {statsLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse bg-paper/10" />
                  ) : (
                    value
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label="Moduły">
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Moduły
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {modules.map((mod) => (
            <li key={mod.href}>
              <Link
                href={mod.href}
                className="block h-full border border-paper/10 bg-paper/[0.03] px-4 py-5 transition-colors hover:border-brand/40 hover:bg-brand/10"
              >
                <span className="font-display text-sm tracking-[0.12em] uppercase">
                  {mod.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-paper/55">
                  {mod.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
