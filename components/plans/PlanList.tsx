"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import { ensureWeeks, planAssignmentKind } from "@/lib/plans/helpers";
import { EmptyState } from "@/components/ui/EmptyState";
import { linkBtn, linkDanger } from "@/components/plans/styles";

export function PlanList({
  plans,
  onEdit,
  onRemove,
  onCopy,
  onVersion,
  onArchive,
  onRestore,
  emptyTitle = "Brak planów w tej sekcji",
  emptyDescription = "Dodaj nowy plan albo skopiuj szablon z katalogu.",
}: {
  plans: TrainingPlan[];
  onEdit: (p: TrainingPlan) => void;
  onRemove: (id: string) => void;
  onCopy: (id: string) => void;
  onVersion?: (id: string) => void;
  onArchive?: (p: TrainingPlan) => void;
  onRestore?: (p: TrainingPlan) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <ul className="divide-y divide-paper/10 border border-paper/10">
      {plans.map((p) => {
        const kind = planAssignmentKind(p);
        return (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {p.title}
                {p.is_season_active ? (
                  <span className="ml-2 border border-brand/40 bg-brand/10 px-1.5 py-0.5 font-display text-[10px] tracking-wider text-brand uppercase">
                    sezon
                  </span>
                ) : null}
                {p.published_at ? (
                  <span className="ml-2 text-[10px] tracking-wider text-paper/40 uppercase">
                    opublikowany
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-xs text-paper/50">
                {ensureWeeks(p).length} tyg. · v{p.version ?? 1} ·{" "}
                {kind === "all"
                  ? "wszyscy"
                  : kind === "group"
                    ? "grupowy"
                    : "indywidualny"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={linkBtn} onClick={() => onEdit(p)}>
                Edytuj
              </button>
              <button type="button" className={linkBtn} onClick={() => onCopy(p.id)}>
                Kopiuj
              </button>
              {onVersion ? (
                <button type="button" className={linkBtn} onClick={() => onVersion(p.id)}>
                  Nowa wersja
                </button>
              ) : null}
              {onArchive ? (
                <button type="button" className={linkBtn} onClick={() => onArchive(p)}>
                  Archiwizuj
                </button>
              ) : null}
              {onRestore ? (
                <button type="button" className={linkBtn} onClick={() => onRestore(p)}>
                  Przywróć
                </button>
              ) : null}
              <button type="button" className={linkDanger} onClick={() => onRemove(p.id)}>
                Usuń
              </button>
            </div>
          </li>
        );
      })}
      {plans.length === 0 ? (
        <li>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </li>
      ) : null}
    </ul>
  );
}
