import type {
  PlanDay,
  PlanExercise,
  PlanWeek,
  TrainingPlan,
} from "@/lib/api/generated/models";
import type { PctOfLift } from "@/lib/api/generated/models/pctOfLift";
import type { PlanSet } from "@/lib/api/generated/models/planSet";

export const DAY_LABELS = [
  "",
  "Pon",
  "Wt",
  "Śr",
  "Czw",
  "Pt",
  "Sob",
  "Nd",
] as const;

export type AssignMode = "all" | "group" | "personal";

export function emptyExercise(partial?: Partial<PlanExercise>): PlanExercise {
  return {
    id: crypto.randomUUID(),
    name: "",
    sets: 3,
    reps: "3",
    load_kg: null,
    notes: null,
    load_pct: null,
    pct_of: null,
    is_warmup: false,
    alternatives: [],
    sort_order: 0,
    set_scheme: [],
    individual_load: false,
    ...partial,
  };
}

export function emptyDay(dayOfWeek: number): PlanDay {
  return { day_of_week: dayOfWeek, label: null, exercises: [] };
}

export function emptyWeeks(n: number): PlanWeek[] {
  return Array.from({ length: n }, (_, i) => ({
    week_index: i + 1,
    label: `Tydzień ${i + 1}`,
    days: [1, 3, 5].map(emptyDay),
  }));
}

function weekHasExercises(weeks: PlanWeek[]): boolean {
  return weeks.some((w) =>
    (w.days ?? []).some((d) => (d.exercises?.length ?? 0) > 0),
  );
}

export function ensureWeeks(plan: TrainingPlan): PlanWeek[] {
  if (plan.weeks && plan.weeks.length > 0) {
    if (weekHasExercises(plan.weeks)) return plan.weeks;
    // Struktura tygodni bez ćwiczeń — spróbuj legacy flat list
    if (plan.exercises && plan.exercises.length > 0) {
      return [
        {
          week_index: 1,
          label: plan.week_label ?? "Tydzień 1",
          days: [
            {
              day_of_week: 1,
              label: null,
              exercises: plan.exercises,
            },
          ],
        },
      ];
    }
    return plan.weeks;
  }
  if (plan.exercises && plan.exercises.length > 0) {
    return [
      {
        week_index: 1,
        label: plan.week_label ?? "Tydzień 1",
        days: [
          {
            day_of_week: 1,
            label: null,
            exercises: plan.exercises,
          },
        ],
      },
    ];
  }
  return emptyWeeks(1);
}

export function newDraftPlan(): TrainingPlan {
  return {
    id: "",
    title: "",
    description: "",
    week_label: "",
    exercises: [],
    weeks: emptyWeeks(1),
    assigned_user_ids: [],
    assigned_group_ids: [],
    version: 1,
    is_template: false,
    archived: false,
    is_season_active: false,
    created_at: "",
    created_by: "",
    updated_at: "",
  };
}

export function planAssignmentKind(
  plan: TrainingPlan,
): "all" | "group" | "individual" {
  const users = plan.assigned_user_ids?.length ?? 0;
  const groups = plan.assigned_group_ids?.length ?? 0;
  if (users === 0 && groups === 0) return "all";
  if (users === 1 && groups === 0) return "individual";
  if (groups > 0 && users === 0) return "group";
  return "group";
}

export function detectAssignMode(plan: TrainingPlan): AssignMode {
  const kind = planAssignmentKind(plan);
  if (kind === "all") return "all";
  if (kind === "individual") return "personal";
  return "group";
}

export function resolveLoadKg(
  ex: Pick<PlanExercise | PlanSet, "load_kg" | "load_pct" | "pct_of">,
  bests: { snatch?: number | null; cj?: number | null; total?: number | null },
): number | null {
  if (ex.load_pct != null && ex.pct_of && ex.pct_of !== "exercise") {
    const base =
      ex.pct_of === "snatch"
        ? bests.snatch
        : ex.pct_of === "clean_jerk"
          ? bests.cj
          : bests.total;
    if (base != null && base > 0) {
      return Math.round((base * ex.load_pct) / 100 / 0.5) * 0.5;
    }
  }
  return ex.load_kg ?? null;
}

/** Etykieta bazy % — dla `exercise` używa nazwy ćwiczenia (np. „PR deadlift”). */
export function pctOfLabel(
  pct: PctOfLift | null | undefined,
  exerciseName?: string | null,
): string {
  if (pct === "snatch") return "PR rwanie";
  if (pct === "clean_jerk") return "PR podrzut";
  if (pct === "total") return "PR dwubój";
  if (pct === "exercise") {
    const n = exerciseName?.trim();
    return n ? `PR ${n}` : "PR tego ćwiczenia";
  }
  return "";
}

export function usesExercisePr(
  ex: Pick<PlanExercise | PlanSet, "load_pct" | "pct_of">,
): boolean {
  return ex.load_pct != null && ex.pct_of === "exercise";
}

/** Rozwiń jednolity schemat (sets×reps@%) do listy serii albo użyj set_scheme. */
export function expandSetScheme(ex: PlanExercise): PlanSet[] {
  if (isIndividualLoad(ex) && ex.set_scheme && ex.set_scheme.length > 0) {
    return ex.set_scheme;
  }
  const n = Math.max(1, ex.sets ?? 1);
  return Array.from({ length: n }, () => ({
    reps: ex.reps ?? null,
    load_kg: ex.load_kg ?? null,
    load_pct: ex.load_pct ?? null,
    pct_of: ex.pct_of ?? null,
    is_warmup: Boolean(ex.is_warmup),
  }));
}

