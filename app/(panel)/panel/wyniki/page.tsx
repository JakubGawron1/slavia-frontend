"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type {
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";

const STATUS: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

export default function WynikiPage() {
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<"competition" | "training">("competition");
  const [eventName, setEventName] = useState("");
  const [snatch, setSnatch] = useState("");
  const [cj, setCj] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");

  const load = useCallback(async () => {
    try {
      setResults(
        await klubFetch<CompetitionResult[]>("/api/results?mine=true"),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await klubFetch("/api/results", {
        method: "POST",
        body: {
          event_name: eventName,
          kind,
          snatch_kg: snatch ? Number(snatch) : null,
          clean_jerk_kg: cj ? Number(cj) : null,
          bodyweight_kg: bodyweight ? Number(bodyweight) : null,
          venue: venue.trim() || null,
          category: category.trim() || null,
        },
      });
      setEventName("");
      setSnatch("");
      setCj("");
      setBodyweight("");
      setVenue("");
      setCategory("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać");
    }
  }

  return (
    <div className="animate-rise max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold uppercase">
          Wyniki i rekordy
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Zgłoś wynik z zawodów lub rekord treningowy — trafi do weryfikacji
          trenera.
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={submit}
        className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
      >
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={() => setKind("competition")}
            className={
              kind === "competition"
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase"
                : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase text-paper/50"
            }
          >
            Zawody
          </button>
          <button
            type="button"
            onClick={() => setKind("training")}
            className={
              kind === "training"
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase"
                : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase text-paper/50"
            }
          >
            Rekord treningowy
          </button>
        </div>
        <input
          className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2"
          placeholder={
            kind === "competition" ? "Nazwa zawodów" : "Nazwa / opis treningu"
          }
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Rwanie (kg)"
          type="number"
          step="0.5"
          value={snatch}
          onChange={(e) => setSnatch(e.target.value)}
        />
        <input
          className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Podrzut (kg)"
          type="number"
          step="0.5"
          value={cj}
          onChange={(e) => setCj(e.target.value)}
        />
        {kind === "competition" ? (
          <>
            <input
              className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="Masa ciała na zawodach (kg)"
              type="number"
              step="0.1"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
            />
            <input
              className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="Kategoria wagowa"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2"
              placeholder="Miejsce zawodów"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </>
        ) : null}
        <button
          type="submit"
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase sm:col-span-2 sm:justify-self-start"
        >
          Wyślij do weryfikacji
        </button>
      </form>

      <ul className="space-y-3">
        {results.map((r) => (
          <li key={r.id} className="border border-paper/10 px-4 py-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">{r.event_name}</p>
              <span className="font-display text-[10px] tracking-[0.12em] uppercase text-paper/50">
                {STATUS[r.status] ?? r.status} ·{" "}
                {r.kind === "training" ? "trening" : "zawody"}
              </span>
            </div>
            <p className="mt-1 text-paper/65">
              {r.snatch_kg ?? "—"} / {r.clean_jerk_kg ?? "—"} · total{" "}
              {r.total_kg ?? "—"} kg
            </p>
            {r.reviewer_note ? (
              <p className="mt-1 text-xs text-paper/45">Notatka: {r.reviewer_note}</p>
            ) : null}
          </li>
        ))}
        {results.length === 0 ? (
          <li className="text-paper/45">Brak zgłoszeń.</li>
        ) : null}
      </ul>
    </div>
  );
}
