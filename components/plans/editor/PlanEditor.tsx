"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import {
  useListGroups,
  useListLibrary,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import { CopyToolbar } from "@/components/plans/editor/CopyToolbar";
import { DayColumn } from "@/components/plans/editor/DayColumn";
import { usePlanEditor } from "@/components/plans/editor/usePlanEditor";
import { WeekSwitcher } from "@/components/plans/editor/WeekSwitcher";
import { AssignmentFields } from "@/components/plans/shared/AssignmentFields";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineStatus } from "@/components/ui/InlineStatus";
import {
  PLAN_BTN,
  PLAN_BTN_GHOST,
  PLAN_EYEBROW,
  PLAN_FIELD,
  PLAN_STATUS_LABEL,
  PLAN_SURFACE,
  WEEKDAY_SHORT,
} from "@/lib/plans/labels";
import type {
  AthleteGroup,
  AthleteProfile,
  LibraryExercise,
  PlanDay,
  PlanStatus,
} from "@/lib/api/generated/models";

export function PlanEditor({
  initial,
  persisted,
}: {
  initial: TrainingPlan;
  persisted: boolean;
}) {
  const e = usePlanEditor(initial, persisted);
  const libraryQuery = useListLibrary();
  const groupsQuery = useListGroups();
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const library = (libraryQuery.data?.data as LibraryExercise[] | undefined) ?? [];
  const groups = (groupsQuery.data?.data as AthleteGroup[] | undefined) ?? [];
  const profiles =
    (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];
  const weeks = e.plan.weeks ?? [];
  const weekdays = (e.week?.days ?? []).map((d) => d.weekday);
  const isCatalog = (e.plan.status ?? "draft") === "catalog";

  function setDay(next: PlanDay) {
    e.setPlan({
      ...e.plan,
      weeks: weeks.map((w) =>
        w.index !== e.weekIndex
          ? w
          : {
              ...w,
              days: (w.days ?? []).map((d) => (d.id === next.id ? next : d)),
            },
      ),
    });
  }

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Plany"
        title={persisted ? e.plan.title || "Edytor planu" : "Szkic (niezapisany)"}
        description={
          isCatalog
            ? "Szablon katalogu — zawodnicy go nie widzą, dopóki ktoś nie użyje kopii."
            : persisted
              ? undefined
              : "Zapisz, żeby plan trafił na listę i do zawodników."
        }
        backHref="/klub/plany"
        backLabel="Lista planów"
      />

      <section className={`${PLAN_SURFACE} px-5 py-5`}>
        <p className={`${PLAN_EYEBROW} mb-4`}>Meta</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-[11px] text-paper/45">
            Tytuł
            <input
              className={PLAN_FIELD}
              value={e.plan.title}
              onChange={(ev) =>
                e.setPlan({ ...e.plan, title: ev.target.value })
              }
            />
          </label>
          <label className="text-[11px] text-paper/45">
            Start
            <input
              type="date"
              className={PLAN_FIELD}
              value={e.plan.starts_on ?? ""}
              onChange={(ev) =>
                e.setPlan({
                  ...e.plan,
                  starts_on: ev.target.value || null,
                })
              }
            />
            <span className="mt-1 block text-[10px] text-paper/35">
              Puste = dziś przy publikacji
            </span>
          </label>
          <label className="text-[11px] text-paper/45">
            Tygodnie
            <input
              type="number"
              min={4}
              max={16}
              className={PLAN_FIELD}
              value={weeks.length || 8}
              onChange={(ev) => e.setWeekCount(Number(ev.target.value) || 8)}
            />
          </label>
          <label className="text-[11px] text-paper/45">
            Status
            <select
              className={PLAN_FIELD}
              value={e.plan.status ?? "draft"}
              onChange={(ev) => e.setStatus(ev.target.value as PlanStatus)}
            >
              {(["draft", "published", "archived", "catalog"] as const).map(
                (s) => (
                  <option key={s} value={s}>
                    {PLAN_STATUS_LABEL[s]}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-2 text-[11px] text-paper/45">Dni mikrocyklu</legend>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6, 7] as const).map((d) => {
              const on = weekdays.includes(d);
              return (
                <label
                  key={d}
                  className={`cursor-pointer border px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase ${
                    on
                      ? "border-brand/40 bg-brand/15 text-brand"
                      : "border-paper/20 text-paper/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      const next = on
                        ? weekdays.filter((x) => x !== d)
                        : [...weekdays, d].sort((a, b) => a - b);
                      e.setWeekdays(next);
                    }}
                  />
                  {WEEKDAY_SHORT[d]}
                </label>
              );
            })}
          </div>
        </fieldset>
        {isCatalog ? null : (
          <label className="mt-4 flex items-center gap-2 text-sm text-paper/65">
            <input
              type="checkbox"
              checked={Boolean(e.plan.is_current)}
              onChange={(ev) =>
                e.setPlan({ ...e.plan, is_current: ev.target.checked })
              }
            />
            Plan sezonu (aktualny na pulpicie)
          </label>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeekSwitcher
          weekIndex={e.weekIndex}
          weeks={weeks.map((w) => w.index)}
          onChange={e.setWeekIndex}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={PLAN_BTN_GHOST}
            disabled={e.saving}
            onClick={() => void e.save()}
          >
            {e.saving ? "Zapisywanie…" : "Zapisz"}
          </button>
          {e.savedAt ? (
            <span className="self-center font-display text-[10px] tracking-[0.12em] text-paper/35 uppercase">
              {e.saving
                ? "Zapisuję…"
                : `Zapisano ${e.savedAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`}
            </span>
          ) : e.saving ? (
            <span className="self-center font-display text-[10px] tracking-[0.12em] text-paper/35 uppercase">
              Zapisuję…
            </span>
          ) : null}
          {isCatalog ? null : (
            <button
              type="button"
              className={PLAN_BTN}
              disabled={e.saving}
              onClick={() => void e.publish()}
            >
              {e.saving ? "Publikacja…" : "Publikuj"}
            </button>
          )}
        </div>
      </div>
      {e.error ? <InlineStatus kind="error">{e.error}</InlineStatus> : null}

      <CopyToolbar
        weekIndex={e.weekIndex}
        weeks={weeks.map((w) => w.index)}
        weekdays={weekdays}
        onCopyDayToWeek={e.copyDayToWeek}
        onCopyDayToAll={e.copyDayToAll}
        onCopyWeekTo={e.copyWeekTo}
        onCopyWeekToAll={e.copyWeekToAll}
      />

      <div className="space-y-5">
        {(e.week?.days ?? []).map((day) => (
          <DayColumn
            key={day.id}
            day={day}
            library={library}
            onChange={setDay}
          />
        ))}
        {(e.week?.days ?? []).length === 0 ? (
          <p className="text-sm text-paper/45">
            Ten tydzień nie ma dni treningowych.
          </p>
        ) : null}
      </div>

      <section className={`${PLAN_SURFACE} grid gap-6 px-5 py-5 lg:grid-cols-2`}>
        {isCatalog ? (
          <p className="text-sm text-paper/50">
            Przypisanie ustawisz na kopii po „Użyj szablonu”.
          </p>
        ) : (
          <AssignmentFields
            value={e.plan.assignment ?? { kind: "none" }}
            onChange={e.setAssignment}
            profiles={profiles}
            groups={groups}
          />
        )}
        <label className="text-[11px] text-paper/45">
          Notatki planu
          <textarea
            className={PLAN_FIELD}
            rows={4}
            value={e.plan.notes ?? ""}
            onChange={(ev) =>
              e.setPlan({ ...e.plan, notes: ev.target.value || null })
            }
          />
        </label>
      </section>
    </div>
  );
}
