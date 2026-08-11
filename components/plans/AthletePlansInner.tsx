"use client";

import { useSearchParams } from "next/navigation";
import type { TrainingPlan } from "@/lib/api/generated/models";
import { usePanel } from "@/components/panel/PanelProvider";
import { useAthletePlanProgress } from "@/components/plans/useAthletePlanProgress";
import { AthletePlanDay } from "@/components/plans/AthletePlanDay";
import { tabActive, tabIdle } from "@/components/plans/styles";

export function AthletePlansInner() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";

  const progress = useAthletePlanProgress(planFromUrl, scopeKey);

  return (
    <div className="animate-rise max-w-3xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Trening
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Plany treningowe
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Serie, obciążenie %1RM, zamienniki i odhaczanie postępu.
        </p>
      </div>

      {progress.error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {progress.error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {progress.plans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => progress.setActiveId(p.id)}
            className={progress.activeId === p.id ? tabActive : tabIdle}
          >
            {p.title}
            {p.is_season_active ? <span className="ml-1.5 opacity-80">· sezon</span> : null}
            {planAssignmentBadge(p)}
          </button>
        ))}
        {progress.plans.length === 0 ? (
          <p className="text-sm text-paper/45">Brak przypisanych planów.</p>
        ) : null}
      </div>

      {progress.plan ? (
        <AthletePlanDay
          plan={progress.plan}
          weeks={progress.weeks}
          weekIdx={progress.weekIdx}
          setWeekIdx={progress.setWeekIdx}
          onlyToday={progress.onlyToday}
          setOnlyToday={progress.setOnlyToday}
          dayExercises={progress.dayExercises}
          entryFor={progress.entryFor}
          patchEntry={progress.patchEntry}
          bests={progress.bests}
          today={progress.today}
          completedAt={progress.completedAt}
          feedback={progress.feedback}
          updateFeedback={progress.updateFeedback}
          coachReply={progress.coachReply}
          coachRepliedAt={progress.coachRepliedAt}
          saved={progress.saved}
          onSave={() => void progress.save()}
        />
      ) : null}
    </div>
  );
}

function planAssignmentBadge(p: TrainingPlan) {
  const n = p.assigned_user_ids?.length ?? 0;
  const g = p.assigned_group_ids?.length ?? 0;
  if (n === 1 && g === 0) {
    return <span className="ml-1 text-[10px] text-brand uppercase">osobisty</span>;
  }
  return null;
}
