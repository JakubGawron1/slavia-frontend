import type { SiteStats } from "@/lib/api/generated/models";

export function StatsTab({ stats }: { stats: SiteStats }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {(
        [
          ["Konta", stats.users],
          ["Aktywne konta", stats.active_users],
          ["Profile zawodników", stats.athlete_profiles],
          ["Strony CMS", stats.cms_pages],
          ["CMS opublikowane", stats.cms_published],
          ["Wyniki (łącznie)", stats.results_total],
          ["Wyniki oczekujące", stats.results_pending],
          ["Flagi", stats.feature_flags],
          ["Logi", stats.system_logs],
        ] as const
      ).map(([label, value]) => (
        <div key={label} className="border border-paper/10 bg-paper/[0.03] px-4 py-3">
          <dt className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            {label}
          </dt>
          <dd className="mt-1 font-display text-2xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
