"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AthleteProfile,
  ExerciseRecord,
  ExerciseRecordKind,
  ExerciseRecordStatus,
  LibraryExercise,
} from "@/lib/api/generated/models";
import {
  createExerciseRecord,
  getListExerciseRecordsQueryKey,
  updateExerciseRecord,
  useListExerciseRecords,
  useListLibrary,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { RecordStatusBadge } from "@/components/records/RecordStatusBadge";
import { RecordFormFields } from "@/components/records/RecordFormFields";
import { PLAN_BTN, PLAN_FIELD } from "@/lib/plans/labels";
import { todayIsoDate } from "@/components/results/shared";

export function StaffRecordsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const recordsQuery = useListExerciseRecords();
  const libraryQuery = useListLibrary();
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const records =
    (recordsQuery.data?.data as ExerciseRecord[] | undefined) ?? [];
  const library =
    (libraryQuery.data?.data as LibraryExercise[] | undefined) ?? [];
  const profiles =
    (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("1");
  const [date, setDate] = useState(todayIsoDate());
  const [kind, setKind] = useState<ExerciseRecordKind>("test");
  const [rejectTarget, setRejectTarget] = useState<ExerciseRecord | null>(null);

  const nameOf = (uid: string) =>
    profiles.find((p) => p.user_id === uid)?.display_name ?? uid;
  const exName = (id: string) =>
    library.find((l) => l.id === id)?.name ?? id;

  const pending = records.filter(
    (r) => r.status === "pending" || r.status === "needs_edit",
  );
  const others = records.filter(
    (r) => r.status !== "pending" && r.status !== "needs_edit",
  );

  async function refresh() {
    await queryClient.invalidateQueries({
      queryKey: getListExerciseRecordsQueryKey(),
    });
  }

  async function review(id: string, status: ExerciseRecordStatus) {
    try {
      await updateExerciseRecord(id, {
        status,
        reviewer_note: notes[id] || null,
      });
      toast.success(
        status === "accepted" ? "Zaakceptowano" : "Zaktualizowano status",
      );
      await refresh();
    } catch (err) {
      toast.error(
        "Weryfikacja",
        err instanceof Error ? err.message : "Nie udało się",
      );
    }
  }

  async function createStaff(e: FormEvent) {
    e.preventDefault();
    if (!userId || !exerciseId || !kg) {
      toast.error("Rekord", "Wybierz zawodnika, ćwiczenie i kg.");
      return;
    }
    try {
      await createExerciseRecord({
        user_id: userId,
        exercise_id: exerciseId,
        kg: Number(kg),
        reps: Number(reps) || 1,
        achieved_on: date,
        kind,
        auto_accept: true,
      });
      toast.success("Wpisano rekord");
      setKg("");
      await refresh();
    } catch (err) {
      toast.error(
        "Rekord",
        err instanceof Error ? err.message : "Zapis nieudany",
      );
    }
  }

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Ludzie"
        title="Rekordy ćwiczeń"
        description="Kolejka 1RM i wielopowtórzeń — osobno od weryfikacji dwuboju. Wpis za zawodnika od razu jako zaakceptowany."
      />

      <form
        onSubmit={createStaff}
        className="grid gap-3 border border-paper/10 p-4 sm:grid-cols-2"
      >
        <h2 className="font-display text-sm uppercase sm:col-span-2">
          Wpis za zawodnika
        </h2>
        <RecordFormFields
          library={library}
          values={{ exerciseId, kg, reps, date, kind }}
          onChange={(patch) => {
            if (patch.exerciseId !== undefined) setExerciseId(patch.exerciseId);
            if (patch.kg !== undefined) setKg(patch.kg);
            if (patch.reps !== undefined) setReps(patch.reps);
            if (patch.date !== undefined) setDate(patch.date);
            if (patch.kind !== undefined) setKind(patch.kind);
          }}
          leading={
            <label className="text-sm text-paper/70">
              Zawodnik
              <select
                className={PLAN_FIELD}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Wybierz</option>
                {profiles
                  .filter((p) => p.user_id && p.user_id !== "manual")
                  .map((p) => (
                    <option key={p.id} value={p.user_id}>
                      {p.display_name}
                    </option>
                  ))}
              </select>
            </label>
          }
        />
        <button type="submit" className={PLAN_BTN}>
          Zapisz jako zaakceptowany
        </button>
      </form>

      {recordsQuery.isPending ? (
        <InlineStatus kind="loading">Ładowanie zgłoszeń…</InlineStatus>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-sm uppercase">
          Do weryfikacji ({pending.length})
        </h2>
        {pending.length === 0 && !recordsQuery.isPending ? (
          <EmptyState
            title="Brak zgłoszeń"
            description="Gdy zawodnik zgłosi PR ćwiczenia, pojawi się tutaj."
          />
        ) : (
          pending.map((r) => (
            <article key={r.id} className="border border-paper/10 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-display text-lg uppercase">
                    {nameOf(r.user_id)}
                  </p>
                  <p className="text-sm text-paper/70">
                    {exName(r.exercise_id)} · {r.kg} kg × {r.reps ?? 1} ·{" "}
                    {r.achieved_on}
                  </p>
                </div>
                <RecordStatusBadge status={r.status ?? "pending"} />
              </div>
              <label className="mt-3 block text-sm text-paper/70">
                Notatka dla zawodnika
                <textarea
                  className={PLAN_FIELD}
                  rows={2}
                  value={notes[r.id] ?? ""}
                  onChange={(e) =>
                    setNotes((m) => ({ ...m, [r.id]: e.target.value }))
                  }
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={PLAN_BTN}
                  onClick={() => void review(r.id, "accepted")}
                >
                  Akceptuj
                </button>
                <button
                  type="button"
                  className="border border-paper/20 px-3 py-2 font-display text-xs uppercase"
                  onClick={() => void review(r.id, "needs_edit")}
                >
                  Do edycji
                </button>
                <button
                  type="button"
                  className="text-sm text-paper/45"
                  onClick={() => setRejectTarget(r)}
                >
                  Odrzuć
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {others.length > 0 ? (
        <section className="space-y-2">
          <h2 className="font-display text-sm uppercase">Pozostałe</h2>
          {others.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap justify-between gap-2 border border-paper/10 px-3 py-2 text-sm"
            >
              <span>
                {nameOf(r.user_id)} · {exName(r.exercise_id)} · {r.kg} kg
              </span>
              <RecordStatusBadge status={r.status ?? "accepted"} />
            </div>
          ))}
        </section>
      ) : null}

      <ConfirmModal
        open={!!rejectTarget}
        title="Odrzucić zgłoszenie?"
        message={
          rejectTarget
            ? `${nameOf(rejectTarget.user_id)} · ${exName(rejectTarget.exercise_id)}`
            : ""
        }
        confirmLabel="Odrzuć"
        onConfirm={() => {
          if (rejectTarget) void review(rejectTarget.id, "rejected");
          setRejectTarget(null);
        }}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}