export function formatPrescription(
  ex: PlanExercise,
  bests?: { snatch?: number | null; cj?: number | null; total?: number | null },
): string {
  const scheme = expandSetScheme(ex);
  if (scheme.length === 0) return "";
  const uniform =
    scheme.length > 1 &&
    scheme.every(
      (s) =>
        s.reps === scheme[0].reps &&
        s.load_pct === scheme[0].load_pct &&
        s.load_kg === scheme[0].load_kg &&
        s.pct_of === scheme[0].pct_of,
    );
  if (uniform) {
    const s = scheme[0];
    const kg = bests ? resolveLoadKg(s, bests) : (s.load_kg ?? null);
    const parts = [
      `${scheme.length}×${s.reps ?? "?"}`,
      s.load_pct != null
        ? `@ ${s.load_pct}% ${pctOfLabel(s.pct_of, ex.name)}`.trimEnd()
        : null,
      kg != null ? `${kg} kg` : null,
    ].filter(Boolean);
    return parts.join(" · ");
  }
  return scheme
    .map((s, i) => {
      const kg = bests ? resolveLoadKg(s, bests) : (s.load_kg ?? null);
      const bits = [
        `S${i + 1}`,
        s.reps ?? "?",
        s.load_pct != null
          ? `${s.load_pct}% ${pctOfLabel(s.pct_of, ex.name)}`.trimEnd()
          : null,
        kg != null ? `${kg}kg` : null,
      ].filter(Boolean);
      return bits.join(" ");
    })
    .join(" · ");
}

export function flattenExercises(plan: TrainingPlan): PlanExercise[] {
  const weeks = ensureWeeks(plan);
  const out: PlanExercise[] = [];
  for (const w of weeks) {
    for (const d of w.days ?? []) {
      const sorted = [...(d.exercises ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      );
      out.push(...sorted);
    }
  }
  if (out.length === 0 && plan.exercises?.length) return plan.exercises;
  return out;
}

/** ISO weekday 1=Pon … 7=Nd */
export function todayIsoWeekday(): number {
  const js = new Date().getDay(); // 0=Nd
  return js === 0 ? 7 : js;
}

export function buildSetSchemeFromCount(
  count: number,
  base: Pick<PlanExercise, "reps" | "load_kg" | "load_pct" | "pct_of" | "is_warmup">,
): PlanSet[] {
  const n = Math.max(1, Math.min(20, count));
  return Array.from({ length: n }, () => ({
    reps: base.reps ?? "3",
    load_kg: base.load_kg ?? null,
    load_pct: base.load_pct ?? null,
    pct_of: base.pct_of ?? null,
    is_warmup: Boolean(base.is_warmup),
  }));
}

export type LoadMode = "kg" | "pct";

export function loadModeOf(ex: {
  load_kg?: number | null;
  load_pct?: number | null;
  pct_of?: string | null;
}): LoadMode {
  // pct_of trzyma tryb % także gdy load_pct jest chwilowo puste (np. backspace)
  if (ex.load_pct != null || ex.pct_of != null) return "pct";
  return "kg";
}

export function isIndividualLoad(
  ex: Pick<PlanExercise, "individual_load" | "set_scheme">,
): boolean {
  if (ex.individual_load) return true;
  // legacy: rozpis bez flagi (API zwraca default false)
  return (ex.set_scheme?.length ?? 0) > 0;
}

/** Wspólny → indywidualny: flaga + rozpis serii z pól ćwiczenia. */
export function toIndividualLoad(ex: PlanExercise): PlanExercise {
  const scheme = ex.set_scheme ?? [];
  const set_scheme =
    scheme.length > 0
      ? scheme
      : buildSetSchemeFromCount(Math.max(1, ex.sets ?? 3), ex);
  return {
    ...ex,
    individual_load: true,
    set_scheme,
    sets: set_scheme.length,
  };
}

/** Indywidualny → wspólny: obciążenie z 1. serii na ćwiczenie, bez set_scheme. */
export function toUniformLoad(ex: PlanExercise): PlanExercise {
  const scheme = ex.set_scheme ?? [];
  const first = scheme[0];
  return {
    ...ex,
    individual_load: false,
    sets: scheme.length > 0 ? scheme.length : (ex.sets ?? null),
    reps: first?.reps ?? ex.reps ?? null,
    load_kg: first ? (first.load_kg ?? null) : (ex.load_kg ?? null),
    load_pct: first ? (first.load_pct ?? null) : (ex.load_pct ?? null),
    pct_of: first ? (first.pct_of ?? null) : (ex.pct_of ?? null),
    set_scheme: [],
  };
}

/** Kg XOR %1RM — nie wysyłamy obu naraz; przy wspólnym czyści set_scheme. */
export function normalizeExerciseLoad(ex: PlanExercise): PlanExercise {
  if (!isIndividualLoad(ex)) {
    const mode = loadModeOf(ex);
    if (mode === "pct") {
      return { ...ex, load_kg: null, set_scheme: [], individual_load: false };
    }
    return {
      ...ex,
      load_pct: null,
      pct_of: null,
      set_scheme: [],
      individual_load: false,
    };
  }

  const set_scheme = (ex.set_scheme ?? []).map((s) => {
    if (loadModeOf(s) === "pct") {
      return { ...s, load_kg: null };
    }
    return { ...s, load_pct: null, pct_of: null };
  });
  // przy indywidualnym obciążenie ćwiczenia jest szablonem — XOR wg 1. serii lub ćwiczenia
  const mode = loadModeOf(set_scheme[0] ?? ex);
  if (mode === "pct") {
    return { ...ex, load_kg: null, set_scheme, individual_load: true };
  }
  return {
    ...ex,
    load_pct: null,
    pct_of: null,
    set_scheme,
    individual_load: true,
  };
}
