import type { HomeStat } from "@/lib/home-stats";

type Props = {
  stats: HomeStat[];
};

export function StatsSection({ stats }: Props) {
  return (
    <section className="border-b border-mist bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-mist px-5 py-8 odd:border-r lg:border-r lg:border-b-0 lg:last:border-r-0"
          >
            <p className="font-display text-xs tracking-[0.18em] text-brand uppercase">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-steel-soft">{stat.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
