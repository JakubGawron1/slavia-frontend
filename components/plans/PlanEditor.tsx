"use client";

import { DAY_LABELS, emptyWeeks, planAssignmentKind } from "@/lib/plans/helpers";
import type { StaffPlansEditor } from "@/components/plans/useStaffPlansEditor";
import { ExerciseEditor } from "@/components/plans/ExerciseEditor";
import { PlanAssignmentPanel } from "@/components/plans/PlanAssignmentPanel";
import { PlanProgressPanel } from "@/components/plans/PlanProgressPanel";
import {
  btnOutlineBrand,
  btnPrimary,
  btnSecondary,
  chipActive,
  chipIdle,
  inputClass,
  linkBtn,
  linkDanger,
  panelClass,
  sectionLabel,
} from "@/components/plans/styles";

export function PlanEditor({ editor }: { editor: StaffPlansEditor }) {
  const { editing } = editor;
  if (!editing) return null;

  const kind = planAssignmentKind(editing);
  const weeks = editor.weeksOf(editing);
  const currentExercises = editor.currentDayExercises();

  return (
    <form onSubmit={(e) => void editor.save(e, false)} className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper/10 pb-4">
        <div>
          <p className={sectionLabel}>
            {editing.id ? "Edycja planu" : "Nowy plan"}
            {editing.version ? ` · v${editing.version}` : ""}
          </p>
          <p className="mt-1 text-sm text-paper/55">
            {kind === "individual"
              ? "Przypisanie indywidualne"
              : kind === "group"
                ? "Przypisanie grupowe"
                : "Dla wszystkich zawodników"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button type="button" className={linkBtn} onClick={editor.undo}>
            Cofnij
          </button>
          <button type="button" className={linkBtn} onClick={editor.redo}>
            Ponów
          </button>
          <span className="text-paper/35">Ctrl+S · Ctrl+Z · N</span>
        </div>
      </div>

      <section className="space-y-3">
        <p className={sectionLabel}>Podstawowe</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={`${inputClass} sm:col-span-2`}
            placeholder="Tytuł"
            value={editing.title}
            onChange={(e) =>
              editor.setEditingTracked({ ...editing, title: e.target.value })
            }
            required
          />
          <input
            className={inputClass}
            placeholder="Etykieta (opcjonalnie)"
            value={editing.week_label ?? ""}
            onChange={(e) =>
              editor.setEditingTracked({ ...editing, week_label: e.target.value })
            }
          />
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(editing.is_template)}
                onChange={(e) =>
                  editor.setEditingTracked({
                    ...editing,
                    is_template: e.target.checked,
                  })
                }
              />
              Szablon katalogu
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(editing.is_season_active)}
                onChange={(e) =>
                  editor.setEditingTracked({
                    ...editing,
                    is_season_active: e.target.checked,
                  })
                }
              />
              Plan sezonu
            </label>
          </div>
          <textarea
            className={`${inputClass} sm:col-span-2`}
            placeholder="Opis programu"
            rows={2}
            value={editing.description ?? ""}
            onChange={(e) =>
              editor.setEditingTracked({ ...editing, description: e.target.value })
            }
          />
        </div>
      </section>

      <PlanAssignmentPanel
        editing={editing}
        assignMode={editor.assignMode}
        setAssignMode={editor.setAssignMode}
        users={editor.users}
        groups={editor.groups}
        setEditingTracked={editor.setEditingTracked}
        toggleUser={editor.toggleUser}
        toggleGroup={editor.toggleGroup}
      />

      <section className="space-y-3 border-t border-paper/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className={sectionLabel}>Tygodnie</p>
          {weeks.map((w, i) => (
            <button
              key={w.week_index}
              type="button"
              onClick={() => {
                editor.setWeekIdx(i);
                editor.setDayIdx(0);
              }}
              className={editor.weekIdx === i ? chipActive : chipIdle}
            >
              T{w.week_index}
            </button>
          ))}
          <button
            type="button"
            className={linkDanger}
            onClick={() =>
              editor.updateWeeks((ws) => [
                ...ws,
                ...emptyWeeks(1).map((w) => ({
                  ...w,
                  week_index: ws.length + 1,
                  label: `Tydzień ${ws.length + 1}`,
                })),
              ])
            }
          >
            + Tydzień
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className={sectionLabel}>Dzień</p>
          {(weeks[editor.weekIdx]?.days ?? []).map((d, i) => (
            <button
              key={`${d.day_of_week}-${i}`}
              type="button"
              onClick={() => editor.setDayIdx(i)}
              className={editor.dayIdx === i ? chipActive : chipIdle}
            >
              {DAY_LABELS[d.day_of_week] ?? d.day_of_week}
            </button>
          ))}
          <button
            type="button"
            className={linkDanger}
            onClick={() =>
              editor.updateWeeks((ws) => {
                const w = ws[editor.weekIdx];
                if (!w) return ws;
                const used = new Set((w.days ?? []).map((day) => day.day_of_week));
                const next = [1, 2, 3, 4, 5, 6, 7].find((n) => !used.has(n)) ?? 1;
                w.days = [...(w.days ?? []), { day_of_week: next, label: null, exercises: [] }];
                return ws;
              })
            }
          >
            + Dzień
          </button>
        </div>

        {editor.library.length > 0 ? (
          <div className="space-y-2">
            <p className={sectionLabel}>Szybko z biblioteki</p>
            <div className="flex flex-wrap gap-2">
              {editor.library.slice(0, 12).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="border border-paper/15 bg-chrome/30 px-2.5 py-1 text-[11px] text-paper/75 hover:border-brand/40 hover:text-paper"
                  onClick={() => editor.addExercise(item)}
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-3 border-t border-paper/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={sectionLabel}>
            Ćwiczenia ·{" "}
            {DAY_LABELS[weeks[editor.weekIdx]?.days?.[editor.dayIdx]?.day_of_week ?? 0] ??
              "dzień"}
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => editor.addExercise()}
          >
            + Ćwiczenie
          </button>
        </div>

        <div className="space-y-3">
          {currentExercises.length === 0 ? (
            <p className="border border-dashed border-paper/15 px-4 py-8 text-center text-sm text-paper/45">
              Brak ćwiczeń w tym dniu — dodaj z biblioteki albo ręcznie.
            </p>
          ) : null}
          {currentExercises.map((ex, i) => (
            <ExerciseEditor
              key={ex.id}
              ex={ex}
              index={i}
              onPatch={editor.patchExercise}
              onDuplicate={(copy) => editor.setDayExercises([...editor.currentDayExercises(), copy])}
              onRemove={(i2) =>
                editor.setDayExercises(currentExercises.filter((_, j) => j !== i2))
              }
              onDragStart={editor.setDragEx}
              onDragOver={(e) => e.preventDefault()}
              onDrop={editor.onDropEx}
            />
          ))}
        </div>
      </section>

      {editing.id ? (
        <PlanProgressPanel
          progressAll={editor.progressAll}
          users={editor.users}
          replyDrafts={editor.replyDrafts}
          setReplyDrafts={editor.setReplyDrafts}
          onSaveReply={(userId) => void editor.saveReply(userId)}
        />
      ) : null}

      <div className="sticky bottom-0 z-[5] -mx-4 flex flex-wrap gap-2 border-t border-paper/10 bg-chrome/95 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
        <button type="submit" className={btnPrimary}>
          Zapisz
        </button>
        <button
          type="button"
          onClick={(e) => void editor.save(e, true)}
          className={btnOutlineBrand}
        >
          Opublikuj / podpisz
        </button>
        <button type="button" onClick={editor.closeEditing} className={btnSecondary}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
