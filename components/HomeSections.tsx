import { HomeFaq } from "./HomeFaq";
import { AboutSection } from "./home/AboutSection";
import { GroupsSection } from "./home/GroupsSection";
import { HistorySection } from "./home/HistorySection";
import { LocationSection } from "./home/LocationSection";
import { RankingSection } from "./home/RankingSection";
import { StatsSection } from "./home/StatsSection";
import { ToolsSection } from "./home/ToolsSection";

type HomeSectionsProps = {
  blogEnabled?: boolean;
  ogloszeniaEnabled?: boolean;
  calendarEnabled?: boolean;
};

export function HomeSections({
  blogEnabled = true,
  ogloszeniaEnabled = true,
  calendarEnabled = true,
}: HomeSectionsProps) {
  return (
    <>
      <StatsSection />
      <AboutSection />
      <HistorySection />
      <GroupsSection />
      <RankingSection />
      <ToolsSection
        blogEnabled={blogEnabled}
        ogloszeniaEnabled={ogloszeniaEnabled}
        calendarEnabled={calendarEnabled}
      />
      <LocationSection
        ogloszeniaEnabled={ogloszeniaEnabled}
        calendarEnabled={calendarEnabled}
      />

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Najczęstsze pytania
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Zanim przyjdziesz po raz pierwszy
          </h2>
          <div className="mt-10">
            <HomeFaq />
          </div>
        </div>
      </section>
    </>
  );
}
