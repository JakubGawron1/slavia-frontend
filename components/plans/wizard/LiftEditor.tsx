"use client";

import { useId } from "react";
import type { LibraryExercise, SkeletonLift } from "@/lib/api/generated/models";
import { MUST_DO_CHIP, PLAN_FIELD } from "@/lib/plans/labels";

export function LiftEditor({
  lifts,
  onChange,
  library,
}: {
  lifts: SkeletonLift[];
  onChange: (next: SkeletonLift[]) => void;
  library: LibraryExercise[];
}) {
  const listId = useId();
  return (
    <div className="space-y-2">
      {lifts.map((lift, i) => (
        <div
          key={i}
          className="grid gap-2 border border-amber-400/35 bg-amber-500/8 p-2 sm:grid-cols-4"
        >
          <label className="text-[11px] text-paper/55 sm:col-span-2">
            Ćwiczenie
            <input
              className={PLAN_FIELD}
              list={listId}
              placeholder="Ćwiczenie"
              value={lift.name}
              onChange={(e) => {
                const name = e.target.value;
                const hit = library.find((x) => x.name === name);
                const next = [...lifts];
                next[i] = {
                  ...lift,
                  name,
                  library_id: hit?.id ?? lift.library_id,
                };
                onChange(next);
              }}
            />
          </label>
          <label className="text-[11px] text-paper/55">
            Serie × powt.
            <input
              className={PLAN_FIELD}
              value={`${lift.work_sets ?? 5}×${lift.work_reps ?? "3"}`}
              onChange={(e) => {
                const [sets, reps] = e.target.value.split("×");
                const next = [...lifts];
                next[i] = {
                  ...lift,
                  work_sets: Number(sets) || 5,
                  work_reps: (reps ?? "3").trim() || "3",
                };
                onChange(next);
              }}
            />
          </label>
          <div className="flex items-end justify-between gap-2">
            <span className={`${MUST_DO_CHIP} self-end`}>Must do</span>
            <button
              type="button"
              className="self-end text-xs text-paper/45"
              onClick={() => onChange(lifts.filter((_, j) => j !== i))}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
      <datalist id={listId}>
        {library.map((item) => (
          <option key={item.id} value={item.name} />
        ))}
      </datalist>
    </div>
  );
}
