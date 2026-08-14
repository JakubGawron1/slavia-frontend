"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  PlanExercise,
  PlanProgressEntry,
  TrainingPlan,
  TrainingPlanProgress,
} from "@/lib/api/generated/models";
import {
  athleteStats,
  getMyProgress,
  listPlans,
  saveProgress,
} from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";
import { ensureWeeks, flattenExercises, todayIsoWeekday } from "@/lib/plans/helpers";

export interface AthleteBests {
  snatch?: number | null;
  cj?: number | null;
  total?: number | null;
}

export function useAthletePlanProgress(planFromUrl: string | null, scopeKey: string) {
  const toast = useToast();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, PlanProgressEntry>>({});
  const [feedback, setFeedback] = useState("");
  const [coachReply, setCoachReply] = useState<string | null>(null);
  const [coachRepliedAt, setCoachRepliedAt] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [bests, setBests] = useState<AthleteBests>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressByPlan, setProgressByPlan] = useState<
    Record<string, TrainingPlanProgress>
  >({});
  const [weekIdx, setWeekIdx] = useState(0);
  const [onlyToday, setOnlyToday] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, statsRes] = await Promise.all([
        listPlans({ mine: true }),
        athleteStats().catch(() => null),
      ]);
      const list = (res.data as TrainingPlan[]) ?? [];
      setPlans(list);
      const progPairs = await Promise.all(
        list.map(async (p) => {
          try {
            const pr = await getMyProgress(p.id);
            return [p.id, pr.data as TrainingPlanProgress] as const;
          } catch {
            return [p.id, null] as const;
          }
        }),
      );
      const byPlan: Record<string, TrainingPlanProgress> = {};
      for (const [id, row] of progPairs) {
        if (row) byPlan[id] = row;
      }
      setProgressByPlan(byPlan);
      setActiveId((prev) => {
        if (planFromUrl && list.some((p) => p.id === planFromUrl)) {
          return planFromUrl;
        }
        if (prev && list.some((p) => p.id === prev)) return prev;
        const season = list.find((p) => p.is_season_active);
        return season?.id ?? list[0]?.id ?? null;
      });
      setProgress({});
      const s = statsRes?.status === 200 ? statsRes.data : null;
      if (s && "best_snatch_kg" in s) {
        setBests({
          snatch: s.best_snatch_kg,
          cj: s.best_clean_jerk_kg,
          total: s.best_total_kg,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd planów");
    } finally {
      setLoading(false);
    }
  }, [planFromUrl]);

  useEffect(() => {
    void load();
  }, [load, scopeKey]);

  useEffect(() => {
    if (!activeId) return;
    void (async () => {
      try {
        const pRes = await getMyProgress(activeId);
        const p = pRes.data as TrainingPlanProgress;
        const map: Record<string, PlanProgressEntry> = {};
        for (const e of p.entries ?? []) map[e.exercise_id] = e;
        setProgress(map);
        setFeedback(p.athlete_feedback ?? "");
        setCoachReply(p.coach_reply ?? null);
        setCoachRepliedAt(p.coach_replied_at ?? null);
        setCompletedAt(p.completed_at ?? null);
        setWeekIdx(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd postępu");
      }
    })();
  }, [activeId]);

  const plan = plans.find((p) => p.id === activeId);
  const weeks = useMemo(() => (plan ? ensureWeeks(plan) : []), [plan]);
  const today = todayIsoWeekday();

  function entryFor(exId: string): PlanProgressEntry {
    return (
      progress[exId] ?? {
        exercise_id: exId,
        completed: false,
        athlete_note: null,
        actual_load_kg: null,
        selected_alternative_id: null,
      }
    );
  }

  function patchEntry(exId: string, patch: Partial<PlanProgressEntry>) {
    setProgress((prev) => ({
      ...prev,
      [exId]: { ...entryFor(exId), ...patch },
    }));
    setSaved(false);
  }

  function updateFeedback(value: string) {
    setFeedback(value);
    setSaved(false);
  }

  async function save() {
    if (!activeId) return;
    setError(null);
    try {
      const res = await saveProgress(activeId, {
        entries: Object.values(progress),
        athlete_feedback: feedback || null,
      });
      const p = res.data as TrainingPlanProgress;
      setCompletedAt(p.completed_at ?? null);
      setProgressByPlan((prev) => ({ ...prev, [activeId]: p }));
      setSaved(true);
      toast.success("Zapisano postęp treningu");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("Postęp planu", msg);
    }
  }

  const dayExercises = useMemo(() => {
    const out: { day: number; ex: PlanExercise }[] = [];
    if (!plan) return out;

    const w = weeks[weekIdx];
    if (w) {
      for (const d of w.days ?? []) {
        const sorted = [...(d.exercises ?? [])].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        );
        for (const ex of sorted) {
          out.push({ day: d.day_of_week, ex });
        }
      }
    }

    // Fallback: puste tygodnie / legacy flat list
    if (out.length === 0) {
      for (const ex of flattenExercises(plan)) {
        out.push({ day: 1, ex });
      }
    }

    if (onlyToday) {
      return out.filter((row) => row.day === today);
    }
    return out;
  }, [weeks, weekIdx, plan, onlyToday, today]);

  return {
    plans,
    activeId,
    setActiveId,
    plan,
    weeks,
    weekIdx,
    setWeekIdx,
    today,
    onlyToday,
    setOnlyToday,
    dayExercises,
    entryFor,
    patchEntry,
    bests,
    error,
    loading,
    saved,
    feedback,
    updateFeedback,
    coachReply,
    coachRepliedAt,
    completedAt,
    save,
    progressByPlan,
  };
}

export type AthletePlanProgress = ReturnType<typeof useAthletePlanProgress>;
