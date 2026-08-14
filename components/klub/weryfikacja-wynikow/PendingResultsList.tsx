import type { CompetitionResult } from "@/lib/api/generated/models";
import { ResultStatusBadge } from "@/components/results/ResultStatusBadge";
import { canEditResultStatus } from "@/components/results/shared";
import { formatResultDate } from "@/lib/athletes";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";

type PendingResultsListProps = {
  results: CompetitionResult[];
  loading: boolean;
  notes: Record<string, string>;
  onNoteChange: (id: string, value: string) => void;
  onEdit: (r: CompetitionResult) => void;
  onReview: (id: string, status: CompetitionResult["status"]) => void;
};

export function PendingResultsList({
  results,
  loading,
  notes,
  onNoteChange,
  onEdit,
  onReview,
}: PendingResultsListProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-sm tracking-[0.14em] uppercase">
        Do weryfikacji ({results.length})
      </h2>
      {loading ? (
        <InlineStatus kind="loading">Ładowanie zgłoszeń…</InlineStatus>
      ) : results.length === 0 ? (
        <EmptyState
          title="Brak wyników oczekujących"
          description="Gdy zawodnik zgłosi wynik, pojawi się tutaj do akceptacji, odrzucenia albo odesłania do edycji."
        />
      ) : (
      <ul className="space-y-4">
        {results.map((r) => (
          <li
            key={r.id}
            className="border border-paper/10 bg-paper/[0.03] p-4 md:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg uppercase">{r.athlete_name}</p>
                <p className="mt-1 text-sm text-paper/60">
                  {r.event_name}
                  {r.event_date ? ` · ${formatResultDate(r.event_date)}` : ""}
                </p>
                {r.venue ? (
                  <p className="mt-0.5 text-xs text-paper/45">{r.venue}</p>
                ) : null}
                <p className="mt-2 text-sm text-paper/80">
                  Rwanie {r.snatch_kg ?? "—"} · Podrzut {r.clean_jerk_kg ?? "—"}{" "}
                  · Total {r.total_kg ?? "—"} kg
                  {r.category ? ` · ${r.category}` : ""}
                  {r.bodyweight_kg != null ? ` · ${r.bodyweight_kg} kg` : ""}
                </p>
              </div>
              <ResultStatusBadge status={r.status} variant="badge" />
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                  Notatka dla zawodnika{" "}
                  <span className="normal-case tracking-normal text-paper/35">
                    (opcjonalnie)
                  </span>
                </span>
                <textarea
                  className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
                  rows={2}
                  value={notes[r.id] ?? ""}
                  onChange={(e) => onNoteChange(r.id, e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {canEditResultStatus(r.status) ? (
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                  >
                    Edytuj
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onReview(r.id, "accepted")}
                  className="bg-brand px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                >
                  Akceptuj
                </button>
                <button
                  type="button"
                  onClick={() => onReview(r.id, "rejected")}
                  className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                >
                  Odrzuć
                </button>
                <button
                  type="button"
                  onClick={() => onReview(r.id, "needs_edit")}
                  className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                >
                  Do edycji
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      )}
    </section>
  );
}
