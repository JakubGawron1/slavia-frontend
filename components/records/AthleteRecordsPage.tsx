"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  ExercisePr,
  ExerciseRecord,
  ExerciseRecordKind,
  LibraryExercise,
} from "@/lib/api/generated/models";
import {
  createExerciseRecord,
  getListExerciseRecordsQueryKey,
  getListMyPrsQueryKey,
  updateExerciseRecord,
  useListExerciseRecords,
  useListLibrary,
  useListMyPrs,
} from "@/lib/api/generated/default/default";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { RecordStatusBadge } from "@/components/records/RecordStatusBadge";
import { RecordFormFields } from "@/components/records/RecordFormFields";
import { parseOrMessage } from "@/lib/validation/parse";
import { exerciseRecordSchema } from "@/lib/validation/exerciseRecord";
import { PLAN_BTN, PLAN_FIELD } from "@/lib/plans/labels";
import { todayIsoDate } from "@/components/results/shared";

export function AthleteRecordsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const recordsQuery = useListExerciseRecords({ mine: true });
  const libraryQuery = useListLibrary();
  const prsQuery = useListMyPrs();
  const records =
    (recordsQuery.data?.data as ExerciseRecord[] | undefined) ?? [];
  const library =
    (libraryQuery.data?.data as LibraryExercise[] | undefined) ?? [];
  const prs = (prsQuery.data?.data as ExercisePr[] | undefined) ?? [];
  const [exerciseId, setExerciseId] = useState("");
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("1");
  const [date, setDate] = useState(todayIsoDate());
  const [kind, setKind] = useState<ExerciseRecordKind>("test");
  const [notes, setNotes] = useState("");
  const [editKg, setEditKg] = useState<Record<string, string>>({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseOrMessage(exerciseRecordSchema, {
      exercise_id: exerciseId,
      kg: Number(kg),
      reps: Number(reps),
      achieved_on: date,
      kind,
      notes,
    });
    if (!parsed.ok) {
      toast.error("Rekord", parsed.message);
      return;
    }
    try {
      await createExerciseRecord({
        exercise_id: parsed.data.exercise_id,
        kg: parsed.data.kg,
        reps: parsed.data.reps,
        achieved_on: parsed.data.achieved_on,
        kind: parsed.data.kind,
        notes: parsed.data.notes || null,
      });
      toast.success("Zgłoszono rekord");
      setKg("");
      setNotes("");
      await queryClient.invalidateQueries({
        queryKey: getListExerciseRecordsQueryKey({ mine: true }),
      });
      await queryClient.invalidateQueries({ queryKey: getListMyPrsQueryKey() });
    } catch (err) {
      toast.error(
        "Rekord",
        err instanceof Error ? err.message : "Zgłoszenie nieudane",
      );
    }
  }

  async function resubmit(r: ExerciseRecord) {
    const kgVal = Number(editKg[r.id] ?? r.kg);
    try {
      await updateExerciseRecord(r.id, {
        kg: kgVal,
        status: "pending",
        notes: r.notes,
      });
      toast.success("Wysłano poprawkę");
      await queryClient.invalidateQueries({
        queryKey: getListExerciseRecordsQueryKey({ mine: true }),
      });
    } catch (err) {
      toast.error(
        "Poprawka",
        err instanceof Error ? err.message : "Nie udało się wysłać",
      );
    }
  }

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Panel"
        title="Rekordy ćwiczeń"
        description="1RM przysiadu i innych ruchów — osobno od wyników dwuboju. Kadra weryfikuje zgłoszenie."
      />
      {prs.length > 0 ? (
        <section>
          <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
            Twoje 1RM
          </h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {prs.map((pr) => (
              <li
                key={pr.exercise_id}
                className="border border-paper/10 px-3 py-2 text-sm"
              >
                {library.find((l) => l.id === pr.exercise_id)?.name ??
                  pr.exercise_id}{" "}
                · {pr.kg} kg
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form onSubmit={submit} className="grid gap-3 border border-paper/10 p-4 sm:grid-cols-2">
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
          trailing={
            <label className="text-sm text-paper/70 sm:col-span-2">
              Notatka
              <input
                className={PLAN_FIELD}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          }
        />
        <button type="submit" className={PLAN_BTN}>
          Zgłoś
        </button>
      </form>

      {recordsQuery.isPending ? (
        <InlineStatus kind="loading">Ładowanie zgłoszeń…</InlineStatus>
      ) : records.length === 0 ? (
        <EmptyState
          title="Brak zgłoszeń"
          description="Zgłoś 1RM — po akceptacji kadry % PR w planie policzy kilogramy."
        />
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="border border-paper/10 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <p>
                  {library.find((l) => l.id === r.exercise_id)?.name ??
                    r.exercise_id}{" "}
                  · {r.kg} kg × {r.reps ?? 1}
                </p>
                <RecordStatusBadge status={r.status ?? "pending"} />
              </div>
              {r.reviewer_note ? (
                <p className="mt-1 text-sm text-paper/55">
                  Kadra: {r.reviewer_note}
                </p>
              ) : null}
              {r.status === "needs_edit" ? (
                <div className="mt-3 flex gap-2">
                  <label className="text-sm text-paper/70">
                    Nowy kg
                    <input
                      className={PLAN_FIELD}
                      value={editKg[r.id] ?? String(r.kg)}
                      onChange={(e) =>
                        setEditKg((m) => ({ ...m, [r.id]: e.target.value }))
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className={PLAN_BTN}
                    onClick={() => void resubmit(r)}
                  >
                    Wyślij poprawkę
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
