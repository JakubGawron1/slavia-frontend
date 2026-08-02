"use client";

import { useId, useMemo, useState } from "react";
import type { AthleteProfile, CompetitionResult } from "@/lib/api/generated/models";
import {
  buildChartPoints,
  formatKg,
  formatResultDate,
  formatSinclair,
  type ChartPoint,
} from "@/lib/athletes";

const W = 320;
const H = 140;

type Props = {
  profile: AthleteProfile;
  results: CompetitionResult[];
};

function Tooltip({ point }: { point: ChartPoint }) {
  const r = point.result;
  return (
    <div
      role="dialog"
      className="pointer-events-none absolute z-20 w-56 border border-mist bg-paper px-3 py-2.5 shadow-[0_12px_40px_rgba(14,16,20,0.12)]"
      style={{
        left: Math.min(Math.max(point.x - 112, 8), W - 232),
        top: Math.max(point.y - 8, 8),
        transform: "translateY(-100%)",
      }}
    >
      <p className="font-display text-[11px] tracking-[0.14em] text-brand uppercase">
        {formatResultDate(r.submitted_at)}
      </p>
      <p className="mt-1 font-display text-sm tracking-wide text-ink uppercase">
        {r.event_name}
      </p>
      {r.venue ? (
        <p className="mt-0.5 text-xs text-steel-soft">{r.venue}</p>
      ) : null}
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-steel">
        <div>
          <dt className="text-steel-soft">Rwanie</dt>
          <dd className="font-medium text-ink">{formatKg(r.snatch_kg)}</dd>
        </div>
        <div>
          <dt className="text-steel-soft">Podrzut</dt>
          <dd className="font-medium text-ink">{formatKg(r.clean_jerk_kg)}</dd>
        </div>
        <div>
          <dt className="text-steel-soft">Dwubój</dt>
          <dd className="font-medium text-ink">{formatKg(r.total_kg)}</dd>
        </div>
        <div>
          <dt className="text-steel-soft">Sinclair</dt>
          <dd className="font-medium text-brand">
            {formatSinclair(point.sinclair)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-steel-soft">
        Kat. {r.category ?? "—"}
      </p>
    </div>
  );
}

export function ProgressChart({ profile, results }: Props) {
  const gradId = useId().replace(/:/g, "");
  const [active, setActive] = useState<ChartPoint | null>(null);

  const points = useMemo(
    () => buildChartPoints(results, profile, W, H),
    [results, profile],
  );

  if (points.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-steel-soft">
        Brak zaakceptowanych wyników z zawodów.
      </p>
    );
  }

  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = [
    `M ${points[0]!.x} ${H}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1]!.x} ${H}`,
    "Z",
  ].join(" ");

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-36 w-full overflow-visible"
        role="img"
        aria-label="Progres dwuboju na zawodach"
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(200,16,46)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(200,16,46)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {area ? <path d={area} fill={`url(#${gradId})`} /> : null}
        <polyline
          fill="none"
          stroke="rgb(200,16,46)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={line}
        />
        {points.map((p) => (
          <g key={p.result.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={active?.result.id === p.result.id ? 6 : 4.5}
              fill="rgb(200,16,46)"
              stroke="rgb(248,247,244)"
              strokeWidth="2"
              className="cursor-pointer transition-[r] duration-150"
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              tabIndex={0}
              role="button"
              aria-label={`${p.result.event_name}, ${formatKg(p.totalKg)}`}
            />
          </g>
        ))}
      </svg>
      {active ? <Tooltip point={active} /> : null}
    </div>
  );
}
