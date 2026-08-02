"use client";

import type { AthleteView } from "@/lib/athletes";
import { ProgressChart } from "@/components/zawodnicy/ProgressChart";

type Props = {
  athlete: AthleteView;
};

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  const url = photoUrl?.trim();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-ink/5 via-steel/10 to-brand/10">
          <span className="font-display text-4xl tracking-wide text-steel/40 uppercase">
            {initials || "?"}
          </span>
          <span className="mt-2 font-display text-[10px] tracking-[0.2em] text-steel/35 uppercase">
            Brak zdjęcia
          </span>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent"
        aria-hidden
      />
    </div>
  );
}

export function AthleteCard({ athlete }: Props) {
  const { profile, results, age } = athlete;
  const description =
    profile.notes?.trim() ||
    "Zawodnik CKS Slavia — dwubój olimpijski.";

  return (
    <article className="group flex flex-col border border-mist bg-paper transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_16px_48px_rgba(14,16,20,0.06)]">
      <Avatar name={profile.display_name} photoUrl={profile.photo_url} />

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
        <h3 className="font-display text-xl leading-tight tracking-wide text-ink uppercase md:text-2xl">
          {profile.display_name}
        </h3>
        <p className="mt-1 text-sm text-steel-soft">
          {age != null ? `${age} lat` : "Wiek —"}
          {" · "}
          Kat. {profile.category?.trim() || "—"}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-steel">
          {description}
        </p>

        <div className="mt-5 border-t border-mist pt-4">
          <p className="font-display text-[11px] tracking-[0.18em] text-brand uppercase">
            Progres startów
          </p>
          <div className="mt-2">
            <ProgressChart profile={profile} results={results} />
          </div>
        </div>
      </div>
    </article>
  );
}
