import type { ExerciseRecordStatus } from "@/lib/api/generated/models";

export const RECORD_STATUS_LABELS: Record<ExerciseRecordStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

export function RecordStatusBadge({
  status,
}: {
  status: ExerciseRecordStatus;
}) {
  return (
    <span className="border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase">
      {RECORD_STATUS_LABELS[status] ?? status}
    </span>
  );
}
