"use client";

import type { ReactNode } from "react";
import type {
  ExerciseRole,
  LibraryExercise,
  PlanExercise,
  PlanExerciseAlt,
} from "@/lib/api/generated/models";
import { SetTable } from "@/components/plans/editor/SetTable";
import {
  EXERCISE_ROLE_LABEL,
  MUST_DO_CHIP,
  PLAN_FIELD,
  isMustDo,
} from "@/lib/plans/labels";

const ROLE_TONE: Record<ExerciseRole, string> = {
  warmup: "border-paper/20 text-paper/50",
  main: "border-amber-400/55 bg-amber-500/15 text-amber-100",
  accessory: "border-paper/25 text-paper/70",
};

export function ExerciseBlock({
  exercise,
  library,
  onChange,
  onRemove,
  onMove,
  canUp,
  canDown,
  dragHandle,
}: {
  exercise: PlanExercise;
  library: LibraryExercise[];
  onChange: (next: PlanExercise) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
  dragHandle?: ReactNode;
}) {
  const role = exercise.role ?? "main";

  function addAlt() {
    const alt: PlanExerciseAlt = {
      id: crypto.randomUUID(),
      name: "Zamiennik",
      library_id: null,
      notes: null,
      sets: exercise.sets ?? [],
    };
    onChange({
      ...exercise,
      alternatives: [...(exercise.alternatives ?? []), alt],
    });
  }

  const mustDo = isMustDo(role);
  const accent = mustDo
    ? "border-l-amber-400"
    : role === "warmup"
      ? "border-l-paper/20"
      : "border-l-paper/35";

  return (
    <article
      className={`border border-l-2 bg-paper/3 ${accent} ${
        mustDo ? "border-amber-400/35 bg-amber-500/6" : "border-paper/10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-paper/10 px-4 py-3">
        {dragHandle}
        <label className="min-w-48 flex-1">
          <span className="sr-only">Ćwiczenie</span>
          <input
            className={`w-full border-0 bg-transparent px-0 py-1 font-display text-base tracking-wide text-paper outline-none placeholder:text-paper/25 focus:text-brand ${
              mustDo ? "text-amber-50" : "text-paper/80"
            }`}
            value={exercise.name}
            placeholder="Nazwa ćwiczenia"
            onChange={(e) => onChange({ ...exercise, name: e.target.value })}
            list={`lib-${exercise.id}`}
          />
          <datalist id={`lib-${exercise.id}`}>
            {library.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
        </label>
        <button
          type="button"
          className={
            mustDo
              ? MUST_DO_CHIP
              : "border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-paper/45 uppercase"
          }
          aria-pressed={mustDo}
          onClick={() =>
            onChange({
              ...exercise,
              role: mustDo ? "accessory" : "main",
            })
          }
        >
          Must do
        </button>
        <select
          className={`border px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase outline-none ${ROLE_TONE[role]}`}
          value={role}
          onChange={(e) =>
            onChange({ ...exercise, role: e.target.value as ExerciseRole })
          }
          aria-label="Rola"
        >
          {(Object.keys(EXERCISE_ROLE_LABEL) as ExerciseRole[]).map((r) => (
            <option key={r} value={r}>
              {EXERCISE_ROLE_LABEL[r]}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={!canUp}
            className="px-2 py-1 text-xs text-paper/40 hover:text-paper disabled:opacity-20"
            onClick={() => onMove(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={!canDown}
            className="px-2 py-1 text-xs text-paper/40 hover:text-paper disabled:opacity-20"
            onClick={() => onMove(1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs text-paper/35 hover:text-paper"
            onClick={onRemove}
          >
            Usuń
          </button>
        </div>
      </div>
      <div className="px-4 py-4">
        <SetTable
          sets={exercise.sets ?? []}
          onChange={(sets) => onChange({ ...exercise, sets })}
        />
        <details className="mt-4">
          <summary className="cursor-pointer font-display text-[10px] tracking-[0.14em] text-paper/35 uppercase">
            Notatka i zamienniki
          </summary>
          <div className="mt-3 space-y-3">
            <input
              className={PLAN_FIELD}
              placeholder="Cue, tempo, uwagi…"
              value={exercise.notes ?? ""}
              onChange={(e) =>
                onChange({ ...exercise, notes: e.target.value || null })
              }
            />
            {(exercise.alternatives ?? []).map((alt) => (
              <div key={alt.id} className="border border-dashed border-paper/15 p-3">
                <div className="mb-2 flex gap-2">
                  <input
                    className={PLAN_FIELD}
                    value={alt.name}
                    onChange={(e) =>
                      onChange({
                        ...exercise,
                        alternatives: (exercise.alternatives ?? []).map((a) =>
                          a.id === alt.id ? { ...a, name: e.target.value } : a,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="self-end text-xs text-paper/40 hover:text-paper"
                    onClick={() =>
                      onChange({
                        ...exercise,
                        alternatives: (exercise.alternatives ?? []).filter(
                          (a) => a.id !== alt.id,
                        ),
                      })
                    }
                  >
                    Usuń
                  </button>
                </div>
                <SetTable
                  sets={alt.sets ?? []}
                  onChange={(sets) =>
                    onChange({
                      ...exercise,
                      alternatives: (exercise.alternatives ?? []).map((a) =>
                        a.id === alt.id ? { ...a, sets } : a,
                      ),
                    })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-xs text-paper/45 hover:text-paper"
              onClick={addAlt}
            >
              + zamiennik
            </button>
          </div>
        </details>
      </div>
    </article>
  );
}
