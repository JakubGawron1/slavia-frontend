"use client";

import { useState, type DragEvent } from "react";
import type { ExerciseLibraryItem, PlanExercise } from "@/lib/api/generated/models";
import { createLibraryItem } from "@/lib/api/generated/exercise-library/exercise-library";
import {
  emptyExercise,
  isIndividualLoad,
  loadModeOf,
  toIndividualLoad,
  toUniformLoad,
  withLoadMode,
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
import { LoadModeChips, LoadTextSummary } from "@/components/plans/LoadModeChips";
import { useToast } from "@/components/toast/ToastProvider";

function nameInLibrary(name: string, library: ExerciseLibraryItem[]): boolean {
  const n = name.trim().toLocaleLowerCase("pl");
  if (!n) return false;
  return library.some((i) => i.name.trim().toLocaleLowerCase("pl") === n);
}

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
  library,
  onLibraryReload,
  onPatch,
  onDuplicate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  ex: PlanExercise;
  index: number;
  library: ExerciseLibraryItem[];
  onLibraryReload: () => Promise<void>;
  onPatch: (i: number, patch: Partial<PlanExercise>) => void;
  onDuplicate: (ex: PlanExercise) => void;
  onRemove: (i: number) => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (i: number) => void;
}) {
  const toast = useToast();
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const patch = (p: Partial<PlanExercise>) => onPatch(index, p);
  const individual = isIndividualLoad(ex);
  const canAddToLibrary =
    Boolean(ex.name.trim()) && !nameInLibrary(ex.name, library);

  async function addToLibrary() {
    const name = ex.name.trim();
    if (!name || addingToLibrary) return;
    setAddingToLibrary(true);
    try {
      await createLibraryItem({
        name,
        default_sets: ex.sets ?? null,
        default_reps: ex.reps ?? null,
        notes: ex.notes ?? null,
        video_url: null,
        tags: ex.is_warmup ? ["warmup"] : [],
      });
      toast.success("Dodano do biblioteki");
      await onLibraryReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udało się dodać");
    } finally {
      setAddingToLibrary(false);
    }
  }

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
            <LoadModeChips
              value={ex}
              onChange={patch}
              pctLabel="% 1RM"
              pctDefaults={{ load_pct: 70, pct_of: "exercise" }}
            />
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
                    ...withLoadMode(ex, "kg"),
                    load_kg: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </label>
          ) : null}
          {loadModeOf(ex) === "text" ? (
            <div className="sm:col-span-2">
              <LoadTextSummary loadText={ex.load_text} />
            </div>
          ) : null}
          {loadModeOf(ex) === "pct" ? (
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
                      load_text: null,
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
                      load_text: null,
                    })
                  }
                >
                  {PCT_OF_OPTIONS}
                </select>
              </label>
            </>
          ) : null}
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
        {canAddToLibrary ? (
          <button
            type="button"
            className={linkBtn}
            disabled={addingToLibrary}
            onClick={() => void addToLibrary()}
          >
            {addingToLibrary ? "Dodawanie…" : "Dodaj do biblioteki"}
          </button>
        ) : null}
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
                load_text: null,
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
