"use client";

import type { PlanExercise, PlanProgressEntry } from "@/lib/api/generated/models";
import {
  DAY_LABELS,
  expandSetScheme,
  formatPrescription,
  pctOfLabel,
  resolveLoadKg,
  usesExercisePr,
} from "@/lib/plans/helpers";
import type { AthleteBests } from "@/components/plans/useAthletePlanProgress";

export function ProgressEntryRow({
  day,
  ex,
  entry,
  bests,
  today,
  onPatch,
}: {
  day: number;
  ex: PlanExercise;
  entry: PlanProgressEntry;
  bests: AthleteBests;
  today: number;
  onPatch: (patch: Partial<PlanProgressEntry>) => void;
}) {
  const selectedAlt = (ex.alternatives ?? []).find(
    (a) => a.id === entry.selected_alternative_id,
  );
  const active: PlanExercise = selectedAlt
    ? {
        ...ex,
        name: selectedAlt.name || ex.name,
        sets: selectedAlt.sets ?? ex.sets,
        reps: selectedAlt.reps ?? ex.reps,
        load_kg: selectedAlt.load_kg ?? ex.load_kg,
        load_pct: selectedAlt.load_pct ?? ex.load_pct,
        pct_of: selectedAlt.pct_of ?? ex.pct_of,
        set_scheme: ex.set_scheme,
      }
    : ex;
  const scheme = expandSetScheme(active);
  const isToday = day === today;
  const hasExercisePr = usesExercisePr(active) || scheme.some((s) => usesExercisePr(s));

  return (
    <li
      className={
        isToday
          ? "border border-brand/40 bg-brand/[0.07] p-4"
          : "border border-paper/10 bg-paper/[0.03] p-4"
      }
    >
      <p className="mb-2 text-[10px] tracking-wider text-paper/40 uppercase">
        {DAY_LABELS[day] ?? day}
        {isToday ? " · dziś" : ""}
        {ex.is_warmup ? " · warm-up" : ""}
      </p>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1"
          checked={Boolean(entry.completed)}
          onChange={() => onPatch({ completed: !entry.completed })}
        />
        <span className="min-w-0 flex-1">
          <span className="font-medium">{active.name}</span>
          <span className="mt-1 block text-sm text-paper/55">
            {formatPrescription(active, bests)}
          </span>
          {hasExercisePr ? (
            <span className="mt-1 block text-xs text-paper/45">
              Dobierz kg według własnego PR tego ruchu (nie ma go w profilu).
            </span>
          ) : null}
          {ex.notes ? (
            <span className="mt-1 block text-sm text-paper/70">Trener: {ex.notes}</span>
          ) : null}
        </span>
      </label>

      {scheme.length > 0 ? (
        <ol className="mt-3 space-y-1 border-t border-paper/10 pt-3 text-sm">
          {scheme.map((s, i) => {
            const kg = resolveLoadKg(s, bests);
            return (
              <li
                key={`${ex.id}-set-${i}`}
                className="flex flex-wrap gap-x-3 gap-y-0.5 text-paper/70"
              >
                <span className="w-10 text-paper/40">{s.is_warmup ? "W" : `S${i + 1}`}</span>
                <span>{s.reps ?? "—"} powt.</span>
                {s.load_pct != null ? (
                  <span>
                    {s.load_pct}% {pctOfLabel(s.pct_of, active.name)}
                  </span>
                ) : null}
                {kg != null ? <span className="text-paper">{kg} kg</span> : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      {(ex.alternatives ?? []).length > 0 ? (
        <div className="mt-3">
          <label className="block space-y-1">
            <span className="text-xs text-paper/45">Zamiennik (kontuzja)</span>
            <select
              className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm"
              value={entry.selected_alternative_id ?? ""}
              onChange={(e) =>
                onPatch({ selected_alternative_id: e.target.value || null })
              }
            >
              <option value="">Ćwiczenie główne</option>
              {(ex.alternatives ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || "Zamiennik"}
                  {a.reason ? ` — ${a.reason}` : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
            Faktyczne obciążenie (kg)
          </span>
          <input
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            type="number"
            step="0.5"
            value={entry.actual_load_kg ?? ""}
            onChange={(e) =>
              onPatch({ actual_load_kg: e.target.value ? Number(e.target.value) : null })
            }
          />
        </label>
        <label className="space-y-1">
          <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
            Notatka
          </span>
          <input
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            value={entry.athlete_note ?? ""}
            onChange={(e) => onPatch({ athlete_note: e.target.value || null })}
          />
        </label>
      </div>
    </li>
  );
}
