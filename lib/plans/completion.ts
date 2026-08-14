import type { PlanProgressEntry, TrainingPlan } from "@/lib/api/generated/models";
import { flattenExercises } from "@/lib/plans/helpers";

export function completionFromPlan(
  plan: TrainingPlan,
  progress?: {
    entries?: PlanProgressEntry[] | null;
    completed_count?: number;
    total_count?: number;
  } | null,
): { done: number; total: number; pct: number } {
  const totalFromApi = progress?.total_count ?? 0;
  if (totalFromApi > 0 && progress?.completed_count != null) {
    const done = progress.completed_count;
    return {
      done,
      total: totalFromApi,
      pct: Math.round((done / totalFromApi) * 100),
    };
  }
  const exercises = flattenExercises(plan);
  const total = exercises.length;
  if (!total) return { done: 0, total: 0, pct: 0 };
  const entries = progress?.entries ?? [];
  const done = exercises.filter((ex) =>
    entries.some((e) => e.exercise_id === ex.id && e.completed),
  ).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function completionFromEntryMap(
  plan: TrainingPlan,
  map: Record<string, PlanProgressEntry>,
): { done: number; total: number; pct: number } {
  return completionFromPlan(plan, { entries: Object.values(map) });
}

export function filterPlansByQuery(plans: TrainingPlan[], query: string): TrainingPlan[] {
  const q = query.trim().toLowerCase();
  if (!q) return plans;
  return plans.filter((p) => {
    const title = p.title.toLowerCase();
    const desc = (p.description ?? "").toLowerCase();
    return title.includes(q) || desc.includes(q);
  });
}
