"use client";

import type { AthleteProfile, CompetitionResult } from "@/lib/api/generated/models";
import {
  buildAthleteViews,
  topSinclairPodium,
} from "@/lib/athletes";
import { AthleteCard } from "@/components/zawodnicy/AthleteCard";
import { SinclairPodium } from "@/components/zawodnicy/SinclairPodium";

type Props = {
  profiles: AthleteProfile[];
  results: CompetitionResult[];
};

export function AthletesPageContent({ profiles, results }: Props) {
  const views = buildAthleteViews(profiles, results);
  const podium = topSinclairPodium(views, 3);

  return (
    <>
      <section className="border-b border-mist bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Ranking
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink uppercase md:text-4xl">
            Top 3 Sinclair
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel-soft">
            Najlepszy zaakceptowany wynik z zawodów, przeliczony w locie wzorem
            IWF 2025–2028 — niezależnie od kategorii wagowej.
          </p>
          <div className="mt-12">
            <SinclairPodium athletes={podium} />
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Kadra
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink uppercase md:text-4xl">
            Zawodnicy
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel-soft">
            Profile zawodników klubu — wiek, kategoria i progres startów na
            zawodach.
          </p>

          {views.length === 0 ? (
            <p className="mt-10 text-base text-steel-soft">
              Brak profili zawodników. Trener może je dodać w panelu klubowym.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {views.map((athlete) => (
                <AthleteCard key={athlete.profile.id} athlete={athlete} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
