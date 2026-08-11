import type { CompetitionResult } from "@/lib/api/generated/models";
import { ResultStatusBadge } from "@/components/results/ResultStatusBadge";
import { canEditResultStatus } from "@/components/results/shared";
import { formatResultDate } from "@/lib/athletes";

type OtherResultsListProps = {
  results: CompetitionResult[];
  onEdit: (r: CompetitionResult) => void;
};

export function OtherResultsList({ results, onEdit }: OtherResultsListProps) {
  if (results.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-sm tracking-[0.14em] uppercase">
        Pozostałe
      </h2>
      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.id} className="border border-paper/10 px-4 py-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{r.athlete_name}</p>
                <p className="text-paper/60">
                  {r.event_name}
                  {r.event_date ? ` · ${formatResultDate(r.event_date)}` : ""}
                </p>
                <p className="mt-1 text-paper/70">
                  {r.snatch_kg ?? "—"} / {r.clean_jerk_kg ?? "—"} · total{" "}
                  {r.total_kg ?? "—"} kg
                  {r.category ? ` · ${r.category}` : ""}
                </p>
                {r.reviewer_note ? (
                  <p className="mt-1 text-xs text-paper/45">
                    Notatka: {r.reviewer_note}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {canEditResultStatus(r.status) ? (
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="border border-paper/25 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] uppercase"
                  >
                    Edytuj
                  </button>
                ) : null}
                <ResultStatusBadge status={r.status} variant="plain" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
