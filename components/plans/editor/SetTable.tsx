"use client";

import type { PlanSet } from "@/lib/api/generated/models";
import { LoadPicker } from "@/components/plans/editor/LoadPicker";
import { RPE_OPTIONS } from "@/lib/plans/labels";

const CELL =
  "border-0 bg-transparent px-1 py-1 text-sm text-paper outline-none focus:text-brand";

function newSet(kind: PlanSet["kind"]): PlanSet {
  return {
    id: crypto.randomUUID(),
    kind,
    reps: kind === "warmup" ? "5" : "3",
    load:
      kind === "warmup"
        ? { mode: "bar" }
        : { mode: "pct", pct: 70, of: "exercise" },
    rpe: null,
  };
}

export function SetTable({
  sets,
  onChange,
}: {
  sets: PlanSet[];
  onChange: (sets: PlanSet[]) => void;
}) {
  function patch(id: string, next: Partial<PlanSet>) {
    onChange(sets.map((s) => (s.id === id ? { ...s, ...next } : s)));
  }

  let workN = 0;
  let warmN = 0;

  return (
    <div>
      <div className="mb-2 hidden grid-cols-[4.5rem_3.5rem_minmax(0,1fr)_3.5rem_2.5rem] gap-2 font-display text-[10px] tracking-[0.14em] text-paper/30 uppercase sm:grid">
        <span>Seria</span>
        <span>Powt.</span>
        <span>Ciężar</span>
        <span>RPE</span>
        <span />
      </div>
      <div className="divide-y divide-paper/10">
        {sets.map((s) => {
          const warmup = (s.kind ?? "work") === "warmup";
          if (warmup) warmN += 1;
          else workN += 1;
          const label = warmup ? `W${warmN}` : String(workN);
          return (
            <div
              key={s.id}
              className="grid grid-cols-2 items-center gap-2 py-2.5 sm:grid-cols-[4.5rem_3.5rem_minmax(0,1fr)_3.5rem_2.5rem]"
            >
              <button
                type="button"
                className={`justify-self-start font-display text-xs tracking-[0.12em] uppercase ${
                  warmup ? "text-paper/35" : "text-brand"
                }`}
                onClick={() =>
                  patch(s.id, { kind: warmup ? "work" : "warmup" })
                }
                aria-label={
                  warmup ? "Rozgrzewka — kliknij, by zrobić roboczą" : "Seria robocza — kliknij, by zrobić rozgrzewkę"
                }
              >
                {label}
              </button>
              <input
                className={CELL}
                value={s.reps}
                onChange={(e) => patch(s.id, { reps: e.target.value })}
                aria-label="Powtórzenia"
              />
              <div className="col-span-2 sm:col-span-1">
                <LoadPicker
                  value={s.load}
                  previewKg={s.resolved_kg}
                  onChange={(load) => patch(s.id, { load })}
                />
              </div>
              <select
                className={CELL}
                value={s.rpe ?? ""}
                onChange={(e) =>
                  patch(s.id, {
                    rpe: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                aria-label="RPE"
              >
                {RPE_OPTIONS.map((v) => (
                  <option key={String(v)} value={v ?? ""}>
                    {v == null ? "—" : v}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="justify-self-end text-[11px] text-paper/30 hover:text-paper"
                onClick={() => onChange(sets.filter((x) => x.id !== s.id))}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4">
        <button
          type="button"
          className="font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase hover:text-paper"
          onClick={() => onChange([...sets, newSet("warmup")])}
        >
          + rozgrzewka
        </button>
        <button
          type="button"
          className="font-display text-[10px] tracking-[0.14em] text-brand uppercase hover:text-paper"
          onClick={() => onChange([...sets, newSet("work")])}
        >
          + seria
        </button>
      </div>
    </div>
  );
}
