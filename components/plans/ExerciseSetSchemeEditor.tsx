"use client";

import type { PlanExercise } from "@/lib/api/generated/models";
import { loadModeOf } from "@/lib/plans/helpers";
import { chipActive, chipIdle, inputClass, linkDanger, sectionLabel } from "@/components/plans/styles";

export function ExerciseSetSchemeEditor({
  ex,
  onPatch,
}: {
  ex: PlanExercise;
  onPatch: (patch: Partial<PlanExercise>) => void;
}) {
  const scheme = ex.set_scheme ?? [];
  if (scheme.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-paper/10 pt-3">
      <p className={sectionLabel}>Serie indywidualne</p>
      {scheme.map((s, si) => {
        const setMode = loadModeOf(s);
        return (
          <div
            key={`${ex.id}-scheme-${si}`}
            className="space-y-2 border border-paper/10 bg-chrome/30 p-2.5 sm:p-3"
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <input
                className={inputClass}
                placeholder="Powt."
                value={s.reps ?? ""}
                onChange={(e) => {
                  const set_scheme = [...(ex.set_scheme ?? [])];
                  set_scheme[si] = { ...s, reps: e.target.value || null };
                  onPatch({ set_scheme, sets: set_scheme.length });
                }}
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  className={setMode === "kg" ? chipActive : chipIdle}
                  onClick={() => {
                    const set_scheme = [...(ex.set_scheme ?? [])];
                    set_scheme[si] = { ...s, load_pct: null, pct_of: null };
                    onPatch({ set_scheme });
                  }}
                >
                  Kg
                </button>
                <button
                  type="button"
                  className={setMode === "pct" ? chipActive : chipIdle}
                  onClick={() => {
                    const set_scheme = [...(ex.set_scheme ?? [])];
                    set_scheme[si] = {
                      ...s,
                      load_kg: null,
                      load_pct: s.load_pct ?? ex.load_pct ?? 70,
                      pct_of: s.pct_of ?? ex.pct_of ?? "exercise",
                    };
                    onPatch({ set_scheme });
                  }}
                >
                  %
                </button>
              </div>
              <button
                type="button"
                className={linkDanger}
                onClick={() => {
                  const set_scheme = (ex.set_scheme ?? []).filter((_, j) => j !== si);
                  onPatch({ set_scheme, sets: set_scheme.length || null });
                }}
              >
                Usuń
              </button>
            </div>
            {setMode === "kg" ? (
              <input
                className={inputClass}
                placeholder="Kg"
                type="number"
                step="0.5"
                value={s.load_kg ?? ""}
                onChange={(e) => {
                  const set_scheme = [...(ex.set_scheme ?? [])];
                  set_scheme[si] = {
                    ...s,
                    load_kg: e.target.value ? Number(e.target.value) : null,
                    load_pct: null,
                    pct_of: null,
                  };
                  onPatch({ set_scheme });
                }}
              />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="% 1RM"
                  type="number"
                  value={s.load_pct ?? ""}
                  onChange={(e) => {
                    const set_scheme = [...(ex.set_scheme ?? [])];
                    set_scheme[si] = {
                      ...s,
                      load_pct: e.target.value ? Number(e.target.value) : null,
                      load_kg: null,
                    };
                    onPatch({ set_scheme });
                  }}
                />
                <select
                  className={inputClass}
                  value={s.pct_of ?? ""}
                  onChange={(e) => {
                    const set_scheme = [...(ex.set_scheme ?? [])];
                    set_scheme[si] = {
                      ...s,
                      pct_of: (e.target.value || null) as PlanExercise["pct_of"],
                      load_kg: null,
                    };
                    onPatch({ set_scheme });
                  }}
                >
                  <option value="">% z…</option>
                  <option value="snatch">PR rwanie</option>
                  <option value="clean_jerk">PR podrzut</option>
                  <option value="total">PR dwubój</option>
                  <option value="exercise">PR tego ćwiczenia</option>
                </select>
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className={linkDanger}
        onClick={() => {
          const set_scheme = [
            ...(ex.set_scheme ?? []),
            {
              reps: ex.reps ?? "3",
              load_kg: loadModeOf(ex) === "kg" ? (ex.load_kg ?? null) : null,
              load_pct: loadModeOf(ex) === "pct" ? (ex.load_pct ?? null) : null,
              pct_of: loadModeOf(ex) === "pct" ? (ex.pct_of ?? null) : null,
              is_warmup: false,
            },
          ];
          onPatch({ set_scheme, sets: set_scheme.length });
        }}
      >
        + Seria
      </button>
    </div>
  );
}
