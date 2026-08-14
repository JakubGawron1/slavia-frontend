"use client";

import { useSearchParams } from "next/navigation";
import type { TrainingPlan } from "@/lib/api/generated/models";
import { usePanel } from "@/components/panel/PanelProvider";
import { useAthletePlanProgress } from "@/components/plans/useAthletePlanProgress";
import { AthletePlanDay } from "@/components/plans/AthletePlanDay";
import { completionFromPlan } from "@/lib/plans/completion";
import { tabActive, tabIdle } from "@/components/plans/styles";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

export function AthletePlansInner() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";

  const progress = useAthletePlanProgress(planFromUrl, scopeKey);

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Trening"
        title="Plany treningowe"
        description="Serie, obciążenie %1RM, zamienniki i odhaczanie postępu."
      />

      {progress.error ? (
        <InlineStatus kind="error">{progress.error}</InlineStatus>
      ) : null}

      {progress.loading ? (
        <InlineStatus kind="loading">Ładowanie planów…</InlineStatus>
      ) : (
        <div className="flex flex-wrap gap-2">
          {progress.plans.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => progress.setActiveId(p.id)}
              className={progress.activeId === p.id ? tabActive : tabIdle}
              aria-pressed={progress.activeId === p.id}
            >
              {p.title}
              {p.is_season_active ? (
                <span className="ml-1.5 opacity-80">· sezon</span>
              ) : null}
              {planAssignmentBadge(p)}
              <span className="ml-1.5 tabular-nums opacity-70">
                {completionFromPlan(p, progress.progressByPlan[p.id]).pct}%
              </span>
            </button>
          ))}
          {progress.plans.length === 0 ? (
            <EmptyState
              title="Brak przypisanych planów"
              description="Trener przypisze plan do Ciebie, Twojej grupy albo do wszystkich zawodników."
            />
          ) : null}
        </div>
      )}

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
