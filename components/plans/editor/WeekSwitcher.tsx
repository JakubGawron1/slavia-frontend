"use client";

import { PLAN_FIELD } from "@/lib/plans/labels";

export function WeekSwitcher({
  weekIndex,
  weeks,
  onChange,
}: {
  weekIndex: number;
  weeks: number[];
  onChange: (index: number) => void;
}) {
  if (weeks.length < 1) return null;
  const pos = weeks.indexOf(weekIndex);
  const prev = pos > 0 ? weeks[pos - 1] : undefined;
  const next = pos >= 0 && pos < weeks.length - 1 ? weeks[pos + 1] : undefined;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        className="px-2 py-2 font-display text-sm text-paper/35 hover:text-paper disabled:opacity-20"
        disabled={prev == null}
        onClick={() => prev != null && onChange(prev)}
        aria-label="Poprzedni tydzień"
      >
        ‹
      </button>
      {weeks.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={
            weekIndex === n
              ? "bg-brand px-3 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase"
              : "border border-paper/15 px-3 py-2 font-display text-xs tracking-[0.12em] text-paper/50 uppercase transition-colors hover:border-paper/35 hover:text-paper"
          }
        >
          T{n}
        </button>
      ))}
      <button
        type="button"
        className="px-2 py-2 font-display text-sm text-paper/35 hover:text-paper disabled:opacity-20"
        disabled={next == null}
        onClick={() => next != null && onChange(next)}
        aria-label="Następny tydzień"
      >
        ›
      </button>
      <label className="sr-only">
        Tydzień
        <select
          className={PLAN_FIELD}
          value={weekIndex}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {weeks.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
