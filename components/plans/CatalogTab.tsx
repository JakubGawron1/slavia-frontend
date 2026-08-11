"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import { ensureWeeks } from "@/lib/plans/helpers";
import { btnPrimary } from "@/components/plans/styles";

export function CatalogTab({
  templates,
  onCopy,
}: {
  templates: TrainingPlan[];
  onCopy: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-paper/10 border border-paper/10">
      {templates.map((p) => (
        <li
          key={p.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <div>
            <p className="font-medium">{p.title}</p>
            <p className="text-xs text-paper/50">
              {ensureWeeks(p).length} tyg. · szablon katalogu
              {p.description
                ? ` · ${p.description.slice(0, 80)}${p.description.length > 80 ? "…" : ""}`
                : ""}
            </p>
          </div>
          <button type="button" className={btnPrimary} onClick={() => onCopy(p.id)}>
            Użyj programu
          </button>
        </li>
      ))}
      {templates.length === 0 ? (
        <li className="px-4 py-8 text-center text-paper/45">
          Brak szablonów w katalogu. Oznacz plan jako „Szablon katalogu”.
        </li>
      ) : null}
    </ul>
  );
}
