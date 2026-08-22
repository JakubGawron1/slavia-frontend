"use client";

import {
  FLAG_AUDIENCE_LABELS,
  FLAG_KIND_LABELS,
  FLAG_ROLLOUT_LABELS,
} from "@/lib/feature-flags-meta";
import type { FeatureFlag } from "@/lib/api/generated/models";
import {
  AudienceBadge,
  KindBadge,
  queryActive,
  RolloutBadge,
} from "@/components/klub/devtools/FlagBadges";

export function canToggle(flag: FeatureFlag): boolean {
  return flag.rollout_status === "wired" || flag.rollout_status === "partial";
}

export function FlagRow({
  flag,
  onToggle,
  pending,
  query,
  onBadgeSearch,
}: {
  flag: FeatureFlag;
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
  query: string;
  onBadgeSearch: (term: string) => void;
}) {
  const toggleable = canToggle(flag);
  const rolloutLabel = FLAG_ROLLOUT_LABELS[flag.rollout_status].label;
  const kindLabel = FLAG_KIND_LABELS[flag.kind].label;
  const audienceLabel = FLAG_AUDIENCE_LABELS[flag.audience].label;
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-4 border px-4 py-4 ${
        toggleable
          ? "border-paper/10"
          : "border-paper/10 bg-paper/[0.02] opacity-70"
      }`}
    >
      <div className="min-w-0 max-w-xl space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-paper">{flag.label}</p>
          <RolloutBadge
            status={flag.rollout_status}
            active={queryActive(query, rolloutLabel)}
            onClick={() => onBadgeSearch(rolloutLabel)}
          />
          <KindBadge
            kind={flag.kind}
            active={queryActive(query, kindLabel)}
            onClick={() => onBadgeSearch(kindLabel)}
          />
          <AudienceBadge
            audience={flag.audience}
            active={queryActive(query, audienceLabel)}
            onClick={() => onBadgeSearch(audienceLabel)}
          />
        </div>
        <p className="text-sm leading-relaxed text-paper/60">{flag.description}</p>
        <p className="font-mono text-[11px] text-paper/35">
          {flag.key}
          {flag.updated_at
            ? ` · aktualizacja ${new Date(flag.updated_at).toLocaleString("pl-PL")}`
            : null}
        </p>
      </div>
      {toggleable ? (
        <button
          type="button"
          onClick={() => onToggle(flag)}
          disabled={pending}
          className={
            flag.enabled
              ? "shrink-0 bg-brand px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
              : "shrink-0 border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
          }
        >
          {flag.enabled ? "Włączone" : "Wyłączone"}
        </button>
      ) : (
        <p className="shrink-0 font-display text-[10px] tracking-[0.12em] text-paper/40 uppercase">
          W przygotowaniu
        </p>
      )}
    </div>
  );
}
