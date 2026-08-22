"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PLAN_BTN_GHOST,
  PLAN_EYEBROW,
  PLAN_FIELD,
  WEEKDAY_LONG,
  WEEKDAY_SHORT,
} from "@/lib/plans/labels";

export function CopyToolbar({
  weekIndex,
  weeks,
  weekdays,
  onCopyDayToWeek,
  onCopyDayToAll,
  onCopyWeekTo,
  onCopyWeekToAll,
}: {
  weekIndex: number;
  weeks: number[];
  weekdays: number[];
  onCopyDayToWeek: (weekday: number, toWeek: number) => void;
  onCopyDayToAll: (weekday: number) => void;
  onCopyWeekTo: (toWeek: number) => void;
  onCopyWeekToAll: () => void;
}) {
  const otherWeeks = useMemo(
    () => weeks.filter((n) => n !== weekIndex),
    [weeks, weekIndex],
  );
  const [weekday, setWeekday] = useState(weekdays[0] ?? 1);
  const [dayTarget, setDayTarget] = useState(otherWeeks[0] ?? weekIndex);
  const [weekTarget, setWeekTarget] = useState(otherWeeks[0] ?? weekIndex);

  useEffect(() => {
    const next = otherWeeks[0];
    if (next == null) return;
    setDayTarget((t) => (otherWeeks.includes(t) ? t : next));
    setWeekTarget((t) => (otherWeeks.includes(t) ? t : next));
  }, [otherWeeks]);

  const day = weekdays.includes(weekday) ? weekday : (weekdays[0] ?? 1);
  const canCopyOut = otherWeeks.length > 0;
  const field = `${PLAN_FIELD} mt-1 w-auto min-w-28`;

  return (
    <details className="border border-paper/10 bg-paper/2 open:bg-paper/3">
      <summary className="cursor-pointer px-4 py-3 font-display text-[10px] tracking-[0.16em] text-paper/45 uppercase">
        Kopiowanie dnia i tygodnia
      </summary>
      <div className="grid gap-6 border-t border-paper/10 px-4 py-4 text-sm text-paper/70 md:grid-cols-2">
        <div className="space-y-3">
          <p className={PLAN_EYEBROW}>Dzień</p>
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col text-[11px] text-paper/45">
              Źródło
              <select
                className={field}
                value={day}
                onChange={(e) => setWeekday(Number(e.target.value))}
              >
                {weekdays.map((d) => (
                  <option key={d} value={d}>
                    {WEEKDAY_LONG[d]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-[11px] text-paper/45">
              do tygodnia
              <select
                className={field}
                value={dayTarget}
                disabled={!canCopyOut}
                onChange={(e) => setDayTarget(Number(e.target.value))}
              >
                {otherWeeks.map((n) => (
                  <option key={n} value={n}>
                    T{n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={PLAN_BTN_GHOST}
              disabled={!canCopyOut}
              onClick={() => onCopyDayToWeek(day, dayTarget)}
            >
              {WEEKDAY_SHORT[day]} T{weekIndex} → T{dayTarget}
            </button>
            <button
              type="button"
              className={PLAN_BTN_GHOST}
              onClick={() => onCopyDayToAll(day)}
            >
              {WEEKDAY_SHORT[day]} → wszystkie {WEEKDAY_SHORT[day]}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className={PLAN_EYEBROW}>Tydzień {weekIndex}</p>
          <label className="flex w-fit flex-col text-[11px] text-paper/45">
            do tygodnia
            <select
              className={field}
              value={weekTarget}
              disabled={!canCopyOut}
              onChange={(e) => setWeekTarget(Number(e.target.value))}
            >
              {otherWeeks.map((n) => (
                <option key={n} value={n}>
                  T{n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={PLAN_BTN_GHOST}
              disabled={!canCopyOut}
              onClick={() => onCopyWeekTo(weekTarget)}
            >
              T{weekIndex} → T{weekTarget}
            </button>
            <button
              type="button"
              className={PLAN_BTN_GHOST}
              disabled={!canCopyOut}
              onClick={onCopyWeekToAll}
            >
              T{weekIndex} → wszystkie
            </button>
          </div>
        </div>
      </div>
    </details>
  );
}
