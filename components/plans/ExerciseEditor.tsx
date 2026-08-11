"use client";

import type { DragEvent } from "react";
import type { PlanExercise } from "@/lib/api/generated/models";
import {
  emptyExercise,
  isIndividualLoad,
  loadModeOf,
  toIndividualLoad,
  toUniformLoad,
} from "@/lib/plans/helpers";
import {
  chipActive,
  chipIdle,
  inputClass,
  linkBtn,
  linkDanger,
} from "@/components/plans/styles";
import { ExerciseSetSchemeEditor } from "@/components/plans/ExerciseSetSchemeEditor";
import { ExerciseAlternativesEditor } from "@/components/plans/ExerciseAlternativesEditor";

const PCT_OF_OPTIONS = (
  <>
    <option value="">—</option>
    <option value="snatch">PR rwanie</option>
    <option value="clean_jerk">PR podrzut</option>
    <option value="total">PR dwubój</option>
    <option value="exercise">PR tego ćwiczenia</option>
  </>
);

export function ExerciseEditor({
  ex,
  index,
  onPatch,
  onDuplicate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  ex: PlanExercise;
  index: number;
  onPatch: (i: number, patch: Partial<PlanExercise>) => void;
  onDuplicate: (ex: PlanExercise) => void;
  onRemove: (i: number) => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (i: number) => void;
}) {
  const patch = (p: Partial<PlanExercise>) => onPatch(index, p);
  const individual = isIndividualLoad(ex);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
      className="space-y-3 border border-paper/10 bg-chrome/20 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="cursor-grab font-display text-[10px] tracking-wider text-paper/35 uppercase select-none">
          ⋮⋮ {index + 1}
        </span>
        {ex.is_warmup ? (
          <span className="border border-paper/20 px-1.5 py-0.5 text-[10px] tracking-wider text-paper/50 uppercase">
            Warm-up
          </span>
        ) : null}
        <input
          className={`${inputClass} min-w-[12rem] flex-1`}
          placeholder="Nazwa ćwiczenia"
          value={ex.name}
          onChange={(e) => patch({ name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1">
        <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
          Obciążenie serii
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={!individual ? chipActive : chipIdle}
            onClick={() => patch(toUniformLoad(ex))}
          >
            Wspólny ciężar
          </button>
          <button
            type="button"
            className={individual ? chipActive : chipIdle}
            onClick={() => patch(toIndividualLoad(ex))}
          >
            Indywidualny
          </button>
        </div>
      </div>

      {!individual ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1">
            <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
              Serie
            </span>
            <input
              className={inputClass}
              type="number"
              value={ex.sets ?? ""}
              onChange={(e) =>
                patch({ sets: e.target.value ? Number(e.target.value) : null })
              }
            />
          </label>
          <label className="space-y-1">
            <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
              Powt.
            </span>
            <input
              className={inputClass}
              value={ex.reps ?? ""}
              onChange={(e) => patch({ reps: e.target.value || null })}
            />
          </label>
          <div className="space-y-1 sm:col-span-2">
            <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
              Obciążenie
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={loadModeOf(ex) === "kg" ? chipActive : chipIdle}
                onClick={() => patch({ load_pct: null, pct_of: null })}
              >
                Kg
              </button>
              <button
                type="button"
                className={loadModeOf(ex) === "pct" ? chipActive : chipIdle}
                onClick={() =>
                  patch({
                    load_kg: null,
                    load_pct: ex.load_pct ?? 70,
                    pct_of: ex.pct_of ?? "exercise",
                  })
                }
              >
                % 1RM
              </button>
            </div>
          </div>
          {loadModeOf(ex) === "kg" ? (
            <label className="space-y-1 sm:col-span-2">
              <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                Kg
              </span>
              <input
                className={inputClass}
                type="number"
                step="0.5"
                value={ex.load_kg ?? ""}
                onChange={(e) =>
                  patch({
                    load_kg: e.target.value ? Number(e.target.value) : null,
                    load_pct: null,
                    pct_of: null,
                  })
                }
              />
            </label>
          ) : (
            <>
              <label className="space-y-1">
                <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                  % 1RM
                </span>
                <input
                  className={inputClass}
                  type="number"
                  value={ex.load_pct ?? ""}
                  onChange={(e) =>
                    patch({
                      load_pct: e.target.value ? Number(e.target.value) : null,
                      load_kg: null,
                      pct_of: ex.pct_of ?? "exercise",
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                  % z
                </span>
                <select
                  className={inputClass}
                  value={ex.pct_of ?? ""}
                  onChange={(e) =>
                    patch({
                      pct_of: (e.target.value || null) as PlanExercise["pct_of"],
                      load_kg: null,
                    })
                  }
                >
                  {PCT_OF_OPTIONS}
                </select>
              </label>
            </>
          )}
        </div>
      ) : null}

      <input
        className={inputClass}
        placeholder="Notatka trenera (widoczna dla zawodnika)"
        value={ex.notes ?? ""}
        onChange={(e) => patch({ notes: e.target.value || null })}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-1.5 text-xs text-paper/70">
          <input
            type="checkbox"
            checked={Boolean(ex.is_warmup)}
            onChange={(e) => patch({ is_warmup: e.target.checked })}
          />
          Warm-up
        </label>
        <button
          type="button"
          className={linkBtn}
          onClick={() =>
            onDuplicate(
              emptyExercise({
                ...ex,
                id: crypto.randomUUID(),
                name: `${ex.name} (kopia)`,
              }),
            )
          }
        >
          Duplikuj
        </button>
        <button
          type="button"
          className={linkDanger}
          onClick={() => {
            const alts = [
              ...(ex.alternatives ?? []),
              {
                id: crypto.randomUUID(),
                name: "",
                reason: "Kontuzja / przeciwwskazanie",
                sets: ex.sets,
                reps: ex.reps,
                load_kg: null,
                load_pct: null,
                pct_of: null,
              },
            ];
            patch({ alternatives: alts });
          }}
        >
          + Zamiennik
        </button>
        <button
          type="button"
          className={`${linkDanger} ml-auto`}
          onClick={() => onRemove(index)}
        >
          Usuń
        </button>
      </div>

      {individual ? <ExerciseSetSchemeEditor ex={ex} onPatch={patch} /> : null}
      <ExerciseAlternativesEditor ex={ex} onPatch={patch} />
    </div>
  );
}
