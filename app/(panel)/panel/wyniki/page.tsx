"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AthleteProfile,
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import {
  createResult,
  listResults,
  updateResult,
} from "@/lib/api/generated/default/default";
import { listPublicProfiles } from "@/lib/api/generated/public/public";
import { useToast } from "@/components/toast/ToastProvider";
import { usePanel } from "@/components/panel/PanelProvider";
import { Modal } from "@/components/ui/Modal";
import { formatResultDate } from "@/lib/athletes";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";

const STATUS: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

const inputClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

function isCompetitionResult(r: CompetitionResult) {
  return r.kind !== "training";
}

function canAthleteEdit(status: ResultStatus) {
  return (
    status === "pending" || status === "needs_edit" || status === "accepted"
  );
}

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

  const [editing, setEditing] = useState<CompetitionResult | null>(null);
  const [editEventName, setEditEventName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editSnatch, setEditSnatch] = useState("");
  const [editCj, setEditCj] = useState("");
  const [editBodyweight, setEditBodyweight] = useState("");
  const [editVenue, setEditVenue] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [mineRes, profilesRes] = await Promise.all([
        listResults({ mine: true }),
        listPublicProfiles().catch(() => null),
      ]);
      setResults((mineRes.data as CompetitionResult[]) ?? []);
      const profiles =
        (profilesRes?.data as AthleteProfile[] | undefined) ?? [];
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

  const editBwNum = editBodyweight ? Number(editBodyweight) : NaN;
  const editPreviewCategory = useMemo(() => {
    if (
      !editing ||
      !isCompetitionResult(editing) ||
      !Number.isFinite(editBwNum) ||
      editBwNum <= 0
    ) {
      return null;
    }
    return resolveWeightCategory({
      birthDate: profile?.birth_date,
      sex: profile?.sex,
      bodyweightKg: editBwNum,
    });
  }, [editing, editBwNum, profile?.birth_date, profile?.sex]);

  function openEdit(r: CompetitionResult) {
    setEditing(r);
    setEditEventName(isCompetitionResult(r) ? r.event_name : "");
    setEditEventDate(r.event_date ?? todayIsoDate());
    setEditSnatch(r.snatch_kg != null ? String(r.snatch_kg) : "");
    setEditCj(r.clean_jerk_kg != null ? String(r.clean_jerk_kg) : "");
    setEditBodyweight(
      r.bodyweight_kg != null ? String(r.bodyweight_kg) : "",
    );
    setEditVenue(r.venue ?? "");
  }

  function closeEdit() {
    setEditing(null);
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    const isComp = isCompetitionResult(editing);
    if (!editEventDate.trim()) {
      const msg = "Podaj datę zawodów / treningu.";
      setError(msg);
      toast.error("Poprawa wyniku", msg);
      return;
    }
    if (isComp) {
      if (!profileReady) {
        const msg =
          "Uzupełnij w profilu datę urodzenia i płeć — kategoria wylicza się automatycznie.";
        setError(msg);
        toast.error("Poprawa wyniku", msg);
        return;
      }
      if (!editEventName.trim()) {
        const msg = "Podaj nazwę zawodów.";
        setError(msg);
        toast.error("Poprawa wyniku", msg);
        return;
      }
      if (!Number.isFinite(editBwNum) || editBwNum <= 0) {
        const msg = "Podaj masę ciała na zawodach (kg).";
        setError(msg);
        toast.error("Poprawa wyniku", msg);
        return;
      }
    }
    setEditSaving(true);
    try {
      const body: Record<string, unknown> = {
        event_date: editEventDate,
        snatch_kg: editSnatch ? Number(editSnatch) : null,
        clean_jerk_kg: editCj ? Number(editCj) : null,
        venue: editVenue.trim() || null,
      };
      if (isComp) {
        body.event_name = editEventName.trim();
        body.bodyweight_kg = editBwNum;
      }
      await updateResult(editing.id, body);
      toast.success(
        editing.status === "accepted"
          ? "Wysłano do ponownej weryfikacji"
          : "Wysłano poprawiony wynik",
        editPreviewCategory ?? editing.event_name,
      );
      closeEdit();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się zapisać";
      setError(msg);
      toast.error("Poprawa wyniku", msg);
    } finally {
      setEditSaving(false);
    }
  }

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
      await createResult({
        event_name: resolvedName,
        event_date: eventDate,
        kind,
        snatch_kg: snatch ? Number(snatch) : null,
        clean_jerk_kg: cj ? Number(cj) : null,
        bodyweight_kg: kind === "competition" ? bwNum : null,
        venue: venue.trim() || null,
        category: null,
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
                {canAthleteEdit(r.status) ? (
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="border border-paper/25 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] uppercase"
                  >
                    Popraw
                  </button>
                ) : null}
                <span className="font-display text-[10px] tracking-[0.12em] uppercase text-paper/50">
                  {STATUS[r.status] ?? r.status} ·{" "}
                  {r.kind === "training" ? "trening" : "zawody"}
                </span>
              </div>
            </div>
          </li>
        ))}
        {results.length === 0 ? (
          <li className="text-paper/45">Brak zgłoszeń.</li>
        ) : null}
      </ul>

      <Modal
        open={editing != null}
        title={editing ? `Popraw wynik — ${editing.event_name}` : "Popraw wynik"}
        onClose={closeEdit}
        wide
      >
        {editing ? (
          <form
            onSubmit={(e) => void saveEdit(e)}
            className="grid gap-3 sm:grid-cols-2"
          >
            {editing.status === "needs_edit" && editing.reviewer_note ? (
              <p className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-paper/80 sm:col-span-2">
                Uwaga trenera: {editing.reviewer_note}
              </p>
            ) : null}
            <p className="text-sm text-paper/60 sm:col-span-2">
              {isCompetitionResult(editing) ? "Zawody" : "Trening"}
              {editing.status === "accepted"
                ? " · po zapisie wynik wróci do weryfikacji (nawet jeśli był już zaakceptowany)"
                : " · po zapisie wynik wróci do weryfikacji"}
            </p>
            {isCompetitionResult(editing) ? (
              <input
                className={`${inputClass} sm:col-span-2`}
                placeholder="Nazwa zawodów"
                value={editEventName}
                onChange={(e) => setEditEventName(e.target.value)}
                required
              />
            ) : null}
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                {isCompetitionResult(editing)
                  ? "Data zawodów"
                  : "Data treningu"}
              </span>
              <input
                className={inputClass}
                type="date"
                value={editEventDate}
                onChange={(e) => setEditEventDate(e.target.value)}
                required
              />
            </label>
            <input
              className={inputClass}
              placeholder="Rwanie (kg)"
              type="number"
              step="0.5"
              value={editSnatch}
              onChange={(e) => setEditSnatch(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Podrzut (kg)"
              type="number"
              step="0.5"
              value={editCj}
              onChange={(e) => setEditCj(e.target.value)}
            />
            {isCompetitionResult(editing) ? (
              <>
                <input
                  className={inputClass}
                  placeholder="Aktualna masa ciała (kg)"
                  type="number"
                  step="0.1"
                  value={editBodyweight}
                  onChange={(e) => setEditBodyweight(e.target.value)}
                  required
                />
                <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
                  {editPreviewCategory ? (
                    <>
                      Kategoria:{" "}
                      <span className="font-medium text-paper">
                        {editPreviewCategory}
                      </span>
                    </>
                  ) : !profileReady ? (
                    <span className="text-paper/50">
                      Brak daty urodzenia lub płci w profilu
                    </span>
                  ) : (
                    <span className="text-paper/50">
                      Kategoria po podaniu wagi
                    </span>
                  )}
                </div>
                <input
                  className={`${inputClass} sm:col-span-2`}
                  placeholder="Miejsce zawodów"
                  value={editVenue}
                  onChange={(e) => setEditVenue(e.target.value)}
                />
              </>
            ) : null}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={editSaving}
                className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
              >
                {editSaving ? "Zapisywanie…" : "Wyślij poprawkę"}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
              >
                Anuluj
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
