"use client";

import type { PlanExercise, PlanProgressEntry, TrainingPlan, PlanWeek } from "@/lib/api/generated/models";
import { DAY_LABELS } from "@/lib/plans/helpers";
import { ProgressEntryRow } from "@/components/plans/ProgressEntryRow";
import type { AthleteBests } from "@/components/plans/useAthletePlanProgress";

export function AthletePlanDay({
  plan,
  weeks,
  weekIdx,
  setWeekIdx,
  onlyToday,
  setOnlyToday,
  dayExercises,
  entryFor,
  patchEntry,
  bests,
  today,
  completedAt,
  feedback,
  updateFeedback,
  coachReply,
  coachRepliedAt,
  saved,
  onSave,
}: {
  plan: TrainingPlan;
  weeks: PlanWeek[];
  weekIdx: number;
  setWeekIdx: (n: number) => void;
  onlyToday: boolean;
  setOnlyToday: (v: boolean) => void;
  dayExercises: { day: number; ex: PlanExercise }[];
  entryFor: (exId: string) => PlanProgressEntry;
  patchEntry: (exId: string, patch: Partial<PlanProgressEntry>) => void;
  bests: AthleteBests;
  today: number;
  completedAt: string | null;
  feedback: string;
  updateFeedback: (v: string) => void;
  coachReply: string | null;
  coachRepliedAt: string | null;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="space-y-5 border border-paper/10 bg-paper/[0.03] p-4 md:p-6">
      <div>
        <h2 className="font-display text-xl uppercase">{plan.title}</h2>
        {plan.week_label ? (
          <p className="mt-1 text-sm text-paper/50">{plan.week_label}</p>
        ) : null}
        {plan.description ? (
          <p className="mt-2 text-sm text-paper/65">{plan.description}</p>
        ) : null}
        {completedAt ? (
          <p className="mt-3 inline-block border border-brand bg-brand/15 px-2 py-1 font-display text-[10px] tracking-wider text-brand uppercase">
            Plan ukończony
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {weeks.length > 1
          ? weeks.map((w, i) => (
              <button
                key={w.week_index}
                type="button"
                onClick={() => setWeekIdx(i)}
                className={
                  weekIdx === i
                    ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                    : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/60 uppercase"
                }
              >
                {w.label ?? `T${w.week_index}`}
              </button>
            ))
          : null}
        <label className="ml-auto flex items-center gap-1.5 text-xs text-paper/60">
          <input
            type="checkbox"
            checked={onlyToday}
            onChange={(e) => setOnlyToday(e.target.checked)}
          />
          Tylko dziś ({DAY_LABELS[today]})
        </label>
      </div>

      {dayExercises.length === 0 ? (
        <p className="border border-paper/10 bg-paper/[0.03] px-4 py-6 text-sm text-paper/50">
          {onlyToday
            ? "Brak ćwiczeń na dziś w tym tygodniu — wyłącz filtr lub wybierz inny tydzień."
            : "Ten plan nie ma jeszcze ćwiczeń. Poproś trenera o uzupełnienie rozpiski."}
        </p>
      ) : null}

      <ul className="space-y-3">
        {dayExercises.map(({ day, ex }) => (
          <ProgressEntryRow
            key={ex.id}
            day={day}
            ex={ex}
            entry={entryFor(ex.id)}
            bests={bests}
            today={today}
            onPatch={(patch) => patchEntry(ex.id, patch)}
          />
        ))}
      </ul>

      <textarea
        className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
        rows={2}
        placeholder="Komentarz do trenera (feedback)"
        value={feedback}
        onChange={(e) => updateFeedback(e.target.value)}
      />

      {coachReply ? (
        <div className="border border-brand/30 bg-brand/[0.08] p-3 text-sm">
          <p className="font-display text-[10px] tracking-wider text-brand uppercase">
            Odpowiedź trenera
            {coachRepliedAt
              ? ` · ${new Intl.DateTimeFormat("pl-PL", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(coachRepliedAt))}`
              : ""}
          </p>
          <p className="mt-1 text-paper/80">{coachReply}</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSave}
        className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
      >
        {saved ? "Zapisano" : "Zapisz postęp"}
      </button>
    </div>
  );
}
