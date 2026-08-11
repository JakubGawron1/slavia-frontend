"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AthleteProfile,
  CompetitionResult,
  ResultStatus,
} from "@/lib/api/generated/models";
import {
  createResult,
  listProfiles,
  listResults,
  updateResult,
} from "@/lib/api/generated/default/default";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { resultEventInstant } from "@/lib/athletes";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";
import {
  editFormFromResult,
  isCompetitionResult,
  RESULT_STATUS_LABELS,
  todayIsoDate,
  type ResultEditFormValues,
} from "@/components/results/shared";
import type { AthleteFilterOption } from "@/components/results/AthleteFilterSelect";

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

export function useWeryfikacjaWynikow() {
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
  const [editValues, setEditValues] = useState<ResultEditFormValues | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  /** Filtr listy: "" = wszyscy; inaczej user_id lub `__name__:Nazwa` dla manual. */
  const [filterAthlete, setFilterAthlete] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataRes, profileRes] = await Promise.all([
        listResults(),
        listProfiles(),
      ]);
      setResults((dataRes.data as CompetitionResult[]) ?? []);
      setProfiles((profileRes.data as AthleteProfile[]) ?? []);
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
  const missingProfileInfoForCreate =
    Boolean(selectedProfile) &&
    (!selectedProfile?.birth_date?.trim() || !selectedProfile?.sex?.trim());

  const editingProfile = useMemo(
    () => (editing ? findProfileForResult(profiles, editing) : null),
    [editing, profiles],
  );

  const editBwNum =
    editValues?.bodyweight ? Number(editValues.bodyweight) : NaN;
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
  const missingProfileInfoForEdit =
    Boolean(editingProfile) &&
    (!editingProfile?.birth_date?.trim() || !editingProfile?.sex?.trim());

  function openEdit(r: CompetitionResult) {
    setEditing(r);
    setEditValues(editFormFromResult(r));
  }

  function closeEdit() {
    setEditing(null);
    setEditValues(null);
  }

  function setEditField<K extends keyof ResultEditFormValues>(
    key: K,
    value: ResultEditFormValues[K],
  ) {
    setEditValues((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing || !editValues) return;
    setError(null);
    const isComp = isCompetitionResult(editing);
    if (!editValues.eventDate.trim()) {
      const msg = "Podaj datę.";
      setError(msg);
      toast.error("Edycja wyniku", msg);
      return;
    }
    if (isComp) {
      if (!editValues.eventName.trim()) {
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
        event_date: editValues.eventDate,
        snatch_kg: editValues.snatch ? Number(editValues.snatch) : null,
        clean_jerk_kg: editValues.cj ? Number(editValues.cj) : null,
        venue: editValues.venue.trim() || null,
      };
      if (isComp) {
        body.event_name = editValues.eventName.trim();
        body.bodyweight_kg = editBwNum;
      }
      await updateResult(editing.id, body);
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
      await updateResult(id, {
        status,
        reviewer_note: notes[id] || null,
      });
      toast.success(
        status === "accepted"
          ? "Zaakceptowano wynik"
          : status === "rejected"
            ? "Odrzucono wynik"
            : "Zaktualizowano wynik",
        RESULT_STATUS_LABELS[status],
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
      await createResult({
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

  const athleteFilterOptions: AthleteFilterOption[] = useMemo(() => {
    const byKey = new Map<string, string>();
    for (const p of profiles) {
      if (p.user_id && p.user_id !== "manual") {
        byKey.set(p.user_id, p.display_name);
      } else {
        byKey.set(`__name__:${p.display_name}`, p.display_name);
      }
    }
    for (const r of results) {
      if (r.user_id) {
        if (!byKey.has(r.user_id)) byKey.set(r.user_id, r.athlete_name);
      } else {
        const key = `__name__:${r.athlete_name}`;
        if (!byKey.has(key)) byKey.set(key, r.athlete_name);
      }
    }
    return [...byKey.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"));
  }, [profiles, results]);

  const matchesAthleteFilter = useCallback(
    (r: CompetitionResult) => {
      if (!filterAthlete) return true;
      if (filterAthlete.startsWith("__name__:")) {
        return r.athlete_name === filterAthlete.slice("__name__:".length);
      }
      return r.user_id === filterAthlete;
    },
    [filterAthlete],
  );

  const byNewest = useCallback(
    (a: CompetitionResult, b: CompetitionResult) =>
      resultEventInstant(b) - resultEventInstant(a),
    [],
  );

  const pending = useMemo(
    () =>
      results
        .filter(
          (r) =>
            (r.status === "pending" || r.status === "needs_edit") &&
            matchesAthleteFilter(r),
        )
        .sort(byNewest),
    [results, matchesAthleteFilter, byNewest],
  );

  const others = useMemo(
    () =>
      results
        .filter(
          (r) =>
            r.status !== "pending" &&
            r.status !== "needs_edit" &&
            matchesAthleteFilter(r),
        )
        .sort(byNewest),
    [results, matchesAthleteFilter, byNewest],
  );

  return {
    profiles,
    notes,
    setNotes,
    error,
    loading,
    saving,
    profileId,
    setProfileId,
    eventName,
    setEventName,
    eventDate,
    setEventDate,
    snatch,
    setSnatch,
    cj,
    setCj,
    bodyweight,
    setBodyweight,
    venue,
    setVenue,
    selectedProfile,
    previewCategory,
    missingProfileInfoForCreate,
    editing,
    editValues,
    editPreviewCategory,
    missingProfileInfoForEdit,
    editSaving,
    openEdit,
    closeEdit,
    setEditField,
    saveEdit,
    review,
    createStaffResult,
    filterAthlete,
    setFilterAthlete,
    athleteFilterOptions,
    pending,
    others,
  };
}
