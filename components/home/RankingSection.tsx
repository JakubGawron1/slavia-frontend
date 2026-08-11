import Link from "next/link";
import type { HomeRankingRow } from "@/lib/home-stats";

type Props = {
  ranking: HomeRankingRow[];
};

export function RankingSection({ ranking }: Props) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Mistrzowie klubu
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Top 3 Sinclair
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
          Podium klubowe według punktów Sinclair (IWF 2025–2028) — niezależnie
          od kategorii wagowej i płci.
        </p>

        {ranking.length === 0 ? (
          <p className="mt-12 border-y border-mist py-8 text-base text-steel-soft">
            Brak zaakceptowanych wyników zawodów do rankingu Sinclair.
          </p>
        ) : (
          <ol className="mt-12 divide-y divide-mist border-y border-mist">
            {ranking.map((row) => (
              <li
                key={`${row.place}-${row.name}`}
                className="grid gap-3 py-6 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-6"
              >
                <span className="font-display text-3xl text-brand md:text-4xl">
                  {row.place}
                </span>
                <div>
                  <p className="font-display text-xl tracking-wide text-ink uppercase md:text-2xl">
                    {row.name}
                  </p>
                  <p className="mt-1 text-sm text-steel-soft">{row.meta}</p>
                </div>
                <p className="text-steel-soft">
                  Dwubój{" "}
                  <span className="font-display text-ink uppercase">
                    {row.total}
                  </span>
                </p>
                <p className="font-display text-2xl tracking-tight text-brand md:text-right md:text-3xl">
                  {row.sinclair}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-8">
          <Link
            href="/zawodnicy"
            className="inline-flex items-center gap-2 font-display text-sm tracking-[0.14em] text-ink uppercase transition-colors hover:text-brand"
          >
            Zobacz zawodników
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
