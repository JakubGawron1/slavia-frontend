import type { CompetitionResult } from "@/lib/api/generated/models";
import { ResultStatusBadge } from "@/components/results/ResultStatusBadge";
import { canEditResultStatus } from "@/components/results/shared";
import { formatResultDate } from "@/lib/athletes";

type WynikiResultsListProps = {
  results: CompetitionResult[];
  onEdit: (r: CompetitionResult) => void;
};

export function WynikiResultsList({ results, onEdit }: WynikiResultsListProps) {
  return (
    <ul className="space-y-3">
      {results.map((r) => (
        <li key={r.id} className="border border-paper/10 px-4 py-3 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{r.event_name}</p>
              <p className="mt-1 text-paper/65">
                {r.event_date ? `${formatResultDate(r.event_date)} · ` : ""}
                {r.snatch_kg ?? "—"} / {r.clean_jerk_kg ?? "—"} · total{" "}
                {r.total_kg ?? "—"} kg
                {r.category ? ` · ${r.category}` : ""}
                {r.bodyweight_kg != null ? ` · ${r.bodyweight_kg} kg` : ""}
              </p>
              {r.status === "needs_edit" && r.reviewer_note ? (
                <p className="mt-2 border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs text-paper/80">
                  Uwaga trenera: {r.reviewer_note}
                </p>
              ) : r.reviewer_note ? (
                <p className="mt-1 text-xs text-paper/45">
                  Notatka: {r.reviewer_note}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {canEditResultStatus(r.status) ? (
                <button
                  type="button"
                  onClick={() => onEdit(r)}
                  className="border border-paper/25 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] uppercase"
                >
                  Popraw
                </button>
              ) : null}
              <ResultStatusBadge
                status={r.status}
                variant="plain"
                suffix={r.kind === "training" ? "trening" : "zawody"}
              />
            </div>
          </div>
        </li>
      ))}
      {results.length === 0 ? (
        <li className="text-paper/45">Brak zgłoszeń.</li>
      ) : null}
    </ul>
  );
}
