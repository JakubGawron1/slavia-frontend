import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { listPublicFlags } from "@/lib/api/generated/default/default";
import {
  listPublicProfiles,
  listPublicResults,
  listPublicTrainingSchedule,
} from "@/lib/api/generated/public/public";
import type {
  AthleteProfile,
  CompetitionResult,
  PublicFlag,
  TrainingScheduleDefaults,
} from "@/lib/api/generated/models";
import {
  buildHomePublicData,
  homePublicDataFallback,
  type HomePublicData,
} from "@/lib/home-stats";
import { isFlagEnabled } from "@/lib/public-flags";

export const revalidate = 60;

async function fetchPublicFlags(): Promise<PublicFlag[] | undefined> {
  try {
    const result = await listPublicFlags();
    return result.data;
  } catch {
    return undefined;
  }
}

async function fetchPublicTrainingSchedule(): Promise<TrainingScheduleDefaults | null> {
  try {
    const result = await listPublicTrainingSchedule();
    return result.data ?? null;
  } catch {
    return null;
  }
}

async function fetchHomePublicData(): Promise<HomePublicData> {
  try {
    const [profilesRes, resultsRes, schedule] = await Promise.all([
      listPublicProfiles(),
      listPublicResults(),
      fetchPublicTrainingSchedule(),
    ]);
    const profiles: AthleteProfile[] = profilesRes.data ?? [];
    const results: CompetitionResult[] = resultsRes.data ?? [];
    return buildHomePublicData(profiles, results, schedule);
  } catch {
    return homePublicDataFallback();
  }
}

export default async function Home() {
  const [flags, home] = await Promise.all([
    fetchPublicFlags(),
    fetchHomePublicData(),
  ]);
  const blogEnabled = isFlagEnabled(flags, "public_blog");
  const ogloszeniaEnabled = isFlagEnabled(flags, "announcements_board");
  const calendarEnabled = isFlagEnabled(flags, "public_calendar");

  return (
    <>
      <Hero blogEnabled={blogEnabled} calendarEnabled={calendarEnabled} />
      <HomeSections
        stats={home.stats}
        ranking={home.ranking}
        blogEnabled={blogEnabled}
        ogloszeniaEnabled={ogloszeniaEnabled}
        calendarEnabled={calendarEnabled}
      />
    </>
  );
}
