"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AthleteProfile,
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { useToast } from "@/components/toast/ToastProvider";
import { usePanel } from "@/components/panel/PanelProvider";
import { formatResultDate } from "@/lib/athletes";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";

const STATUS: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function WynikiPage() {
  const toast = useToast();
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<"competition" | "training">("competition");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(todayIsoDate);
  const [snatch, setSnatch] = useState("");
  const [cj, setCj] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [venue, setVenue] = useState("");

  const load = useCallback(async () => {
    try {
      const [mine, profiles] = await Promise.all([
        klubFetch<CompetitionResult[]>("/api/results?mine=true"),
        klubFetch<AthleteProfile[]>("/api/public/profiles").catch(
          () => [] as AthleteProfile[],
        ),
      ]);
      setResults(mine);
      const uid = viewAs?.userId ?? user?.id;
      setProfile(uid ? profiles.find((p) => p.user_id === uid) ?? null : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    }
  }, [user?.id, viewAs?.userId]);

  useEffect(() => {
    void load();
  }, [load, scopeKey]);

  const bwNum = bodyweight ? Number(bodyweight) : NaN;
  const previewCategory = useMemo(() => {
    if (kind !== "competition" || !Number.isFinite(bwNum) || bwNum <= 0) {
      return null;
    }
    return resolveWeightCategory({
      birthDate: profile?.birth_date,
      sex: profile?.sex,
      bodyweightKg: bwNum,
    });
  }, [kind, bwNum, profile?.birth_date, profile?.sex]);

  const profileReady =
    Boolean(profile?.birth_date?.trim()) && Boolean(profile?.sex?.trim());

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const resolvedName =
      kind === "training" ? "Trening" : eventName.trim();
    if (!eventDate.trim()) {
      const msg = "Podaj datę zawodów / treningu.";
      setError(msg);
      toast.error("Wysyłanie wyniku", msg);
      return;
    }
    if (kind === "competition") {
      if (!profileReady) {
        const msg =
          "Uzupełnij w profilu datę urodzenia i płeć — kategoria wylicza się automatycznie.";
        setError(msg);
        toast.error("Wysyłanie wyniku", msg);
        return;
      }
      if (!Number.isFinite(bwNum) || bwNum <= 0) {
        const msg = "Podaj masę ciała na zawodach (kg).";
        setError(msg);
        toast.error("Wysyłanie wyniku", msg);
        return;
      }
    }
    try {
      await klubFetch("/api/results", {
        method: "POST",
        body: {
          event_name: resolvedName,
          event_date: eventDate,
          kind,
          snatch_kg: snatch ? Number(snatch) : null,
          clean_jerk_kg: cj ? Number(cj) : null,
          bodyweight_kg:
            kind === "competition" ? bwNum : null,
          venue: venue.trim() || null,
          category: null,
        },
      });
      setEventName("");
      setEventDate(todayIsoDate());
      setSnatch("");
      setCj("");
      setBodyweight("");
      setVenue("");
      toast.success(
        "Wysłano wynik do weryfikacji",
        previewCategory ?? resolvedName,
      );
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się wysłać";
      setError(msg);
      toast.error("Wysyłanie wyniku", msg);
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
        {kind === "competition" ? (
          <input
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2"
            placeholder="Nazwa zawodów"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        ) : null}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            {kind === "competition" ? "Data zawodów" : "Data treningu"}
          </span>
          <input
            className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </label>
        <input
          className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Rwanie (kg)"
          type="number"
          step="0.5"
          value={snatch}
          onChange={(e) => setSnatch(e.target.value)}
        />
        <input
          className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Podrzut (kg)"
          type="number"
          step="0.5"
          value={cj}
          onChange={(e) => setCj(e.target.value)}
        />
        {kind === "competition" ? (
          <>
            <input
              className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="Aktualna masa ciała (kg)"
              type="number"
              step="0.1"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              required
            />
            <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
              {previewCategory ? (
                <>
                  Kategoria:{" "}
                  <span className="font-medium text-paper">{previewCategory}</span>
                </>
              ) : !profileReady ? (
                <span className="text-paper/50">
                  Brak daty urodzenia lub płci w profilu
                </span>
              ) : (
                <span className="text-paper/50">Kategoria po podaniu wagi</span>
              )}
            </div>
            <input
              className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2"
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
              {r.event_date ? `${formatResultDate(r.event_date)} · ` : ""}
              {r.snatch_kg ?? "—"} / {r.clean_jerk_kg ?? "—"} · total{" "}
              {r.total_kg ?? "—"} kg
              {r.category ? ` · ${r.category}` : ""}
              {r.bodyweight_kg != null ? ` · ${r.bodyweight_kg} kg` : ""}
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
