"use client";

import type { AthleteView } from "@/lib/athletes";
import { formatKg, formatSinclair } from "@/lib/athletes";

type Props = {
  athletes: AthleteView[];
};

function Photo({
  athlete,
  size,
  place,
}: {
  athlete: AthleteView;
  size: number;
  place: number;
}) {
  const url = athlete.profile.photo_url?.trim();
  const ring =
    place === 1
      ? "ring-brand"
      : place === 2
        ? "ring-steel-soft/50"
        : "ring-steel/35";

  const initials = athlete.profile.display_name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-mist ring-4 ${ring}`}
      style={{ width: size, height: size }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={athlete.profile.display_name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-steel/15 to-ink/5">
          <span className="font-display text-xl tracking-wide text-steel/45 uppercase sm:text-2xl">
            {initials || "?"}
          </span>
        </div>
      )}
    </div>
  );
}

function PodiumColumn({
  athlete,
  place,
}: {
  athlete: AthleteView;
  place: 1 | 2 | 3;
}) {
  const isFirst = place === 1;
  const stepH =
    place === 1 ? "h-36 sm:h-44" : place === 2 ? "h-28 sm:h-36" : "h-24 sm:h-28";
  const photo = isFirst ? 112 : 88;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`mb-3 flex flex-col items-center ${
          isFirst ? "animate-rise" : "animate-rise-delay-1"
        }`}
      >
        <Photo athlete={athlete} size={photo} place={place} />
        <p
          className={`mt-3 text-center font-display tracking-wide text-ink uppercase ${
            isFirst ? "text-lg sm:text-xl" : "text-sm sm:text-base"
          }`}
        >
          {athlete.profile.display_name}
        </p>
        <p className="mt-1 text-center text-xs text-steel-soft sm:text-sm">
          {athlete.profile.category ?? "—"}
          {athlete.bestTotalKg != null ? ` · ${formatKg(athlete.bestTotalKg)}` : ""}
        </p>
        <p
          className={`mt-2 font-display tracking-tight text-brand ${
            isFirst ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {formatSinclair(athlete.bestSinclair)}
        </p>
      </div>

      <div
        className={`relative flex w-full ${stepH} items-start justify-center border border-mist bg-gradient-to-b from-paper to-mist/50 pt-4`}
      >
        <span
          className={`font-display leading-none text-brand/90 ${
            isFirst ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {place}
        </span>
        {isFirst ? (
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand"
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}

export function SinclairPodium({ athletes }: Props) {
  if (athletes.length === 0) {
    return (
      <p className="text-base text-steel-soft">
        Brak wyników z zawodów do rankingu Sinclair. Po akceptacji startów podium
        pojawi się automatycznie.
      </p>
    );
  }

  const first = athletes[0];
  const second = athletes[1];
  const third = athletes[2];

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-6">
      <div>
        {second ? <PodiumColumn athlete={second} place={2} /> : null}
      </div>
      <div>{first ? <PodiumColumn athlete={first} place={1} /> : null}</div>
      <div>{third ? <PodiumColumn athlete={third} place={3} /> : null}</div>
    </div>
  );
}
