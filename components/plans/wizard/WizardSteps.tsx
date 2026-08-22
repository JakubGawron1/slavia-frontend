"use client";

import type { LibraryExercise, SkeletonLift } from "@/lib/api/generated/models";
import { AssignmentFields } from "@/components/plans/shared/AssignmentFields";
import { LiftEditor } from "@/components/plans/wizard/LiftEditor";
import type { WizardState } from "@/components/plans/wizard/usePlanWizard";
import { PLAN_FIELD, WEEKDAY_LONG } from "@/lib/plans/labels";
import type { AthleteGroup, AthleteProfile } from "@/lib/api/generated/models";

function blankMain(): SkeletonLift {
  return {
    name: "",
    library_id: null,
    work_sets: 5,
    work_reps: "3",
    start_pct: 70,
    end_pct: 70,
    pct_of: "exercise",
    load_kg: null,
  };
}

type Props = {
  step: number;
  state: WizardState;
  seeded: WizardState["days"];
  library: LibraryExercise[];
  profiles: AthleteProfile[];
  groups: AthleteGroup[];
  patch: (p: Partial<WizardState>) => void;
  setWeekdays: (days: number[]) => void;
  asCatalog?: boolean;
};

export function WizardSteps(p: Props) {
  const { step, state, seeded, library, patch, setWeekdays } = p;

  if (step === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-paper/70 sm:col-span-2">
          Tytuł
          <input
            className={PLAN_FIELD}
            value={state.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>
        <label className="text-sm text-paper/70">
          Tygodnie (4–16)
          <input
            type="number"
            min={4}
            max={16}
            className={PLAN_FIELD}
            value={state.weeks}
            onChange={(e) => patch({ weeks: Number(e.target.value) || 4 })}
          />
        </label>
        <label className="text-sm text-paper/70">
          Start
          <input
            type="date"
            className={PLAN_FIELD}
            value={state.starts_on}
            onChange={(e) => patch({ starts_on: e.target.value })}
          />
        </label>
        <label className="text-sm text-paper/70 sm:col-span-2">
          Notatki
          <textarea
            className={PLAN_FIELD}
            rows={3}
            value={state.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </label>
      </div>
    );
  }

  if (step === 1) {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm text-paper/70">Dni treningowe</legend>
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <label key={d} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.weekdays.includes(d)}
              onChange={() => {
                const next = state.weekdays.includes(d)
                  ? state.weekdays.filter((x) => x !== d)
                  : [...state.weekdays, d].sort((a, b) => a - b);
                setWeekdays(next);
              }}
            />
            {WEEKDAY_LONG[d]}
          </label>
        ))}
      </fieldset>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-paper/55">
          Te ćwiczenia wejdą do edytora jako{" "}
          <span className="text-amber-200">Must do</span> — obowiązkowe dla
          zawodnika. Akcesoria dopiszesz później w edytorze.
        </p>
        {seeded.map((day) => (
          <section key={day.weekday}>
            <h3 className="font-display text-xs tracking-[0.12em] text-amber-200 uppercase">
              {WEEKDAY_LONG[day.weekday]} · Must do
            </h3>
            <LiftEditor
              lifts={day.mains ?? []}
              library={library}
              onChange={(mains) =>
                patch({
                  days: state.days.map((d) =>
                    d.weekday === day.weekday ? { ...d, mains } : d,
                  ),
                })
              }
            />
            <button
              type="button"
              className="mt-2 text-xs text-brand"
              onClick={() =>
                patch({
                  days: state.days.map((d) =>
                    d.weekday === day.weekday
                      ? {
                          ...d,
                          mains: [...(day.mains ?? []), blankMain()],
                        }
                      : d,
                  ),
                })
              }
            >
              + ćwiczenie
            </button>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {p.asCatalog ? (
        <p className="text-sm text-paper/70">
          Szablon trafi do katalogu. Zawodnicy dostaną go dopiero po „Użyj szablonu”.
        </p>
      ) : (
        <>
          <AssignmentFields
            value={state.assignment}
            onChange={(assignment) => patch({ assignment })}
            profiles={p.profiles}
            groups={p.groups}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.is_current}
              onChange={(e) => patch({ is_current: e.target.checked })}
            />
            Plan sezonu (aktualny na pulpicie)
          </label>
        </>
      )}
    </div>
  );
}
