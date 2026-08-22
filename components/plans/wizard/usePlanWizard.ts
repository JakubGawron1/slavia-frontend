"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  LibraryExercise,
  PlanAssignment,
  PlanSkeletonBody,
  SkeletonDay,
  SkeletonLift,
  TrainingPlan,
} from "@/lib/api/generated/models";
import { createSkeleton, updatePlan } from "@/lib/api/generated/default/default";
import { toPlanBody } from "@/components/plans/editor/usePlanEditor";
import { parseOrMessage } from "@/lib/validation/parse";
import { wizardDaysSchema, wizardMetaSchema } from "@/lib/validation/plan";
import { useToast } from "@/components/toast/ToastProvider";

export function wizardStepLabels(asCatalog: boolean) {
  return asCatalog
    ? (["Plan", "Dni", "Ćwiczenia"] as const)
    : (["Plan", "Dni", "Ćwiczenia", "Przypisanie"] as const);
}

function simpleLift(
  library: LibraryExercise[],
  keywords: string[],
  fallback: string,
): SkeletonLift {
  const hit = library.find((item) =>
    keywords.some((k) => item.name.toLowerCase().includes(k)),
  );
  return {
    name: hit?.name ?? fallback,
    library_id: hit?.id ?? null,
    work_sets: 5,
    work_reps: "3",
    start_pct: 70,
    end_pct: 70,
    pct_of: "exercise",
    load_kg: null,
  };
}

export function defaultMains(
  weekday: number,
  library: LibraryExercise[],
): SkeletonLift[] {
  if (weekday === 1 || weekday === 2) {
    return [simpleLift(library, ["rwanie"], "Rwanie")];
  }
  if (weekday === 3 || weekday === 4) {
    return [simpleLift(library, ["podrzut"], "Podrzut")];
  }
  if (weekday === 5 || weekday === 6) {
    return [simpleLift(library, ["przysiad"], "Przysiad tylny")];
  }
  return [simpleLift(library, ["rwanie"], "Rwanie")];
}

export type WizardState = {
  title: string;
  weeks: number;
  starts_on: string;
  notes: string;
  weekdays: number[];
  days: SkeletonDay[];
  assignment: PlanAssignment;
  is_current: boolean;
};

const INITIAL: WizardState = {
  title: "",
  weeks: 12,
  starts_on: "",
  notes: "",
  weekdays: [1, 3, 5],
  days: [
    { weekday: 1, session: "custom", mains: [], accessories: [] },
    { weekday: 3, session: "custom", mains: [], accessories: [] },
    { weekday: 5, session: "custom", mains: [], accessories: [] },
  ],
  assignment: { kind: "none", user_ids: [], group_ids: [] },
  is_current: false,
};

export function usePlanWizard(library: LibraryExercise[], asCatalog = false) {
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const seeded = useMemo(() => {
    return state.days.map((d) => ({
      ...d,
      mains:
        d.mains && d.mains.length > 0
          ? d.mains
          : defaultMains(d.weekday, library),
    }));
  }, [state.days, library]);

  function patch(partial: Partial<WizardState>) {
    setState((s) => ({ ...s, ...partial }));
  }

  function setWeekdays(weekdays: number[]) {
    const days = weekdays.map((weekday) => {
      const existing = state.days.find((d) => d.weekday === weekday);
      if (existing) return existing;
      return {
        weekday,
        session: "custom" as const,
        mains: [],
        accessories: [],
      };
    });
    patch({ weekdays, days });
  }

  function next() {
    setError(null);
    if (step === 0) {
      const r = parseOrMessage(wizardMetaSchema, {
        title: state.title,
        weeks: state.weeks,
        starts_on: state.starts_on,
        notes: state.notes,
      });
      if (!r.ok) {
        setError(r.message);
        return;
      }
    }
    if (step === 1) {
      const r = parseOrMessage(wizardDaysSchema, { weekdays: state.weekdays });
      if (!r.ok) {
        setError(r.message);
        return;
      }
      patch({
        days: state.days.map((d) => ({
          ...d,
          mains:
            d.mains && d.mains.length > 0
              ? d.mains
              : defaultMains(d.weekday, library),
        })),
      });
    }
    if (step === 2) {
      const empty = seeded.some((d) =>
        (d.mains ?? []).every((m) => !m.name.trim()),
      );
      if (empty) {
        setError("Każdy dzień potrzebuje co najmniej jednego ćwiczenia.");
        return;
      }
    }
    const last = wizardStepLabels(asCatalog).length - 1;
    setStep((s) => Math.min(s + 1, last));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const empty = seeded.some((d) =>
      (d.mains ?? []).every((m) => !m.name.trim()),
    );
    if (empty) {
      setError("Każdy dzień potrzebuje co najmniej jednego ćwiczenia.");
      setBusy(false);
      return;
    }
    try {
      const body: PlanSkeletonBody = {
        title: state.title.trim(),
        notes: state.notes.trim() || null,
        weeks: state.weeks,
        starts_on: state.starts_on || null,
        weekdays: state.weekdays,
        level: "beginner",
        days: seeded,
        intensity: "linear",
        deload_every: null,
        include_warmup_sets: false,
        include_warmup_block: false,
        rpe_mode: "off",
        assignment: state.assignment,
        is_current: state.is_current,
      };
      const res = await createSkeleton(body);
      let plan = res.data as TrainingPlan;
      if (asCatalog) {
        const saved = await updatePlan(plan.id, {
          ...toPlanBody(plan),
          status: "catalog",
          origin: "catalog",
          is_current: false,
          assignment: { kind: "none", user_ids: [], group_ids: [] },
        });
        plan = saved.data as TrainingPlan;
      }
      toast.success(asCatalog ? "Utworzono szablon" : "Utworzono szkic", plan.title);
      router.replace(`/klub/plany/${plan.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się utworzyć";
      setError(msg);
      toast.error("Kreator", msg);
    } finally {
      setBusy(false);
    }
  }

  return {
    step,
    setStep,
    state,
    patch,
    setWeekdays,
    seeded,
    error,
    busy,
    next,
    back,
    submit,
  };
}
