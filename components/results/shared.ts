import type { CompetitionResult, ResultStatus } from "@/lib/api/generated/models";

export const RESULT_STATUS_LABELS: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

export const resultInputClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

export function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isCompetitionResult(r: CompetitionResult) {
  return r.kind !== "training";
}

/** Wspólna reguła: edycja dozwolona dla wyników oczekujących, do edycji i zaakceptowanych. */
export function canEditResultStatus(status: ResultStatus) {
  return status === "pending" || status === "needs_edit" || status === "accepted";
}

export type ResultEditFormValues = {
  eventName: string;
  eventDate: string;
  snatch: string;
  cj: string;
  bodyweight: string;
  venue: string;
};

export function editFormFromResult(r: CompetitionResult): ResultEditFormValues {
  return {
    eventName: isCompetitionResult(r) ? r.event_name : "",
    eventDate: r.event_date ?? todayIsoDate(),
    snatch: r.snatch_kg != null ? String(r.snatch_kg) : "",
    cj: r.clean_jerk_kg != null ? String(r.clean_jerk_kg) : "",
    bodyweight: r.bodyweight_kg != null ? String(r.bodyweight_kg) : "",
    venue: r.venue ?? "",
  };
}
