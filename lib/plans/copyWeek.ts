import type {
  PlanDay,
  PlanExercise,
  PlanSet,
  PlanWeek,
  TrainingPlan,
} from "@/lib/api/generated/models";

function newId(): string {
  return crypto.randomUUID();
}

function rekeySet(s: PlanSet): PlanSet {
  return { ...s, id: newId() };
}

function rekeyExercise(ex: PlanExercise): PlanExercise {
  return {
    ...ex,
    id: newId(),
    sets: (ex.sets ?? []).map(rekeySet),
    alternatives: (ex.alternatives ?? []).map((a) => ({
      ...a,
      id: newId(),
      sets: (a.sets ?? []).map(rekeySet),
    })),
  };
}

function rekeyDay(day: PlanDay): PlanDay {
  return {
    ...day,
    id: newId(),
    exercises: (day.exercises ?? []).map(rekeyExercise),
  };
}

function replaceDayInWeek(week: PlanWeek, weekday: number, day: PlanDay): PlanWeek {
  const days = [...(week.days ?? [])];
  const idx = days.findIndex((d) => d.weekday === weekday);
  if (idx >= 0) days[idx] = day;
  else days.push(day);
  return { ...week, days };
}

export function copyWeekTo(
  plan: TrainingPlan,
  fromIndex: number,
  toIndex: number,
): TrainingPlan {
  if (fromIndex === toIndex) return plan;
  const weeks = plan.weeks ?? [];
  const src = weeks.find((w) => w.index === fromIndex);
  const dst = weeks.find((w) => w.index === toIndex);
  if (!src || !dst) return plan;
  const copied: PlanWeek = {
    ...dst,
    days: (src.days ?? []).map(rekeyDay),
  };
  return {
    ...plan,
    weeks: weeks.map((w) => (w.index === dst.index ? copied : w)),
  };
}

export function copyWeekToAll(plan: TrainingPlan, fromIndex: number): TrainingPlan {
  const weeks = plan.weeks ?? [];
  const src = weeks.find((w) => w.index === fromIndex);
  if (!src) return plan;
  return {
    ...plan,
    weeks: weeks.map((w) =>
      w.index === fromIndex
        ? w
        : { ...w, days: (src.days ?? []).map(rekeyDay) },
    ),
  };
}

export function copyDayToWeek(
  plan: TrainingPlan,
  fromWeek: number,
  weekday: number,
  toWeek: number,
): TrainingPlan {
  if (fromWeek === toWeek) return plan;
  const weeks = plan.weeks ?? [];
  const srcDay = weeks
    .find((w) => w.index === fromWeek)
    ?.days?.find((d) => d.weekday === weekday);
  const dstWeek = weeks.find((w) => w.index === toWeek);
  if (!srcDay || !dstWeek) return plan;
  const next = replaceDayInWeek(dstWeek, weekday, rekeyDay(srcDay));
  return {
    ...plan,
    weeks: weeks.map((w) => (w.index === toWeek ? next : w)),
  };
}

export function copyDayToAllWeeks(
  plan: TrainingPlan,
  weekIndex: number,
  weekday: number,
): TrainingPlan {
  const weeks = plan.weeks ?? [];
  const srcDay = weeks
    .find((w) => w.index === weekIndex)
    ?.days?.find((d) => d.weekday === weekday);
  if (!srcDay) return plan;
  return {
    ...plan,
    weeks: weeks.map((w) => {
      if (w.index === weekIndex) return w;
      return replaceDayInWeek(w, weekday, rekeyDay(srcDay));
    }),
  };
}
