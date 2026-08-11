"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AthleteProfile, CompetitionResult } from "@/lib/api/generated/models";
import {
  createResult,
  listResults,
  updateResult,
} from "@/lib/api/generated/default/default";
import { listPublicProfiles } from "@/lib/api/generated/public/public";
import { useToast } from "@/components/toast/ToastProvider";
import { usePanel } from "@/components/panel/PanelProvider";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";
import {
  editFormFromResult,
  isCompetitionResult,
  todayIsoDate,
  type ResultEditFormValues,
} from "@/components/results/shared";

export type WynikKind = "competition" | "training";

export function usePanelWyniki() {
  const toast = useToast();
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<WynikKind>("competition");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(todayIsoDate);
  const [snatch, setSnatch] = useState("");
  const [cj, setCj] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [venue, setVenue] = useState("");

  const [editing, setEditing] = useState<CompetitionResult | null>(null);
  const [editValues, setEditValues] = useState<ResultEditFormValues | null>(null);
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

  const editBwNum = editValues?.bodyweight ? Number(editValues.bodyweight) : NaN;
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
      if (!editValues.eventName.trim()) {
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
    const resolvedName = kind === "training" ? "Trening" : eventName.trim();
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

  return {
    results,
    error,
    kind,
    setKind,
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
    previewCategory,
    profileReady,
    editing,
    editValues,
    editPreviewCategory,
    editSaving,
    openEdit,
    closeEdit,
    setEditField,
    saveEdit,
    submit,
  };
}
