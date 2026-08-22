import type { TrainingPlan } from "@/lib/api/generated/models";

export const UNSAVED_PLAN_KEY = "slavia.unsavedPlan";

function write(raw: string) {
  sessionStorage.setItem(UNSAVED_PLAN_KEY, raw);
  try {
    localStorage.setItem(UNSAVED_PLAN_KEY, raw);
  } catch {
    /* quota / private mode */
  }
}

export function writeUnsavedPlan(plan: TrainingPlan): void {
  write(JSON.stringify(plan));
}

export function readUnsavedPlan(): TrainingPlan | null {
  try {
    const raw =
      sessionStorage.getItem(UNSAVED_PLAN_KEY) ??
      localStorage.getItem(UNSAVED_PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrainingPlan;
  } catch {
    return null;
  }
}

export function clearUnsavedPlan(): void {
  sessionStorage.removeItem(UNSAVED_PLAN_KEY);
  try {
    localStorage.removeItem(UNSAVED_PLAN_KEY);
  } catch {
    /* ignore */
  }
}
