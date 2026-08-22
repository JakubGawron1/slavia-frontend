import type {
  AssignmentKind,
  ExerciseFamily,
  ExerciseRole,
  PlanOrigin,
  PlanStatus,
  SessionTemplate,
} from "@/lib/api/generated/models";

export const WEEKDAY_SHORT = ["", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"] as const;
export const WEEKDAY_LONG = [
  "",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
] as const;

export const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  draft: "Szkic",
  published: "Opublikowany",
  archived: "Archiwum",
  catalog: "Katalog",
};

export const PLAN_ORIGIN_LABEL: Record<PlanOrigin, string> = {
  wizard: "Kreator",
  catalog: "Katalog",
  ai: "Szkic AI",
  manual: "Ręczny",
};

export const SESSION_LABEL: Record<SessionTemplate, string> = {
  snatch: "Rwanie",
  clean_jerk: "Podrzut",
  squat: "Przysiad",
  mixed: "Mieszany",
  light: "Lekki",
  custom: "Własny",
};

export const FAMILY_LABEL: Record<ExerciseFamily, string> = {
  olympic: "Olimpijskie",
  squat: "Przysiady",
  pull: "Podciągania",
  accessory: "Akcesoria",
  warmup: "Rozgrzewka",
};

export const PLAN_FIELD =
  "mt-1 w-full border border-paper/15 bg-chrome px-3 py-2.5 text-sm text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-brand";

export const PLAN_BTN =
  "bg-brand px-5 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand/85 disabled:opacity-50";

export const PLAN_BTN_GHOST =
  "border border-paper/20 px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper/70 uppercase transition-colors hover:border-paper/45 hover:text-paper disabled:opacity-40";

export const PLAN_SURFACE =
  "border border-paper/10 bg-paper/3";

export const PLAN_EYEBROW =
  "font-display text-[10px] tracking-[0.16em] text-paper/40 uppercase";

export const EXERCISE_ROLE_LABEL: Record<ExerciseRole, string> = {
  warmup: "Rozgrzewka",
  main: "Must do",
  accessory: "Akcesorium",
};

export const MUST_DO_CHIP =
  "border border-amber-400/55 bg-amber-500/18 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-amber-100 uppercase";

export function isMustDo(role?: ExerciseRole): boolean {
  return (role ?? "main") === "main";
}

export function assignmentSummary(
  kind: AssignmentKind | undefined,
  userCount: number,
  groupCount: number,
): string {
  switch (kind) {
    case "all":
      return "Wszyscy zawodnicy";
    case "users":
      return userCount ? `${userCount} zawodn.` : "Wybrani zawodnicy";
    case "groups":
      return groupCount ? `${groupCount} grup` : "Grupy";
    default:
      return "Bez przypisania";
  }
}

export const RPE_OPTIONS: Array<number | null> = [
  null,
  6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
];
