"use client";

import type { PlanExercise } from "@/lib/api/generated/models";
import {
  loadModeOf,
  toUniformLoad,
  withLoadMode,
} from "@/lib/plans/helpers";
import { inputClass, linkDanger, sectionLabel } from "@/components/plans/styles";
import { LoadModeChips, LoadTextSummary } from "@/components/plans/LoadModeChips";

export function ExerciseSetSchemeEditor({
  ex,
  onPatch,
}: {
  ex: PlanExercise;
  onPatch: (patch: Partial<PlanExercise>) => void;
}) {
  const scheme = ex.set_scheme ?? [];
  if (scheme.length === 0) return null;

  const patchScheme = (set_scheme: NonNullable<PlanExercise["set_scheme"]>) => {
    onPatch({
      set_scheme,
      sets: set_scheme.length,
      individual_load: true,
    });
  };

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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] tracking-wider text-paper/40 uppercase">
                {s.is_warmup ? `Rozgrzewka · S${si + 1}` : `Seria ${si + 1}`}
              </span>
              <label className="flex items-center gap-1.5 text-xs text-paper/70">
                <input
                  type="checkbox"
                  checked={Boolean(s.is_warmup)}
                  onChange={(e) => {
                    const set_scheme = [...scheme];
                    set_scheme[si] = { ...s, is_warmup: e.target.checked };
                    patchScheme(set_scheme);
                  }}
                />
                Rozgrzewka
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="min-w-0 space-y-1">
                <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                  Powt.
                </span>
                <input
                  className={inputClass}
                  placeholder="np. 3"
                  value={s.reps ?? ""}
                  onChange={(e) => {
                    const set_scheme = [...scheme];
                    set_scheme[si] = { ...s, reps: e.target.value || null };
                    patchScheme(set_scheme);
                  }}
                />
              </label>
              <button
                type="button"
                className={`${linkDanger} self-end`}
                onClick={() => {
                  const remaining = scheme.filter((_, j) => j !== si);
                  if (remaining.length === 0) {
                    onPatch(toUniformLoad({ ...ex, set_scheme: [s] }));
                    return;
                  }
                  patchScheme(remaining);
                }}
              >
                Usuń
              </button>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                Obciążenie
              </span>
              <LoadModeChips
                value={s}
                onChange={(next) => {
                  const set_scheme = [...scheme];
                  set_scheme[si] = next;
                  patchScheme(set_scheme);
                }}
                pctDefaults={{
                  load_pct: ex.load_pct ?? 70,
                  pct_of: ex.pct_of ?? "exercise",
                }}
              />
            </div>
            {setMode === "kg" ? (
              <label className="block space-y-1">
                <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                  Kg
                </span>
                <input
                  className={inputClass}
                  placeholder="Kg"
                  type="number"
                  step="0.5"
                  value={s.load_kg ?? ""}
                  onChange={(e) => {
                    const set_scheme = [...scheme];
                    set_scheme[si] = {
                      ...withLoadMode(s, "kg"),
                      load_kg: e.target.value ? Number(e.target.value) : null,
                    };
                    patchScheme(set_scheme);
                  }}
                />
              </label>
            ) : null}
            {setMode === "text" ? <LoadTextSummary loadText={s.load_text} /> : null}
            {setMode === "pct" ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                    % 1RM
                  </span>
                  <input
                    className={inputClass}
                    placeholder="% 1RM"
                    type="number"
                    value={s.load_pct ?? ""}
                    onChange={(e) => {
                      const set_scheme = [...scheme];
                      set_scheme[si] = {
                        ...s,
                        load_pct: e.target.value ? Number(e.target.value) : null,
                        load_kg: null,
                        load_text: null,
                        pct_of: s.pct_of ?? "exercise",
                      };
                      patchScheme(set_scheme);
                    }}
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                    % z
                  </span>
                  <select
                    className={inputClass}
                    value={s.pct_of ?? ""}
                    onChange={(e) => {
                      const set_scheme = [...scheme];
                      set_scheme[si] = {
                        ...s,
                        pct_of: (e.target.value || null) as PlanExercise["pct_of"],
                        load_kg: null,
                        load_text: null,
                      };
                      patchScheme(set_scheme);
                    }}
                  >
                    <option value="">% z…</option>
                    <option value="snatch">PR rwanie</option>
                    <option value="clean_jerk">PR podrzut</option>
                    <option value="total">PR dwubój</option>
                    <option value="exercise">PR tego ćwiczenia</option>
                  </select>
                </label>
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        className={linkDanger}
        onClick={() => {
          const last = scheme[scheme.length - 1];
          const mode = loadModeOf(last ?? ex);
          const base = last ?? {
            reps: ex.reps ?? "3",
            load_kg: ex.load_kg ?? null,
            load_pct: ex.load_pct ?? null,
            pct_of: ex.pct_of ?? null,
            load_text: ex.load_text ?? null,
            is_warmup: false,
          };
          patchScheme([
            ...scheme,
            {
              ...withLoadMode(base, mode, {
                load_pct: ex.load_pct ?? 70,
                pct_of: ex.pct_of ?? "exercise",
                load_text: base.load_text,
              }),
              reps: base.reps ?? ex.reps ?? "3",
              is_warmup: false,
            },
          ]);
        }}
      >
        + Seria
      </button>
    </div>
  );
}
