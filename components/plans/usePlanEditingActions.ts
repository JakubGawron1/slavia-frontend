"use client";

import { useState } from "react";
import type {
  ExerciseLibraryItem,
  PlanExercise,
  PlanWeek,
  TrainingPlan,
} from "@/lib/api/generated/models";
import { emptyExercise, ensureWeeks } from "@/lib/plans/helpers";

/**
 * Mutacje aktualnie edytowanego planu (tygodnie/dni/ćwiczenia/przypisanie).
 * Każda zmiana przechodzi przez `setEditingTracked`, żeby zachować undo/redo + autosave.
 */
export function usePlanEditingActions(
  editing: TrainingPlan | null,
  setEditingTracked: (next: TrainingPlan) => void,
  weekIdx: number,
  dayIdx: number,
) {
  const [dragEx, setDragEx] = useState<number | null>(null);

  function weeksOf(plan: TrainingPlan): PlanWeek[] {
    return ensureWeeks(plan);
  }

  function updateWeeks(mutator: (weeks: PlanWeek[]) => PlanWeek[]) {
    if (!editing) return;
    const weeks = mutator(
      JSON.parse(JSON.stringify(weeksOf(editing))) as PlanWeek[],
    );
    setEditingTracked({ ...editing, weeks });
  }

  function currentDayExercises(): PlanExercise[] {
    if (!editing) return [];
    const weeks = weeksOf(editing);
    const w = weeks[weekIdx];
    const d = w?.days?.[dayIdx];
    return [...(d?.exercises ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  function setDayExercises(exercises: PlanExercise[]) {
    updateWeeks((weeks) => {
      const w = weeks[weekIdx];
      if (!w?.days?.[dayIdx]) return weeks;
      w.days[dayIdx].exercises = exercises.map((ex, i) => ({ ...ex, sort_order: i }));
      return weeks;
    });
  }

  function addExercise(fromLib?: ExerciseLibraryItem) {
    const list = currentDayExercises();
    const ex = emptyExercise(
      fromLib
        ? {
            name: fromLib.name,
            sets: fromLib.default_sets ?? 3,
            reps: fromLib.default_reps ?? "3",
            notes: fromLib.notes ?? null,
            is_warmup: fromLib.tags?.includes("warmup") ?? false,
          }
        : undefined,
    );
    setDayExercises([...list, ex]);
  }

  function patchExercise(i: number, patch: Partial<PlanExercise>) {
    const list = currentDayExercises();
    list[i] = { ...list[i], ...patch };
    setDayExercises(list);
  }

  function onDropEx(to: number) {
    if (dragEx == null || dragEx === to) return;
    const list = currentDayExercises();
    const [item] = list.splice(dragEx, 1);
    list.splice(to, 0, item);
    setDayExercises(list);
    setDragEx(null);
  }

  function toggleUser(uid: string) {
    if (!editing) return;
    const has = editing.assigned_user_ids?.includes(uid);
    setEditingTracked({
      ...editing,
      assigned_user_ids: has
        ? (editing.assigned_user_ids ?? []).filter((id) => id !== uid)
        : [...(editing.assigned_user_ids ?? []), uid],
    });
  }

  function toggleGroup(gid: string) {
    if (!editing) return;
    const has = editing.assigned_group_ids?.includes(gid);
    setEditingTracked({
      ...editing,
      assigned_group_ids: has
        ? (editing.assigned_group_ids ?? []).filter((id) => id !== gid)
        : [...(editing.assigned_group_ids ?? []), gid],
    });
  }

  return {
    weeksOf,
    updateWeeks,
    currentDayExercises,
    setDayExercises,
    addExercise,
    patchExercise,
    dragEx,
    setDragEx,
    onDropEx,
    toggleUser,
    toggleGroup,
  };
}
