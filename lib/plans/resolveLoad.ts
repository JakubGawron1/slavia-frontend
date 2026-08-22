import type { AthleteStats, LoadSpec, PctOf } from "@/lib/api/generated/models";

export type ResolvedLoad = {
  label: string;
  kg?: number;
  hint?: string;
};

function ofLabel(of: PctOf): string {
  switch (of) {
    case "snatch":
      return "rwania";
    case "clean_jerk":
      return "podrzutu";
    case "total":
      return "dwuboju";
    default:
      return "PR ćwiczenia";
  }
}

export function resolveLoad(
  load: LoadSpec,
  stats?: AthleteStats | null,
  exercisePr?: number | null,
): ResolvedLoad {
  if (load.mode === "kg") {
    return { label: `${load.kg} kg`, kg: load.kg };
  }
  if (load.mode === "bar") {
    return { label: "sztanga", kg: 20 };
  }
  if (load.mode === "athlete") {
    return { label: "dobierz ciężar" };
  }
  const base =
    load.of === "snatch"
      ? stats?.best_snatch_kg
      : load.of === "clean_jerk"
        ? stats?.best_clean_jerk_kg
        : load.of === "total"
          ? stats?.best_total_kg
          : (exercisePr ?? undefined);
  const name = ofLabel(load.of);
  if (typeof base === "number" && Number.isFinite(base)) {
    const kg = Math.round((load.pct / 100) * base);
    return { label: `${load.pct}% ${name} ≈ ${kg} kg`, kg };
  }
  return {
    label: `${load.pct}% ${name}`,
    hint: "brak rekordu — zgłoś PR",
  };
}
