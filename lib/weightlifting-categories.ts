import { ageFromBirthDate, parseSex } from "@/lib/athletes";
import type { SinclairSex } from "@/lib/sinclair";

/** Kategorie wagowe PZPC / IWF — sezon 2026. */
export const WEIGHTLIFTING_CATEGORIES_2026 = {
  senior: {
    men: ["60", "65", "70", "75", "85", "95", "110", "+110"],
    women: ["49", "53", "57", "61", "69", "77", "86", "+86"],
  },
  u23: {
    men: ["60", "65", "70", "75", "85", "95", "110", "+110"],
    women: ["49", "53", "57", "61", "69", "77", "86", "+86"],
  },
  u20: {
    men: ["60", "65", "70", "75", "85", "95", "110", "+110"],
    women: ["49", "53", "57", "61", "69", "77", "86", "+86"],
  },
  u17: {
    boys: ["55", "60", "65", "70", "75", "85", "95", "+95"],
    girls: ["45", "49", "53", "57", "61", "69", "77", "+77"],
  },
  u15: {
    boys: ["51", "55", "60", "65", "70", "75", "85", "+85"],
    girls: ["41", "45", "49", "53", "57", "61", "69", "+69"],
  },
} as const;

export type AgeGroupKey = keyof typeof WEIGHTLIFTING_CATEGORIES_2026;

export function ageGroupFromAge(age: number): AgeGroupKey {
  if (age < 15) return "u15";
  if (age < 17) return "u17";
  if (age < 20) return "u20";
  if (age < 23) return "u23";
  return "senior";
}

export function ageGroupLabel(group: AgeGroupKey): string {
  switch (group) {
    case "senior":
      return "Senior";
    case "u23":
      return "U23";
    case "u20":
      return "U20";
    case "u17":
      return "U17";
    case "u15":
      return "U15";
  }
}

function sexKey(
  group: AgeGroupKey,
  sex: SinclairSex,
): "men" | "women" | "boys" | "girls" {
  if (group === "u15" || group === "u17") {
    return sex === "male" ? "boys" : "girls";
  }
  return sex === "male" ? "men" : "women";
}

function sexLabel(group: AgeGroupKey, sex: SinclairSex): string {
  if (group === "u15" || group === "u17") {
    return sex === "male" ? "Chł" : "Dz";
  }
  return sex === "male" ? "M" : "K";
}

export function pickWeightClass(
  bodyweightKg: number,
  classes: readonly string[],
): string | null {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0 || classes.length === 0) {
    return null;
  }
  for (const cls of classes) {
    if (cls.startsWith("+")) return cls;
    const limit = Number(cls);
    if (Number.isFinite(limit) && bodyweightKg <= limit) return cls;
  }
  return classes[classes.length - 1] ?? null;
}

export type ResolveCategoryInput = {
  birthDate?: string | null;
  sex?: string | null;
  bodyweightKg: number;
  now?: Date;
};

/** Format jak w backendzie: `U20 M 75`, `Senior K +86`, `U15 Chł 55`. */
export function resolveWeightCategory(
  input: ResolveCategoryInput,
): string | null {
  const age = ageFromBirthDate(input.birthDate, input.now ?? new Date());
  const sex = parseSex(input.sex);
  if (age == null || sex == null) return null;

  const group = ageGroupFromAge(age);
  const key = sexKey(group, sex);
  const classes = WEIGHTLIFTING_CATEGORIES_2026[group][key] as readonly string[];
  const weight = pickWeightClass(input.bodyweightKg, classes);
  if (!weight) return null;

  return `${ageGroupLabel(group)} ${sexLabel(group, sex)} ${weight}`;
}
