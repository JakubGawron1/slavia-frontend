"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import { PlanList } from "@/components/plans/PlanList";

export function ArchiveTab({
  archive,
  onEdit,
  onRemove,
  onCopy,
  onRestore,
  emptyTitle,
  emptyDescription,
}: {
  archive: TrainingPlan[];
  onEdit: (p: TrainingPlan) => void;
  onRemove: (id: string) => void;
  onCopy: (id: string) => void;
  onRestore: (p: TrainingPlan) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <PlanList
      plans={archive}
      onEdit={onEdit}
      onRemove={onRemove}
      onCopy={onCopy}
      onRestore={onRestore}
      emptyTitle={emptyTitle ?? "Archiwum puste"}
      emptyDescription={
        emptyDescription ??
        "Zarchiwizowane plany pojawią się tutaj. Przywrócisz je jednym kliknięciem."
      }
    />
  );
}
