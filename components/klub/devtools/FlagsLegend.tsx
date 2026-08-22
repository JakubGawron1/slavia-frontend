"use client";

import type { ReactNode } from "react";
import {
  FLAG_AUDIENCE_LABELS,
  FLAG_KIND_LABELS,
  FLAG_ROLLOUT_LABELS,
} from "@/lib/feature-flags-meta";
import type {
  FlagAudience,
  FlagKind,
  FlagRolloutStatus,
} from "@/lib/api/generated/models";
import {
  AudienceBadge,
  KindBadge,
  queryActive,
  RolloutBadge,
} from "@/components/klub/devtools/FlagBadges";

function LegendRow({ badge, hint }: { badge: ReactNode; hint: string }) {
  return (
    <div className="flex items-start gap-2">
      {badge}
      <span className="text-xs leading-snug text-paper/40">{hint}</span>
    </div>
  );
}

function LegendGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 font-display text-[10px] tracking-[0.14em] text-paper/35 uppercase">
        {title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type FlagsLegendProps = {
  query: string;
  onBadgeSearch: (term: string) => void;
};

export function FlagsLegend({ query, onBadgeSearch }: FlagsLegendProps) {
  const rolloutStatuses = Object.keys(FLAG_ROLLOUT_LABELS) as FlagRolloutStatus[];
  const kinds = Object.keys(FLAG_KIND_LABELS) as FlagKind[];
  const audiences = Object.keys(FLAG_AUDIENCE_LABELS) as FlagAudience[];

  return (
    <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
      <p>
        Superadmin przełącza flagi tutaj. Witryna czyta{" "}
        <span className="font-mono text-paper/80">GET /api/flags/public</span>,
        klub i panel —{" "}
        <span className="font-mono text-paper/80">GET /api/flags/panels</span>{" "}
        (wymaga logowania). Experimental ma ten sam przełącznik co stabilne —
        po włączeniu funkcja trafia do użytkowników. Planned / szkielet nie da
        się włączyć. Kliknięcie badge’a filtruje listę.
      </p>
      <div className="mt-4 space-y-4">
        <LegendGroup title="Wdrożenie">
          {rolloutStatuses.map((status) => {
            const { label, hint } = FLAG_ROLLOUT_LABELS[status];
            return (
              <LegendRow
                key={status}
                hint={hint}
                badge={
                  <RolloutBadge
                    status={status}
                    active={queryActive(query, label)}
                    onClick={() => onBadgeSearch(label)}
                  />
                }
              />
            );
          })}
        </LegendGroup>
        <LegendGroup title="Rodzaj">
          {kinds.map((kind) => {
            const { label, hint } = FLAG_KIND_LABELS[kind];
            return (
              <LegendRow
                key={kind}
                hint={hint}
                badge={
                  <KindBadge
                    kind={kind}
                    active={queryActive(query, label)}
                    onClick={() => onBadgeSearch(label)}
                  />
                }
              />
            );
          })}
        </LegendGroup>
        <LegendGroup title="Audience">
          {audiences.map((audience) => {
            const { label, hint } = FLAG_AUDIENCE_LABELS[audience];
            return (
              <LegendRow
                key={audience}
                hint={hint}
                badge={
                  <AudienceBadge
                    audience={audience}
                    active={queryActive(query, label)}
                    onClick={() => onBadgeSearch(label)}
                  />
                }
              />
            );
          })}
        </LegendGroup>
      </div>
    </div>
  );
}
