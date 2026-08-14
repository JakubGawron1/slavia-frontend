"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import { ensureWeeks } from "@/lib/plans/helpers";
import { btnPrimary } from "@/components/plans/styles";
import { EmptyState } from "@/components/ui/EmptyState";

export function CatalogTab({
  templates,
  onCopy,
  emptyTitle = "Brak szablonów w katalogu",
  emptyDescription = "Oznacz plan jako „Szablon katalogu”, żeby pojawił się tutaj.",
}: {
  templates: TrainingPlan[];
  onCopy: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
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
        <li>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </li>
      ) : null}
    </ul>
  );
}
