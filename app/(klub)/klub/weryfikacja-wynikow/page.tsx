"use client";

import { useCallback, useEffect, useState } from "react";
import { klubFetch } from "@/lib/klub-api";
import { useKlub } from "@/components/klub/KlubProvider";

type ResultStatus = "pending" | "accepted" | "rejected" | "needs_edit";

type CompetitionResult = {
  id: string;
  athlete_name: string;
  event_name: string;
  snatch_kg: number | null;
  clean_jerk_kg: number | null;
  total_kg: number | null;
  status: ResultStatus;
  reviewer_note: string | null;
  submitted_at: string;
};

const STATUS_LABEL: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

export default function WeryfikacjaPage() {
  const { viewAs } = useKlub();
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await klubFetch<CompetitionResult[]>("/api/results", {
        viewAsUserId: viewAs?.userId,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }, [viewAs]);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(id: string, status: ResultStatus) {
    try {
      await klubFetch(`/api/results/${id}`, {
        method: "PATCH",
        body: {
          status,
          reviewer_note: notes[id] || null,
        },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd weryfikacji");
    }
  }

  return (
    <div className="animate-rise max-w-4xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Ludzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Weryfikacja wyników
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Akceptuj, odrzucaj lub zgłaszaj do edycji wyniki przesłane przez
          zawodników.
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <ul className="space-y-4">
        {results.map((r) => (
          <li
            key={r.id}
            className="border border-paper/10 bg-paper/[0.03] p-4 md:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg uppercase">{r.athlete_name}</p>
                <p className="mt-1 text-sm text-paper/60">{r.event_name}</p>
                <p className="mt-2 text-sm text-paper/80">
                  Rwanie {r.snatch_kg ?? "—"} · Podrzut {r.clean_jerk_kg ?? "—"}{" "}
                  · Total {r.total_kg ?? "—"} kg
                </p>
              </div>
              <span className="border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase">
                {STATUS_LABEL[r.status]}
              </span>
            </div>

            {r.status === "pending" || r.status === "needs_edit" ? (
              <div className="mt-4 space-y-3">
                <textarea
                  className="w-full border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                  rows={2}
                  placeholder="Notatka dla zawodnika (opcjonalnie)"
                  value={notes[r.id] ?? ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void review(r.id, "accepted")}
                    className="bg-brand px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                  >
                    Akceptuj
                  </button>
                  <button
                    type="button"
                    onClick={() => void review(r.id, "rejected")}
                    className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                  >
                    Odrzuć
                  </button>
                  <button
                    type="button"
                    onClick={() => void review(r.id, "needs_edit")}
                    className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                  >
                    Do edycji
                  </button>
                </div>
              </div>
            ) : r.reviewer_note ? (
              <p className="mt-3 text-sm text-paper/55">Notatka: {r.reviewer_note}</p>
            ) : null}
          </li>
        ))}
        {!loading && results.length === 0 ? (
          <li className="text-paper/45">Brak zgłoszonych wyników.</li>
        ) : null}
      </ul>
    </div>
  );
}
