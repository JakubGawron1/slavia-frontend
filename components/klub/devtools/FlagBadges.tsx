"use client";

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

export function queryActive(query: string, term: string): boolean {
  return query.trim().toLowerCase() === term.trim().toLowerCase();
}

function FlagBadge({
  children,
  title,
  tone,
  active,
  onClick,
}: {
  children: string;
  title?: string;
  tone: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = `inline-flex items-center border px-2 py-0.5 font-display text-[10px] tracking-[0.12em] uppercase ${tone} ${
    onClick ? "cursor-pointer hover:border-paper/50" : ""
  } ${active ? "ring-1 ring-brand/70" : ""}`;

  if (onClick) {
    return (
      <button type="button" title={title} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <span title={title} className={className}>
      {children}
    </span>
  );
}

function rolloutTone(status: FlagRolloutStatus): string {
  return status === "wired"
    ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-100"
    : status === "partial"
      ? "border-amber-500/40 bg-amber-500/12 text-amber-100"
      : status === "planned"
        ? "border-paper/20 bg-paper/5 text-paper/55"
        : "border-paper/25 bg-paper/[0.04] text-paper/65";
}

export function RolloutBadge({
  status,
  active,
  onClick,
}: {
  status: FlagRolloutStatus;
  active?: boolean;
  onClick?: () => void;
}) {
  const meta = FLAG_ROLLOUT_LABELS[status];
  return (
    <FlagBadge
      title={meta.hint}
      tone={rolloutTone(status)}
      active={active}
      onClick={onClick}
    >
      {meta.label}
    </FlagBadge>
  );
}

export function KindBadge({
  kind,
  active,
  onClick,
}: {
  kind: FlagKind;
  active?: boolean;
  onClick?: () => void;
}) {
  const meta = FLAG_KIND_LABELS[kind];
  const tone =
    kind === "experimental"
      ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
      : "border-paper/20 bg-paper/5 text-paper/70";
  return (
    <FlagBadge title={meta.hint} tone={tone} active={active} onClick={onClick}>
      {meta.label}
    </FlagBadge>
  );
}

export function AudienceBadge({
  audience,
  active,
  onClick,
}: {
  audience: FlagAudience;
  active?: boolean;
  onClick?: () => void;
}) {
  const meta = FLAG_AUDIENCE_LABELS[audience];
  return (
    <FlagBadge
      title={meta.hint}
      tone="border-paper/20 text-paper/55"
      active={active}
      onClick={onClick}
    >
      {meta.label}
    </FlagBadge>
  );
}
