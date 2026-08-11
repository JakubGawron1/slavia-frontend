"use client";

import type { PlanExercise } from "@/lib/api/generated/models";
import { inputClass, linkDanger, sectionLabel } from "@/components/plans/styles";

const fieldLabelClass = "block text-[10px] tracking-wider text-paper/40 uppercase";

export function ExerciseAlternativesEditor({
  ex,
  onPatch,
}: {
  ex: PlanExercise;
  onPatch: (patch: Partial<PlanExercise>) => void;
}) {
  const alternatives = ex.alternatives ?? [];
  if (alternatives.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-paper/10 pt-3">
      <p className={sectionLabel}>Zamienniki</p>
      {alternatives.map((alt, ai) => (
        <div key={alt.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="space-y-1">
            <span className={fieldLabelClass}>Nazwa zamiennika</span>
            <input
              className={inputClass}
              value={alt.name}
              onChange={(e) => {
                const next = [...(ex.alternatives ?? [])];
                next[ai] = { ...alt, name: e.target.value };
                onPatch({ alternatives: next });
              }}
            />
          </label>
          <label className="space-y-1">
            <span className={fieldLabelClass}>Powód</span>
            <input
              className={inputClass}
              value={alt.reason ?? ""}
              onChange={(e) => {
                const next = [...(ex.alternatives ?? [])];
                next[ai] = { ...alt, reason: e.target.value || null };
                onPatch({ alternatives: next });
              }}
            />
          </label>
          <button
            type="button"
            className={linkDanger}
            onClick={() => {
              onPatch({
                alternatives: (ex.alternatives ?? []).filter((_, j) => j !== ai),
              });
            }}
          >
            Usuń
          </button>
        </div>
      ))}
    </div>
  );
}
