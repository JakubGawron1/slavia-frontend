"use client";

import type {
  ExerciseRole,
  LibraryExercise,
  PlanDay,
  PlanExercise,
} from "@/lib/api/generated/models";
import { SortableExercises } from "@/components/plans/editor/SortableExercises";
import { PLAN_BTN_GHOST, PLAN_FIELD, WEEKDAY_LONG } from "@/lib/plans/labels";

function emptyExercise(role: ExerciseRole): PlanExercise {
  return {
    id: crypto.randomUUID(),
    name: role === "warmup" ? "Rozgrzewka" : "Ćwiczenie",
    library_id: null,
    role,
    notes: null,
    alternatives: [],
    sets: [
      {
        id: crypto.randomUUID(),
        kind: "work",
        reps: "3",
        load:
          role === "warmup"
            ? { mode: "bar" }
            : { mode: "pct", pct: 70, of: "exercise" },
        rpe: null,
      },
    ],
  };
}

export function DayColumn({
  day,
  library,
  onChange,
}: {
  day: PlanDay;
  library: LibraryExercise[];
  onChange: (next: PlanDay) => void;
}) {
  const count = (day.exercises ?? []).length;
  return (
    <section className="border border-paper/10 bg-paper/2">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-paper/10 px-5 py-4">
        <h3 className="font-display text-xl tracking-widest text-brand uppercase">
          {WEEKDAY_LONG[day.weekday] ?? `Dzień ${day.weekday}`}
        </h3>
        <p className="font-display text-[10px] tracking-[0.16em] text-paper/35 uppercase">
          {count === 0 ? "Brak ćwiczeń" : `${count} ćw.`}
        </p>
      </header>
      <div className="space-y-5 px-5 py-5">
        <label className="flex items-center gap-2 text-[11px] text-paper/45">
          <input
            type="checkbox"
            checked={day.club_session !== false}
            onChange={(e) =>
              onChange({ ...day, club_session: e.target.checked })
            }
          />
          Sesja na Slavi (kalendarz)
        </label>
        <label className="block text-[11px] text-paper/40">
          Notatka dnia
          <input
            className={PLAN_FIELD}
            placeholder="Tempo, focus, ograniczenia…"
            value={day.notes ?? ""}
            onChange={(e) => onChange({ ...day, notes: e.target.value || null })}
          />
        </label>
        <SortableExercises
          exercises={day.exercises ?? []}
          library={library}
          onChange={(exercises) => onChange({ ...day, exercises })}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            className={PLAN_BTN_GHOST}
            onClick={() =>
              onChange({
                ...day,
                exercises: [...(day.exercises ?? []), emptyExercise("main")],
              })
            }
          >
            + Must do
          </button>
          <button
            type="button"
            className={PLAN_BTN_GHOST}
            onClick={() =>
              onChange({
                ...day,
                exercises: [...(day.exercises ?? []), emptyExercise("accessory")],
              })
            }
          >
            + akcesorium
          </button>
          <button
            type="button"
            className={PLAN_BTN_GHOST}
            onClick={() =>
              onChange({
                ...day,
                exercises: [...(day.exercises ?? []), emptyExercise("warmup")],
              })
            }
          >
            + rozgrzewka
          </button>
        </div>
      </div>
    </section>
  );
}
