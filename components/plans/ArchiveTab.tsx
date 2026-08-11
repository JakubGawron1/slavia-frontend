"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import { PlanList } from "@/components/plans/PlanList";

export function ArchiveTab({
  archive,
  onEdit,
  onRemove,
  onCopy,
}: {
  archive: TrainingPlan[];
  onEdit: (p: TrainingPlan) => void;
  onRemove: (id: string) => void;
  onCopy: (id: string) => void;
}) {
  return <PlanList plans={archive} onEdit={onEdit} onRemove={onRemove} onCopy={onCopy} />;
}
