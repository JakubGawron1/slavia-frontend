"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  useAthleteStats,
  useListPublicFlags,
  useListResults,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import type {
  AthleteProfile,
  AthleteStats,
  CompetitionResult,
} from "@/lib/api/generated/models";
import { formatKg } from "@/lib/athletes";
import {
  ATHLETE_STAT_LINKS,
  PANEL_MODULES,
} from "@/lib/panel-nav";
import { isFlagEnabled } from "@/lib/public-flags";
import { ProgressChart } from "@/components/zawodnicy/ProgressChart";
import { usePanel } from "@/components/panel/PanelProvider";

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
  const { user } = usePanel();
  const statsQuery = useAthleteStats();
  const resultsQuery = useListResults({ mine: true });
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  const modules = PANEL_MODULES.filter(
    (mod) => !mod.flag || isFlagEnabled(flags, mod.flag),
  );
  const stats = (statsQuery.data?.data as AthleteStats | undefined) ?? null;
  const error =
    statsQuery.error instanceof Error
      ? statsQuery.error.message
      : statsQuery.isError
        ? "Błąd statystyk"
        : null;

  const chartResults = useMemo(() => {
    const all = (resultsQuery.data?.data as CompetitionResult[] | undefined) ?? [];
    return all
      .filter(
        (r) =>
          r.status === "accepted" &&
          (r.kind ?? "competition").toLowerCase() === "competition",
      )
      .sort(
        (a, b) =>
          new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
      );
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
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Pulpit
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase md:text-4xl">
          Cześć, {user.display_name}
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          {stats?.category
            ? `Kategoria ${stats.category}`
            : "Twój profil zawodnika"}
          {stats?.bodyweight_kg != null
            ? ` · ${stats.bodyweight_kg} kg`
            : ""}
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
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
                  {value}
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
            <p className="py-6 text-center text-sm text-paper/55">Ładowanie…</p>
          )}
        </div>
      </section>

      <section aria-label="Statystyki panelu">
        <div className="grid gap-3 sm:grid-cols-3">
          {OPS_CARDS.map((card) => {
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
                  {value}
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
