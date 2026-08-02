import type { Metadata } from "next";
import { AthletesPageContent } from "@/components/zawodnicy/AthletesPageContent";
import {
  listPublicProfiles,
  listPublicResults,
} from "@/lib/api/generated/public/public";
import type {
  AthleteProfile,
  CompetitionResult,
} from "@/lib/api/generated/models";

export const metadata: Metadata = {
  title: "Zawodnicy",
  description:
    "Reprezentacja zawodników CKS Slavia Ruda Śląska — podium Sinclair, profile i progres startów.",
};

export const revalidate = 60;

export default async function ZawodnicyPage() {
  let profiles: AthleteProfile[] = [];
  let results: CompetitionResult[] = [];
  let loadError: string | null = null;

  try {
    const [profilesRes, resultsRes] = await Promise.all([
      listPublicProfiles(),
      listPublicResults(),
    ]);
    profiles = profilesRes.data ?? [];
    results = resultsRes.data ?? [];
  } catch {
    loadError =
      "Nie udało się pobrać listy zawodników. Spróbuj ponownie później.";
  }

  return (
    <section className="relative isolate bg-background pb-0">
      <div className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(200,16,46,0.2)_0%,transparent_48%),linear-gradient(160deg,#0e1014_0%,#1a1f26_100%)]"
          aria-hidden="true"
        />
        <div
          className="texture-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 md:px-8 md:pt-32 md:pb-16">
          <p className="animate-rise font-display text-sm tracking-[0.28em] text-brand uppercase">
            Kadra
          </p>
          <div className="animate-bar mt-4 h-1 w-20 bg-brand" />
          <h1 className="animate-rise-delay-1 mt-6 max-w-3xl font-display text-4xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-5xl md:text-6xl">
            Zawodnicy
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-paper/75 md:text-lg">
            Podium Sinclair klubu oraz karty zawodników z progresem wyników z
            zawodów.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="text-base text-steel-soft" role="alert">
            {loadError}
          </p>
        </div>
      ) : (
        <AthletesPageContent profiles={profiles} results={results} />
      )}
    </section>
  );
}
