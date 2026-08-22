"use client";

import Link from "next/link";
import type {
  AthleteStats,
  ExercisePr,
  TrainingPlan,
} from "@/lib/api/generated/models";
import {
  useAthleteStats,
  useListMyPrs,
  useListPlans,
} from "@/lib/api/generated/default/default";
import { AthleteDayView } from "@/components/plans/athlete/AthleteDayView";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { resolvePlanToday } from "@/lib/plans/today";
import { resolveLoad } from "@/lib/plans/resolveLoad";
import { PLAN_STATUS_LABEL } from "@/lib/plans/labels";

export function CurrentPlanTile({ plan }: { plan: TrainingPlan }) {
  const statsQuery = useAthleteStats();
  const prsQuery = useListMyPrs();
  const stats = (statsQuery.data?.data as AthleteStats | undefined) ?? null;
  const prs = (prsQuery.data?.data as ExercisePr[] | undefined) ?? [];
  const today = resolvePlanToday(plan);
  const firstWork = today.day?.exercises
    ?.find((e) => (e.role ?? "main") === "main")
    ?.sets?.find((s) => (s.kind ?? "work") === "work");
  const pr = firstWork
    ? prs.find(
        (p) =>
          p.exercise_id ===
          today.day?.exercises?.find((e) => (e.role ?? "main") === "main")
            ?.library_id,
      )?.kg
    : undefined;
  const load = firstWork ? resolveLoad(firstWork.load, stats, pr) : null;

  return (
    <Link
      href="/panel/plany"
      className="block border border-brand/40 bg-brand/10 px-4 py-5 transition-colors hover:bg-brand/15"
    >
      <p className="font-display text-[10px] tracking-[0.14em] text-brand uppercase">
        Aktualny plan
      </p>
      <p className="mt-1 font-display text-xl uppercase">{plan.title}</p>
      <p className="mt-2 text-sm text-paper/70">
        {today.day
          ? `Dziś T${today.weekIndex}`
          : "Dziś nie ma sesji"}
        {load ? ` · ${load.label}` : ""}
      </p>
    </Link>
  );
}

export function AthletePlansHome() {
  const plansQuery = useListPlans({ mine: true });
  const statsQuery = useAthleteStats();
  const prsQuery = useListMyPrs();
  const plans = (plansQuery.data?.data as TrainingPlan[] | undefined) ?? [];
  const stats = (statsQuery.data?.data as AthleteStats | undefined) ?? null;
  const prs = (prsQuery.data?.data as ExercisePr[] | undefined) ?? [];
  const current =
    plans.find((p) => p.is_current && p.status === "published") ??
    plans.find((p) => p.status === "published") ??
    plans[0];

  if (plansQuery.isPending) {
    return <InlineStatus kind="loading">Ładowanie planu…</InlineStatus>;
  }
  if (plansQuery.isError) {
    return (
      <InlineStatus kind="error">Nie udało się wczytać planu.</InlineStatus>
    );
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Panel"
        title="Plan treningowy"
        description="Najpierw dzisiejsza sesja z kilogramami — bez żargonu edytora."
      />
      {!current ? (
        <EmptyState
          title="Brak przypisanego planu"
          description="Gdy trener opublikuje program na Twoje konto, pojawi się tutaj."
        />
      ) : (
        <>
          <p className="text-sm text-paper/55">
            {current.title}
            {current.status
              ? ` · ${PLAN_STATUS_LABEL[current.status]}`
              : ""}
          </p>
          <AthleteDayView plan={current} stats={stats} prs={prs} />
        </>
      )}
    </div>
  );
}
