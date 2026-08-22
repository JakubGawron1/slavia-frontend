import type { PlanDay, PlanWeek, TrainingPlan } from "@/lib/api/generated/models";

export function isoWeekday(date = new Date()): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

/** Data klubowa YYYY-MM-DD w Europe/Warsaw. */
export function clubTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function resolvePlanToday(
  plan: TrainingPlan,
  now = new Date(),
): {
  weekIndex: number;
  weekday: number;
  week?: PlanWeek;
  day?: PlanDay;
} {
  const weekday = isoWeekday(now);
  let weekIndex = 1;
  if (plan.starts_on) {
    const start = new Date(`${plan.starts_on}T12:00:00`);
    const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
    weekIndex = Math.max(1, Math.floor(diff / 7) + 1);
  }
  const max = plan.weeks?.length ?? 1;
  if (weekIndex > max) weekIndex = max;
  const week = plan.weeks?.find((w) => w.index === weekIndex);
  const day = week?.days?.find((d) => d.weekday === weekday);
  return { weekIndex, weekday, week, day };
}
