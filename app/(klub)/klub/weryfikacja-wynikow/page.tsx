"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AthleteProfile,
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { useKlub } from "@/components/klub/KlubProvider";

const STATUS_LABEL: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

const inputClass =
  "border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand";

export default function WeryfikacjaPage() {
  const { viewAs } = useKlub();
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [profiles, setProfiles] = useState<AthleteProfile[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileId, setProfileId] = useState("");
  const [eventName, setEventName] = useState("");
  const [snatch, setSnatch] = useState("");
  const [cj, setCj] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const viewAsUserId = viewAs?.userId;
      const [data, profileList] = await Promise.all([
        klubFetch<CompetitionResult[]>("/api/results", { viewAsUserId }),
        klubFetch<AthleteProfile[]>("/api/profiles", { viewAsUserId }),
      ]);
      setResults(data);
      setProfiles(profileList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }, [viewAs]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === profileId) ?? null,
    [profiles, profileId],
  );

  useEffect(() => {
    if (!selectedProfile) return;
    if (selectedProfile.category) setCategory(selectedProfile.category);
    if (selectedProfile.bodyweight_kg != null) {
      setBodyweight(String(selectedProfile.bodyweight_kg));
    }
  }, [selectedProfile]);

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

  async function createStaffResult(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedProfile) {
      setError("Wybierz profil zawodnika.");
      return;
    }
    setSaving(true);
    try {
      await klubFetch("/api/results", {
        method: "POST",
        body: {
          event_name: eventName.trim(),
          kind: "competition",
          athlete_name: selectedProfile.display_name,
          user_id:
            selectedProfile.user_id && selectedProfile.user_id !== "manual"
              ? selectedProfile.user_id
              : null,
          snatch_kg: snatch ? Number(snatch) : null,
          clean_jerk_kg: cj ? Number(cj) : null,
          bodyweight_kg: bodyweight ? Number(bodyweight) : null,
          category: category.trim() || null,
          venue: venue.trim() || null,
          auto_accept: true,
        },
      });
      setProfileId("");
      setEventName("");
      setSnatch("");
      setCj("");
      setBodyweight("");
      setCategory("");
      setVenue("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się dodać wyniku");
    } finally {
      setSaving(false);
    }
  }

  const pending = results.filter(
    (r) => r.status === "pending" || r.status === "needs_edit",
  );
  const others = results.filter(
    (r) => r.status !== "pending" && r.status !== "needs_edit",
  );

  return (
    <div className="animate-rise max-w-4xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Ludzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Weryfikacja wyników
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Akceptuj zgłoszenia zawodników albo wpisz wynik samodzielnie — wtedy
          od razu trafia jako zaakceptowany.
        </p>
      </div>

      {error ? (
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => void createStaffResult(e)}
        className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
      >
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
          Wpisz wynik (od razu zaakceptowany)
        </h2>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Zawodnik (profil)
          </span>
          <select
            className={inputClass}
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            required
          >
            <option value="">— Wybierz profil —</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.display_name}
                {p.category ? ` · ${p.category}` : ""}
              </option>
            ))}
          </select>
        </label>

        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Nazwa zawodów"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Rwanie (kg)"
          type="number"
          step="0.5"
          value={snatch}
          onChange={(e) => setSnatch(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Podrzut (kg)"
          type="number"
          step="0.5"
          value={cj}
          onChange={(e) => setCj(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Masa ciała (kg)"
          type="number"
          step="0.1"
          value={bodyweight}
          onChange={(e) => setBodyweight(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Kategoria wagowa"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Miejsce zawodów"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
        >
          {saving ? "Zapisywanie…" : "Dodaj i zaakceptuj"}
        </button>
      </form>

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <section className="space-y-4">
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">
          Do weryfikacji ({pending.length})
        </h2>
        <ul className="space-y-4">
          {pending.map((r) => (
            <li
              key={r.id}
              className="border border-paper/10 bg-paper/[0.03] p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg uppercase">{r.athlete_name}</p>
                  <p className="mt-1 text-sm text-paper/60">{r.event_name}</p>
                  {r.venue ? (
                    <p className="mt-0.5 text-xs text-paper/45">{r.venue}</p>
                  ) : null}
                  <p className="mt-2 text-sm text-paper/80">
                    Rwanie {r.snatch_kg ?? "—"} · Podrzut {r.clean_jerk_kg ?? "—"}{" "}
                    · Total {r.total_kg ?? "—"} kg
                    {r.category ? ` · ${r.category}` : ""}
                  </p>
                </div>
                <span className="border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase">
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

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
            </li>
          ))}
          {!loading && pending.length === 0 ? (
            <li className="text-paper/45">Brak wyników oczekujących.</li>
          ) : null}
        </ul>
      </section>

      {others.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">
            Pozostałe
          </h2>
          <ul className="space-y-3">
            {others.map((r) => (
              <li
                key={r.id}
                className="border border-paper/10 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{r.athlete_name}</p>
                    <p className="text-paper/60">{r.event_name}</p>
                    <p className="mt-1 text-paper/70">
                      {r.snatch_kg ?? "—"} / {r.clean_jerk_kg ?? "—"} · total{" "}
                      {r.total_kg ?? "—"} kg
                    </p>
                    {r.reviewer_note ? (
                      <p className="mt-1 text-xs text-paper/45">
                        Notatka: {r.reviewer_note}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-display text-[10px] tracking-[0.12em] uppercase text-paper/50">
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
