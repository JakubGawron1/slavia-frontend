import type { PlanDay, PlanWeek, TrainingPlan } from "@/lib/api/generated/models";
import { clubTodayYmd } from "@/lib/plans/today";

function newId(): string {
  return crypto.randomUUID();
}

export function emptyDay(weekday: number): PlanDay {
  return {
    id: newId(),
    weekday,
    club_session: true,
    notes: null,
    exercises: [],
  };
}

export function blankManualPlan(
  weeks = 8,
  weekdays: number[] = [1, 3, 5],
): TrainingPlan {
  const now = new Date().toISOString();
  const days = weekdays.map(emptyDay);
  const planWeeks: PlanWeek[] = Array.from({ length: weeks }, (_, i) => ({
    id: newId(),
    index: i + 1,
    days: days.map((d) => ({ ...d, id: newId(), exercises: [] })),
  }));
  return {
    id: newId(),
    title: "Nowy plan",
    notes: null,
    status: "draft",
    origin: "manual",
    starts_on: null,
    is_current: false,
    assignment: { kind: "none", user_ids: [], group_ids: [] },
    weeks: planWeeks,
    created_by: "",
    created_at: now,
    updated_at: now,
  };
}

export function syncWeekdays(
  plan: TrainingPlan,
  weekdays: number[],
): TrainingPlan {
  const ordered = [...new Set(weekdays)].sort((a, b) => a - b);
  return {
    ...plan,
    weeks: (plan.weeks ?? []).map((week) => {
      const existing = week.days ?? [];
      return {
        ...week,
        days: ordered.map(
          (weekday) =>
            existing.find((d) => d.weekday === weekday) ?? emptyDay(weekday),
        ),
      };
    }),
  };
}

export function resizeWeeks(plan: TrainingPlan, count: number): TrainingPlan {
  const n = Math.min(16, Math.max(4, count));
  const weeks = [...(plan.weeks ?? [])].sort((a, b) => a.index - b.index);
  const templateDays = weeks[0]?.days ?? [emptyDay(1), emptyDay(3), emptyDay(5)];
  while (weeks.length < n) {
    weeks.push({
      id: newId(),
      index: weeks.length + 1,
      days: templateDays.map((d) => ({
        id: newId(),
        weekday: d.weekday,
        club_session: d.club_session ?? true,
        notes: null,
        exercises: [],
      })),
    });
  }
  return {
    ...plan,
    weeks: weeks.slice(0, n).map((w, i) => ({ ...w, index: i + 1 })),
  };
}

export function withPublishDefaults(plan: TrainingPlan): TrainingPlan {
  if ((plan.status ?? "draft") !== "published") return plan;
  if (plan.starts_on && plan.starts_on.length === 10) return plan;
  return { ...plan, starts_on: clubTodayYmd() };
}
