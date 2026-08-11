import type { PlanExercise, PlanWeek } from "@/lib/api/generated/models";

/** Głęboka kopia ćwiczenia z nowymi UUID (ćwiczenie + zamienniki). */
export function cloneExerciseFreshIds(ex: PlanExercise): PlanExercise {
  return {
    ...ex,
    id: crypto.randomUUID(),
    alternatives: (ex.alternatives ?? []).map((a) => ({
      ...a,
      id: crypto.randomUUID(),
    })),
    set_scheme: (ex.set_scheme ?? []).map((s) => ({ ...s })),
  };
}

export function weekHasAnyExercises(week: PlanWeek): boolean {
  return (week.days ?? []).some((d) => (d.exercises?.length ?? 0) > 0);
}

/**
 * Kopiuje ćwiczenia ze źródła do celu, dopasowując po `day_of_week`
 * (Pon→Pon, Wt→Wt…). Brakujące dni w celu są tworzone.
 * Istniejące ćwiczenia w pasujących dniach są nadpisywane.
 */
export function copyWeekExercisesByDayOfWeek(
  source: PlanWeek,
  target: PlanWeek,
): PlanWeek {
  const days = [...(target.days ?? [])];

  for (const srcDay of source.days ?? []) {
    const clonedExercises = [...(srcDay.exercises ?? [])]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((ex, i) => ({ ...cloneExerciseFreshIds(ex), sort_order: i }));

    const idx = days.findIndex((d) => d.day_of_week === srcDay.day_of_week);
    if (idx >= 0) {
      days[idx] = {
        ...days[idx],
        label: days[idx].label ?? srcDay.label ?? null,
        exercises: clonedExercises,
      };
    } else {
      days.push({
        day_of_week: srcDay.day_of_week,
        label: srcDay.label ?? null,
        exercises: clonedExercises,
      });
    }
  }

  days.sort((a, b) => a.day_of_week - b.day_of_week);
  return { ...target, days };
}
