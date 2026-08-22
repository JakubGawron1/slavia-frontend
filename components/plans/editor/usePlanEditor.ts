"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type {
  PlanAssignment,
  PlanBody,
  PlanStatus,
  TrainingPlan,
} from "@/lib/api/generated/models";
import {
  createPlan,
  getListPlansQueryKey,
  updatePlan,
} from "@/lib/api/generated/default/default";
import {
  copyDayToAllWeeks,
  copyDayToWeek,
  copyWeekTo,
  copyWeekToAll,
} from "@/lib/plans/copyWeek";
import {
  resizeWeeks,
  syncWeekdays,
  withPublishDefaults,
} from "@/lib/plans/blank";
import { clearUnsavedPlan, writeUnsavedPlan } from "@/lib/plans/unsaved";
import { useToast } from "@/components/toast/ToastProvider";

export function toPlanBody(plan: TrainingPlan): PlanBody {
  return {
    title: plan.title,
    notes: plan.notes ?? null,
    status: plan.status ?? "draft",
    origin: plan.origin ?? "manual",
    starts_on: plan.starts_on ?? null,
    is_current: plan.is_current ?? false,
    assignment: plan.assignment ?? { kind: "none", user_ids: [], group_ids: [] },
    weeks: plan.weeks ?? [],
  };
}

export function usePlanEditor(initial: TrainingPlan, persisted: boolean) {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [plan, setPlan] = useState<TrainingPlan>(initial);
  const [weekIndex, setWeekIndex] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const skipAutosave = useRef(true);
  const savingRef = useRef(false);
  const lastSent = useRef<string>("");

  useEffect(() => {
    setPlan(initial);
    skipAutosave.current = true;
  }, [initial]);

  const week = (plan.weeks ?? []).find((w) => w.index === weekIndex);

  const persist = useCallback(
    async (next: TrainingPlan, opts?: { silent?: boolean; forceDraft?: boolean }) => {
      if (!next.title.trim()) {
        setError("Podaj tytuł planu.");
        return null;
      }
      savingRef.current = true;
      setSaving(true);
      setError(null);
      try {
        const ready = withPublishDefaults(
          opts?.forceDraft ? { ...next, status: "draft" } : next,
        );
        const body = toPlanBody(ready);
        const res = persisted
          ? await updatePlan(ready.id, body)
          : await createPlan(body);
        const saved = res.data as TrainingPlan;
        if (!persisted) clearUnsavedPlan();
        lastSent.current = JSON.stringify(toPlanBody(saved));
        setPlan(saved);
        setSavedAt(new Date());
        await queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
        return saved;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Zapis nieudany";
        setError(msg);
        if (!opts?.silent) toast.error("Plan", msg);
        return null;
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    [persisted, queryClient, toast],
  );

  useEffect(() => {
    if (skipAutosave.current) {
      skipAutosave.current = false;
      if (persisted) return;
    }
    if (!plan.title.trim()) return;
    const pendingPublish =
      (plan.status ?? "draft") === "published" &&
      (initial.status ?? "draft") !== "published";
    if (pendingPublish) return;
    const sig = JSON.stringify(toPlanBody(plan));
    if (sig === lastSent.current) return;
    if (!persisted) writeUnsavedPlan(plan);
    const handle = window.setTimeout(() => {
      if (savingRef.current) return;
      void (async () => {
        const saved = await persist(plan, {
          silent: true,
          forceDraft: !persisted,
        });
        if (!persisted && saved) {
          router.replace(`/klub/plany/${saved.id}`);
        }
      })();
    }, 1500);
    return () => window.clearTimeout(handle);
  }, [plan, persist, persisted, initial.status, router]);

  const save = useCallback(async () => {
    const saved = await persist(plan);
    if (!saved) return;
    const justPublished =
      (saved.status ?? "draft") === "published" &&
      (initial.status ?? "draft") !== "published";
    if (justPublished) {
      toast.success("Opublikowano plan", saved.title);
      router.replace("/klub/plany");
      return;
    }
    toast.success(persisted ? "Zapisano plan" : "Zapisano szkic", saved.title);
    if (!persisted) router.replace(`/klub/plany/${saved.id}`);
  }, [persist, plan, persisted, initial.status, router, toast]);

  const publish = useCallback(async () => {
    const saved = await persist({ ...plan, status: "published" });
    if (!saved) return;
    toast.success("Opublikowano plan", saved.title);
    router.replace("/klub/plany");
  }, [persist, plan, router, toast]);

  function setStatus(status: PlanStatus) {
    setPlan((p) => ({ ...p, status }));
  }

  function setAssignment(assignment: PlanAssignment) {
    setPlan((p) => ({ ...p, assignment }));
  }

  function setWeekCount(count: number) {
    setPlan((p) => resizeWeeks(p, count));
    setWeekIndex((i) => Math.min(i, Math.min(16, Math.max(4, count))));
  }

  function setWeekdays(weekdays: number[]) {
    if (weekdays.length === 0) return;
    setPlan((p) => syncWeekdays(p, weekdays));
  }

  function copyWeekToTarget(toWeek: number) {
    setPlan((p) => copyWeekTo(p, weekIndex, toWeek));
    toast.info("Skopiowano tydzień", `T${weekIndex} → T${toWeek}`);
  }

  function copyWeekToAllWeeks() {
    setPlan((p) => copyWeekToAll(p, weekIndex));
    toast.info("Skopiowano tydzień", `T${weekIndex} → wszystkie tygodnie`);
  }

  function copyDayToTarget(weekday: number, toWeek: number) {
    setPlan((p) => copyDayToWeek(p, weekIndex, weekday, toWeek));
    toast.info("Skopiowano dzień", `T${weekIndex} → T${toWeek}`);
  }

  function copyDayToAll(weekday: number) {
    setPlan((p) => copyDayToAllWeeks(p, weekIndex, weekday));
    toast.info("Skopiowano dzień", "Na wszystkie tygodnie");
  }

  return {
    plan,
    setPlan,
    week,
    weekIndex,
    setWeekIndex,
    saving,
    savedAt,
    error,
    save,
    publish,
    setStatus,
    setAssignment,
    setWeekCount,
    setWeekdays,
    copyWeekTo: copyWeekToTarget,
    copyWeekToAll: copyWeekToAllWeeks,
    copyDayToWeek: copyDayToTarget,
    copyDayToAll,
  };
}
