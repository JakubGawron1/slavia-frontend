import type { AthleteProfile, CompetitionResult } from "@/lib/api/generated/models";
import {
  formatPoints,
  sinclairTotal,
  type SinclairSex,
} from "@/lib/sinclair";

export type ChartPoint = {
  result: CompetitionResult;
  date: Date;
  totalKg: number;
  sinclair: number | null;
  x: number;
  y: number;
};

export type AthleteView = {
  profile: AthleteProfile;
  results: CompetitionResult[];
  bestSinclair: number | null;
  bestTotalKg: number | null;
  age: number | null;
};

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase("pl");
}

export function parseSex(value: string | null | undefined): SinclairSex | null {
  if (!value) return null;
  const s = value.trim().toLowerCase();
  if (s === "male" || s === "m" || s === "mezczyzna" || s === "mężczyzna") {
    return "male";
  }
  if (s === "female" || s === "f" || s === "kobieta" || s === "k") {
    return "female";
  }
  return null;
}

export function ageFromBirthDate(
  birthDate: string | null | undefined,
  now = new Date(),
): number | null {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 120 ? age : null;
}

export function resultBelongsToProfile(
  result: CompetitionResult,
  profile: AthleteProfile,
): boolean {
  if (
    result.user_id &&
    profile.user_id &&
    profile.user_id !== "manual" &&
    result.user_id === profile.user_id
  ) {
    return true;
  }
  return normalizeName(result.athlete_name) === normalizeName(profile.display_name);
}

export function computeResultSinclair(
  result: CompetitionResult,
  profile: AthleteProfile,
): number | null {
  const total = result.total_kg;
  if (total == null || !Number.isFinite(total) || total <= 0) return null;

  const bw = result.bodyweight_kg ?? profile.bodyweight_kg;
  const sex = parseSex(profile.sex);
  if (bw == null || sex == null) return null;

  const points = sinclairTotal(total, bw, sex);
  return Number.isFinite(points) ? points : null;
}

export function buildAthleteViews(
  profiles: AthleteProfile[],
  results: CompetitionResult[],
): AthleteView[] {
  return profiles
    .map((profile) => {
      const athleteResults = results
        .filter((r) => resultBelongsToProfile(r, profile))
        .sort(
          (a, b) =>
            new Date(a.submitted_at).getTime() -
            new Date(b.submitted_at).getTime(),
        );

      let bestSinclair: number | null = null;
      let bestTotalKg: number | null = null;
      for (const r of athleteResults) {
        const s = computeResultSinclair(r, profile);
        if (s != null && (bestSinclair == null || s > bestSinclair)) {
          bestSinclair = s;
          bestTotalKg = r.total_kg ?? null;
        }
      }

      return {
        profile,
        results: athleteResults,
        bestSinclair,
        bestTotalKg,
        age: ageFromBirthDate(profile.birth_date),
      };
    })
    .sort((a, b) =>
      a.profile.display_name.localeCompare(b.profile.display_name, "pl"),
    );
}

export function topSinclairPodium(views: AthleteView[], limit = 3): AthleteView[] {
  return [...views]
    .filter((v) => v.bestSinclair != null)
    .sort((a, b) => (b.bestSinclair ?? 0) - (a.bestSinclair ?? 0))
    .slice(0, limit);
}

export function formatKg(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} kg`;
}

export function formatSinclair(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return formatPoints(value);
}

export function formatResultDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Punkty wykresu progresu (oś Y = dwubój). */
export function buildChartPoints(
  results: CompetitionResult[],
  profile: AthleteProfile,
  width: number,
  height: number,
  pad = 16,
): ChartPoint[] {
  const withTotal = results.filter(
    (r) => r.total_kg != null && Number.isFinite(r.total_kg) && r.total_kg > 0,
  );
  if (withTotal.length === 0) return [];

  const dates = withTotal.map((r) => new Date(r.submitted_at).getTime());
  const totals = withTotal.map((r) => r.total_kg as number);
  const minT = Math.min(...totals);
  const maxT = Math.max(...totals);
  const minD = Math.min(...dates);
  const maxD = Math.max(...dates);
  const spanT = maxT - minT || 1;
  const spanD = maxD - minD || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  return withTotal.map((result, i) => {
    const date = new Date(result.submitted_at);
    const totalKg = result.total_kg as number;
    const x =
      withTotal.length === 1
        ? width / 2
        : pad + ((date.getTime() - minD) / spanD) * innerW;
    const y = pad + (1 - (totalKg - minT) / spanT) * innerH;
    return {
      result,
      date,
      totalKg,
      sinclair: computeResultSinclair(result, profile),
      x: Number.isFinite(x) ? x : pad + (i / Math.max(withTotal.length - 1, 1)) * innerW,
      y: Number.isFinite(y) ? y : height / 2,
    };
  });
}
