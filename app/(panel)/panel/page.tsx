"use client";

import Link from "next/link";
import { useAthleteStats } from "@/lib/api/generated/default/default";
import type { AthleteStats } from "@/lib/api/generated/models";
import {
  ATHLETE_STAT_LINKS,
  PANEL_MODULES,
} from "@/lib/panel-nav";
import { usePanel } from "@/components/panel/PanelProvider";

const STAT_CARDS: {
  key: keyof typeof ATHLETE_STAT_LINKS;
  label: string;
  get: (s: AthleteStats) => number | string;
}[] = [
  {
    key: "results_accepted",
    label: "Zaakceptowane wyniki",
    get: (s) => s.results_accepted,
  },
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

export default function PanelHomePage() {
  const { user } = usePanel();
  const statsQuery = useAthleteStats();
  const stats = (statsQuery.data?.data as AthleteStats | undefined) ?? null;
  const error =
    statsQuery.error instanceof Error
      ? statsQuery.error.message
      : statsQuery.isError
        ? "Błąd statystyk"
        : null;

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

      <section aria-label="Statystyki">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => {
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
          {PANEL_MODULES.map((mod) => (
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
