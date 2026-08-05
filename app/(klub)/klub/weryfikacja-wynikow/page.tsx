"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AthleteProfile,
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { Modal } from "@/components/ui/Modal";
import { formatResultDate } from "@/lib/athletes";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";

const STATUS_LABEL: Record<ResultStatus, string> = {
  pending: "Oczekuje",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony",
  needs_edit: "Do edycji",
};

const inputClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isCompetitionResult(r: CompetitionResult) {
  return r.kind !== "training";
}

function canStaffEdit(status: ResultStatus) {
  return status === "pending" || status === "needs_edit" || status === "accepted";
}

function findProfileForResult(
  profiles: AthleteProfile[],
  r: CompetitionResult,
): AthleteProfile | null {
  if (r.user_id) {
    const byUser = profiles.find((p) => p.user_id === r.user_id);
    if (byUser) return byUser;
  }
  return profiles.find((p) => p.display_name === r.athlete_name) ?? null;
}

export default function WeryfikacjaPage() {
  const toast = useToast();
  const { viewAs } = useKlub();
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [profiles, setProfiles] = useState<AthleteProfile[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileId, setProfileId] = useState("");
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
    setLoading(true);
    setError(null);
    try {
      const [data, profileList] = await Promise.all([
        klubFetch<CompetitionResult[]>("/api/results"),
        klubFetch<AthleteProfile[]>("/api/profiles"),
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
    if (selectedProfile.bodyweight_kg != null) {
      setBodyweight(String(selectedProfile.bodyweight_kg));
    }
  }, [selectedProfile]);

  const bwNum = bodyweight ? Number(bodyweight) : NaN;
  const previewCategory = useMemo(() => {
    if (!selectedProfile || !Number.isFinite(bwNum) || bwNum <= 0) return null;
    return resolveWeightCategory({
      birthDate: selectedProfile.birth_date,
      sex: selectedProfile.sex,
      bodyweightKg: bwNum,
    });
  }, [selectedProfile, bwNum]);

  const editingProfile = useMemo(
    () => (editing ? findProfileForResult(profiles, editing) : null),
    [editing, profiles],
  );

  const editBwNum = editBodyweight ? Number(editBodyweight) : NaN;
  const editPreviewCategory = useMemo(() => {
    if (!editingProfile || !Number.isFinite(editBwNum) || editBwNum <= 0) {
      return null;
    }
    return resolveWeightCategory({
      birthDate: editingProfile.birth_date,
      sex: editingProfile.sex,
      bodyweightKg: editBwNum,
    });
  }, [editingProfile, editBwNum]);

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
      const msg = "Podaj datę.";
      setError(msg);
      toast.error("Edycja wyniku", msg);
      return;
    }
    if (isComp) {
      if (!editEventName.trim()) {
        const msg = "Podaj nazwę zawodów.";
        setError(msg);
        toast.error("Edycja wyniku", msg);
        return;
      }
      if (!Number.isFinite(editBwNum) || editBwNum <= 0) {
        const msg = "Podaj masę ciała (kg).";
        setError(msg);
        toast.error("Edycja wyniku", msg);
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
      await klubFetch(`/api/results/${editing.id}`, {
        method: "PATCH",
        body,
      });
      toast.success(
        "Zapisano zmiany",
        editPreviewCategory ?? editing.athlete_name,
      );
      closeEdit();
      await load();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się zapisać wyniku";
      setError(msg);
      toast.error("Edycja wyniku", msg);
    } finally {
      setEditSaving(false);
    }
  }

  async function review(id: string, status: ResultStatus) {
    try {
      await klubFetch(`/api/results/${id}`, {
        method: "PATCH",
        body: {
          status,
          reviewer_note: notes[id] || null,
        },
      });
      toast.success(
        status === "accepted"
          ? "Zaakceptowano wynik"
          : status === "rejected"
            ? "Odrzucono wynik"
            : "Zaktualizowano wynik",
        STATUS_LABEL[status],
      );
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd weryfikacji";
      setError(msg);
      toast.error("Weryfikacja", msg);
    }
  }

  async function createStaffResult(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedProfile) {
      setError("Wybierz profil zawodnika.");
      toast.error("Wynik", "Wybierz profil zawodnika.");
      return;
    }
    if (!Number.isFinite(bwNum) || bwNum <= 0) {
      setError("Podaj masę ciała (kg).");
      toast.error("Wynik", "Podaj masę ciała (kg).");
      return;
    }
    if (!eventDate.trim()) {
      setError("Podaj datę zawodów.");
      toast.error("Wynik", "Podaj datę zawodów.");
      return;
    }
    setSaving(true);
    try {
      await klubFetch("/api/results", {
        method: "POST",
        body: {
          event_name: eventName.trim(),
          event_date: eventDate,
          kind: "competition",
          athlete_name: selectedProfile.display_name,
          profile_id: selectedProfile.id,
          user_id:
            selectedProfile.user_id && selectedProfile.user_id !== "manual"
              ? selectedProfile.user_id
              : null,
          snatch_kg: snatch ? Number(snatch) : null,
          clean_jerk_kg: cj ? Number(cj) : null,
          bodyweight_kg: bwNum,
          venue: venue.trim() || null,
          auto_accept: true,
        },
      });
      toast.success(
        "Dodano wynik",
        previewCategory
          ? `${selectedProfile.display_name} · ${previewCategory}`
          : selectedProfile.display_name,
      );
      setProfileId("");
      setEventName("");
      setEventDate(todayIsoDate());
      setSnatch("");
      setCj("");
      setBodyweight("");
      setVenue("");
      await load();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się dodać wyniku";
      setError(msg);
      toast.error("Dodawanie wyniku", msg);
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
          od razu trafia jako zaakceptowany. Kategoria wagowa wylicza się z
          profilu (wiek, płeć) i masy ciała.
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
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Data zawodów
          </span>
          <input
            className={inputClass}
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </label>
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
          required
        />
        <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
          {previewCategory ? (
            <>
              Kategoria:{" "}
              <span className="font-medium text-paper">{previewCategory}</span>
            </>
          ) : selectedProfile &&
            (!selectedProfile.birth_date?.trim() ||
              !selectedProfile.sex?.trim()) ? (
            <span className="text-paper/50">
              Brak daty urodzenia lub płci w profilu
            </span>
          ) : (
            <span className="text-paper/50">Kategoria po podaniu wagi</span>
          )}
        </div>
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
                <span className="border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase">
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <textarea
                  className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
                  rows={2}
                  placeholder="Notatka dla zawodnika (opcjonalnie)"
                  value={notes[r.id] ?? ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  {canStaffEdit(r.status) ? (
                    <button
                      type="button"
                      onClick={() => openEdit(r)}
                      className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
                    >
                      Edytuj
                    </button>
                  ) : null}
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
                    {canStaffEdit(r.status) ? (
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="border border-paper/25 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] uppercase"
                      >
                        Edytuj
                      </button>
                    ) : null}
                    <span className="font-display text-[10px] tracking-[0.12em] uppercase text-paper/50">
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Modal
        open={editing != null}
        title={
          editing
            ? `Edycja — ${editing.athlete_name}`
            : "Edycja wyniku"
        }
        onClose={closeEdit}
        wide
      >
        {editing ? (
          <form
            onSubmit={(e) => void saveEdit(e)}
            className="grid gap-3 sm:grid-cols-2"
          >
            <p className="text-sm text-paper/60 sm:col-span-2">
              {isCompetitionResult(editing) ? "Zawody" : "Trening"} · status:{" "}
              {STATUS_LABEL[editing.status]}
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
                  placeholder="Masa ciała (kg)"
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
                  ) : editingProfile &&
                    (!editingProfile.birth_date?.trim() ||
                      !editingProfile.sex?.trim()) ? (
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
            ) : (
              <input
                className={`${inputClass} sm:col-span-2`}
                placeholder="Miejsce (opcjonalnie)"
                value={editVenue}
                onChange={(e) => setEditVenue(e.target.value)}
              />
            )}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={editSaving}
                className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
              >
                {editSaving ? "Zapisywanie…" : "Zapisz zmiany"}
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
