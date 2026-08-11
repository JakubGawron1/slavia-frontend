"use client";

import { useState } from "react";
import type {
  ExerciseLibraryItem,
  PlanExercise,
  PlanWeek,
  TrainingPlan,
} from "@/lib/api/generated/models";
import {
  copyWeekExercisesByDayOfWeek,
  weekHasAnyExercises,
} from "@/lib/plans/copyWeek";
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

  /**
   * Kopiuje ćwiczenia z tygodnia `fromIdx` do `toIdx` po dniu tygodnia (Pon→Pon…).
   * Zwraca false gdy indeksy nieprawidłowe lub źródło puste.
   */
  function copyWeekTo(
    fromIdx: number,
    toIdx: number,
  ): { ok: boolean; reason?: "missing" | "empty" | "same" } {
    if (!editing) return { ok: false, reason: "missing" };
    if (fromIdx === toIdx) return { ok: false, reason: "same" };
    const weeks = weeksOf(editing);
    const source = weeks[fromIdx];
    const target = weeks[toIdx];
    if (!source || !target) return { ok: false, reason: "missing" };
    if (!weekHasAnyExercises(source)) return { ok: false, reason: "empty" };

    updateWeeks((ws) => {
      const src = ws[fromIdx];
      const dst = ws[toIdx];
      if (!src || !dst) return ws;
      ws[toIdx] = copyWeekExercisesByDayOfWeek(src, dst);
      return ws;
    });
    return { ok: true };
  }

  /** Kopiuje bieżący tydzień → następny (T{n} → T{n+1}). */
  function copyCurrentWeekToNext() {
    return copyWeekTo(weekIdx, weekIdx + 1);
  }

  /** Wkleja ćwiczenia z poprzedniego tygodnia do bieżącego. */
  function pasteFromPreviousWeek() {
    return copyWeekTo(weekIdx - 1, weekIdx);
  }

  /**
   * Kopiuje bieżący tydzień do wszystkich pozostałych (Pon→Pon…).
   * Jedna mutacja = jedno Ctrl+Z.
   */
  function copyCurrentWeekToAll(): {
    ok: boolean;
    reason?: "missing" | "empty" | "none";
    count?: number;
  } {
    if (!editing) return { ok: false, reason: "missing" };
    const weeks = weeksOf(editing);
    const source = weeks[weekIdx];
    if (!source) return { ok: false, reason: "missing" };
    if (!weekHasAnyExercises(source)) return { ok: false, reason: "empty" };
    if (weeks.length < 2) return { ok: false, reason: "none" };

    let count = 0;
    updateWeeks((ws) => {
      const src = ws[weekIdx];
      if (!src) return ws;
      return ws.map((w, i) => {
        if (i === weekIdx) return w;
        count += 1;
        return copyWeekExercisesByDayOfWeek(src, w);
      });
    });
    return { ok: true, count };
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
    copyWeekTo,
    copyCurrentWeekToNext,
    copyCurrentWeekToAll,
    pasteFromPreviousWeek,
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
