import type {
  AthleteProfile,
  CompetitionResult,
  TrainingScheduleDefaults,
} from "@/lib/api/generated/models";
import {
  buildAthleteViews,
  formatKg,
  formatSinclair,
  parseSex,
  topSinclairPodium,
} from "@/lib/athletes";
import { getWeekdayLabels } from "@/lib/calendar";
import {
  ranking as fallbackRanking,
  stats as fallbackStats,
} from "@/components/home/data";

export type HomeStat = {
  label: string;
  value: string;
  note: string;
};

export type HomeRankingRow = {
  place: string;
  name: string;
  meta: string;
  total: string;
  sinclair: string;
};

export type HomePublicData = {
  stats: HomeStat[];
  ranking: HomeRankingRow[];
};

const DEFAULT_WEEKDAYS = [1, 3, 5];

function formatAthleteSexNote(profiles: AthleteProfile[]): string {
  let female = 0;
  let male = 0;
  for (const p of profiles) {
    const sex = parseSex(p.sex);
    if (sex === "female") female += 1;
    else if (sex === "male") male += 1;
  }
  if (female === 0 && male === 0) {
    return profiles.length === 0 ? "brak danych" : "kadra klubowa";
  }
  return `w tym ${female} K · ${male} M`;
}

function formatTrainingNote(weekdays: number[]): string {
  const labels = getWeekdayLabels();
  const parts = [...new Set(weekdays)]
    .filter((d) => d >= 1 && d <= 7)
    .sort((a, b) => a - b)
    .map((d) => labels[d - 1]);
  return parts.length > 0 ? parts.join(" · ") : "wg kalendarza";
}

function buildHomeRanking(
  profiles: AthleteProfile[],
  results: CompetitionResult[],
): HomeRankingRow[] {
  const podium = topSinclairPodium(buildAthleteViews(profiles, results), 3);
  return podium.map((v, i) => ({
    place: String(i + 1),
    name: v.profile.display_name,
    meta: v.profile.category?.trim() || "—",
    total: formatKg(v.bestTotalKg),
    sinclair: formatSinclair(v.bestSinclair),
  }));
}

/** Statystyki paska na stronie głównej z publicznych danych API. */
export function buildHomeStats(
  profiles: AthleteProfile[],
  results: CompetitionResult[],
  schedule: TrainingScheduleDefaults | null,
): HomeStat[] {
  const views = buildAthleteViews(profiles, results);
  const bestSinclair = views.reduce<number | null>((best, v) => {
    if (v.bestSinclair == null) return best;
    return best == null || v.bestSinclair > best ? v.bestSinclair : best;
  }, null);

  let bestTotalKg: number | null = null;
  for (const r of results) {
    const total = r.total_kg;
    if (total == null || !Number.isFinite(total) || total <= 0) continue;
    if (bestTotalKg == null || total > bestTotalKg) bestTotalKg = total;
  }

  const weekdays =
    schedule?.weekdays?.filter((d) => d >= 1 && d <= 7) ?? DEFAULT_WEEKDAYS;
  const trainingCount = new Set(weekdays).size;

  return [
    {
      label: "Aktywni zawodnicy",
      value: String(profiles.length),
      note: formatAthleteSexNote(profiles),
    },
    {
      label: "Najlepszy Sinclair",
      value: formatSinclair(bestSinclair),
      note: "w klubie (2025–2028)",
    },
    {
      label: "Najwyższa suma",
      value: formatKg(bestTotalKg),
      note: "klubowy rekord PB",
    },
    {
      label: "Treningi",
      value: `${trainingCount}×`,
      note: formatTrainingNote(weekdays),
    },
  ];
}

export function buildHomePublicData(
  profiles: AthleteProfile[],
  results: CompetitionResult[],
  schedule: TrainingScheduleDefaults | null,
): HomePublicData {
  return {
    stats: buildHomeStats(profiles, results, schedule),
    ranking: buildHomeRanking(profiles, results),
  };
}

export function homePublicDataFallback(): HomePublicData {
  return {
    stats: fallbackStats.map((s) => ({ ...s })),
    ranking: fallbackRanking.map((r) => ({ ...r })),
  };
}
