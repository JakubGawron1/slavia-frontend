"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useStaffPlansEditor } from "@/components/plans/useStaffPlansEditor";
import { PlanEditor } from "@/components/plans/PlanEditor";
import { PlanList } from "@/components/plans/PlanList";
import { CatalogTab } from "@/components/plans/CatalogTab";
import { ArchiveTab } from "@/components/plans/ArchiveTab";
import { ExerciseLibraryTab } from "@/components/plans/ExerciseLibraryTab";
import { AthleteGroupsTab } from "@/components/plans/AthleteGroupsTab";
import { AiDraftPanel } from "@/components/plans/AiDraftPanel";
import { AiRefineBar } from "@/components/plans/AiRefineBar";
import { filterPlansByQuery } from "@/lib/plans/completion";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineStatus } from "@/components/ui/InlineStatus";
import {
  btnPrimary,
  inputClass,
  tabActive,
  tabIdle,
} from "@/components/plans/styles";

export function StaffPlansInner() {
  const editor = useStaffPlansEditor();
  const editingPlans = Boolean(editor.editing && editor.tab === "plans");
  const filteredPlans = filterPlansByQuery(editor.plans, editor.listQuery);
  const filteredArchive = filterPlansByQuery(editor.archive, editor.listQuery);
  const filteredCatalog = filterPlansByQuery(editor.templates, editor.listQuery);
  const showSearch =
    !editingPlans &&
    (editor.tab === "plans" || editor.tab === "catalog" || editor.tab === "archive");
  const searchEmpty = Boolean(editor.listQuery.trim());
  const searchEmptyCopy = {
    title: "Brak wyników",
    description: "Zmień frazę albo wyczyść wyszukiwanie.",
  } as const;

  return (
    <div className="animate-rise space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader
          eyebrow="Trening"
          title="Plany treningowe"
          description="Tygodnie, dni, biblioteka ćwiczeń, katalog programów i grupy zawodników."
        />
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
              className={`${editor.tab === k ? tabActive : tabIdle} text-[10px] sm:text-[11px]`}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {editor.error ? (
        <InlineStatus kind="error">{editor.error}</InlineStatus>
      ) : null}

      {editor.aiEnabled && editor.tab === "plans" && !editingPlans ? (
        <AiDraftPanel ai={editor.ai} users={editor.users} groups={editor.groups} />
      ) : null}

      {showSearch ? (
        <label className="block max-w-md">
          <span className="sr-only">Szukaj planu</span>
          <input
            type="search"
            className={inputClass}
            placeholder="Szukaj po tytule lub opisie…"
            value={editor.listQuery}
            onChange={(e) => editor.setListQuery(e.target.value)}
          />
        </label>
      ) : null}

      {editor.editing && editor.tab === "plans" && editor.aiEnabled ? (
        <AiRefineBar ai={editor.ai} editing={editor.editing} />
      ) : null}

      {editor.editing && editor.tab === "plans" ? <PlanEditor editor={editor} /> : null}

      {editor.tab === "plans" && !editingPlans ? (
        <PlanList
          plans={filteredPlans}
          onEdit={editor.openEdit}
          onRemove={(id) => editor.remove(id)}
          onCopy={(id) => void editor.doCopy(id)}
          onVersion={(id) => void editor.doVersion(id)}
          onArchive={(p) => void editor.setArchived(p, true)}
          emptyTitle={searchEmpty ? searchEmptyCopy.title : "Brak aktywnych planów"}
          emptyDescription={
            searchEmpty
              ? searchEmptyCopy.description
              : "Dodaj nowy plan albo skopiuj szablon z katalogu."
          }
        />
      ) : null}

      {editor.tab === "catalog" ? (
        <CatalogTab
          templates={filteredCatalog}
          onCopy={(id) => void editor.doCopy(id)}
          emptyTitle={searchEmpty ? searchEmptyCopy.title : undefined}
          emptyDescription={searchEmpty ? searchEmptyCopy.description : undefined}
        />
      ) : null}

      {editor.tab === "archive" ? (
        <ArchiveTab
          archive={filteredArchive}
          onEdit={editor.openEdit}
          onRemove={(id) => editor.remove(id)}
          onCopy={(id) => void editor.doCopy(id)}
          onRestore={(p) => void editor.setArchived(p, false)}
          emptyTitle={searchEmpty ? searchEmptyCopy.title : undefined}
          emptyDescription={searchEmpty ? searchEmptyCopy.description : undefined}
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
