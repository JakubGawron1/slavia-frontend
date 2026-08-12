"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useStaffPlansEditor } from "@/components/plans/useStaffPlansEditor";
import { PlanEditor } from "@/components/plans/PlanEditor";
import { PlanList } from "@/components/plans/PlanList";
import { CatalogTab } from "@/components/plans/CatalogTab";
import { ArchiveTab } from "@/components/plans/ArchiveTab";
import { ExerciseLibraryTab } from "@/components/plans/ExerciseLibraryTab";
import { AthleteGroupsTab } from "@/components/plans/AthleteGroupsTab";
import {
  btnPrimary,
  btnSecondary,
  inputClass,
  sectionLabel,
  tabActive,
  tabIdle,
} from "@/components/plans/styles";

export function StaffPlansInner() {
  const editor = useStaffPlansEditor();
  const editingPlans = Boolean(editor.editing && editor.tab === "plans");

  return (
    <div className="animate-rise max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Trening
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
            Plany treningowe
          </h1>
          <p className="mt-2 max-w-xl text-sm text-paper/55">
            Tygodnie, dni, biblioteka ćwiczeń, katalog programów i grupy
            zawodników.
          </p>
        </div>
        {editor.tab === "plans" && !editingPlans ? (
          <button type="button" onClick={editor.startNew} className={btnPrimary}>
            Nowy plan
          </button>
        ) : null}
        {editor.tab === "groups" && !editor.groupForm ? (
          <button
            type="button"
            className="border border-brand/50 bg-brand/15 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase hover:border-brand hover:bg-brand/25"
            onClick={() =>
              editor.setGroupForm({
                id: "",
                name: "",
                member_user_ids: [],
                created_by: "",
                created_at: "",
                updated_at: "",
              })
            }
          >
            Nowa grupa
          </button>
        ) : null}
      </div>

      {!editingPlans ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sekcje planów">
          {(
            [
              ["plans", "Aktywne", editor.plans.length],
              ["catalog", "Katalog", editor.templates.length],
              ["library", "Biblioteka", editor.library.length],
              ["groups", "Grupy", editor.groups.length],
              ["archive", "Archiwum", editor.archive.length],
            ] as const
          ).map(([k, label, count]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={editor.tab === k}
              onClick={() => editor.setTab(k)}
              className={editor.tab === k ? tabActive : tabIdle}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {editor.error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {editor.error}
        </p>
      ) : null}

      {editor.aiEnabled && editor.tab === "plans" && !editingPlans ? (
        <div className="flex flex-wrap items-end gap-3 border border-paper/10 bg-paper/[0.03] p-4">
          <label className="min-w-[200px] flex-1 space-y-1.5">
            <span className={sectionLabel}>Szkic AI</span>
            <input
              className={inputClass}
              placeholder="Opisz program (np. 8 tygodni siły, 3×/tyg.)…"
              value={editor.aiPrompt}
              onChange={(e) => editor.setAiPrompt(e.target.value)}
              disabled={editor.aiBusy}
            />
          </label>
          <label className="w-24 space-y-1.5">
            <span className={sectionLabel}>Tyg.</span>
            <input
              className={inputClass}
              type="number"
              min={1}
              max={16}
              value={editor.aiWeeks}
              onChange={(e) =>
                editor.setAiWeeks(
                  e.target.value ? Number(e.target.value) : 4,
                )
              }
              disabled={editor.aiBusy}
            />
          </label>
          <button
            type="button"
            onClick={() => void editor.doAiDraft()}
            className={btnSecondary}
            disabled={editor.aiBusy || !editor.aiPrompt.trim()}
          >
            {editor.aiBusy ? "Generuję…" : "Generuj szkic"}
          </button>
        </div>
      ) : null}

      {editor.editing && editor.tab === "plans" ? <PlanEditor editor={editor} /> : null}

      {editor.tab === "plans" && !editingPlans ? (
        <PlanList
          plans={editor.plans}
          onEdit={editor.openEdit}
          onRemove={(id) => editor.remove(id)}
          onCopy={(id) => void editor.doCopy(id)}
          onVersion={(id) => void editor.doVersion(id)}
        />
      ) : null}

      {editor.tab === "catalog" ? (
        <CatalogTab templates={editor.templates} onCopy={(id) => void editor.doCopy(id)} />
      ) : null}

      {editor.tab === "archive" ? (
        <ArchiveTab
          archive={editor.archive}
          onEdit={editor.openEdit}
          onRemove={(id) => editor.remove(id)}
          onCopy={(id) => void editor.doCopy(id)}
        />
      ) : null}

      {editor.tab === "library" ? (
        <ExerciseLibraryTab
          library={editor.library}
          onReload={editor.load}
          onRequestDelete={(id) => editor.setConfirmDelete({ kind: "library", id })}
        />
      ) : null}

      {editor.tab === "groups" ? (
        <AthleteGroupsTab
          groups={editor.groups}
          users={editor.users}
          groupForm={editor.groupForm}
          setGroupForm={editor.setGroupForm}
          onReload={editor.load}
          onRequestDelete={(id, name) => editor.setConfirmDelete({ kind: "group", id, name })}
        />
      ) : null}

      <ConfirmModal
        open={editor.confirmDelete !== null}
        title={
          editor.confirmDelete?.kind === "plan"
            ? "Usuń plan"
            : editor.confirmDelete?.kind === "library"
              ? "Usuń z biblioteki"
              : "Usuń grupę"
        }
        message={
          editor.confirmDelete?.kind === "plan"
            ? "Na pewno usunąć ten plan treningowy?"
            : editor.confirmDelete?.kind === "library"
              ? "Na pewno usunąć ćwiczenie z biblioteki?"
              : `Na pewno usunąć grupę „${editor.confirmDelete?.name ?? ""}”?`
        }
        busy={editor.confirmBusy}
        onConfirm={() => void editor.runConfirmDelete()}
        onClose={() => editor.setConfirmDelete(null)}
      />
    </div>
  );
}
