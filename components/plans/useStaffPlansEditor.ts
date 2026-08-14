"use client";

import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AthleteGroup,
  ExerciseLibraryItem,
  PublicUser,
  TrainingPlan,
} from "@/lib/api/generated/models";
import type { PlanBody } from "@/lib/api/generated/models/planBody";
import {
  copyPlan,
  createPlan,
  deletePlan,
  listPlans,
  listUsers,
  newPlanVersion,
  updatePlan,
  useListPublicFlags,
} from "@/lib/api/generated/default/default";
import { deleteLibraryItem, listLibrary } from "@/lib/api/generated/exercise-library/exercise-library";
import { deleteGroup, listGroups } from "@/lib/api/generated/groups/groups";
import { useToast } from "@/components/toast/ToastProvider";
import {
  EXPERIMENTAL_CLUB_ASSISTANT_FLAG,
  isFlagEnabled,
} from "@/lib/public-flags";
import {
  detectAssignMode,
  ensureWeeks,
  newDraftPlan,
  normalizeExerciseLoad,
  type AssignMode,
} from "@/lib/plans/helpers";
import { usePlanEditingActions } from "@/components/plans/usePlanEditingActions";
import { usePlanProgressReplies } from "@/components/plans/usePlanProgressReplies";
import { useAiPlanDraft } from "@/components/plans/useAiPlanDraft";

export type StaffPlansTab = "plans" | "catalog" | "library" | "groups" | "archive";

export type ConfirmDeleteTarget =
  | { kind: "plan"; id: string }
  | { kind: "library"; id: string }
  | { kind: "group"; id: string; name: string }
  | null;

function clonePlan(p: TrainingPlan): TrainingPlan {
  return JSON.parse(JSON.stringify(p)) as TrainingPlan;
}

function toBody(plan: TrainingPlan, publish: boolean): PlanBody {
  const weeks = ensureWeeks(plan).map((w) => ({
    ...w,
    days: (w.days ?? []).map((d) => ({
      ...d,
      exercises: (d.exercises ?? []).map((ex) => normalizeExerciseLoad(ex)),
    })),
  }));
  return {
    title: plan.title,
    description: plan.description || null,
    week_label: plan.week_label || null,
    exercises: [],
    weeks,
    assigned_user_ids: plan.assigned_user_ids ?? [],
    assigned_group_ids: plan.assigned_group_ids ?? [],
    is_template: Boolean(plan.is_template),
    archived: Boolean(plan.archived),
    is_season_active: Boolean(plan.is_season_active),
    publish: publish ? true : undefined,
  };
}

export function useStaffPlansEditor() {
  const toast = useToast();
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const aiEnabled = isFlagEnabled(
    flagsQuery.data?.data,
    EXPERIMENTAL_CLUB_ASSISTANT_FLAG,
  );

  const [tab, setTab] = useState<StaffPlansTab>("plans");
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [archive, setArchive] = useState<TrainingPlan[]>([]);
  const [templates, setTemplates] = useState<TrainingPlan[]>([]);
  const [library, setLibrary] = useState<ExerciseLibraryItem[]>([]);
  const [groups, setGroups] = useState<AthleteGroup[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [editing, setEditing] = useState<TrainingPlan | null>(null);
  const [weekIdx, setWeekIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [listQuery, setListQuery] = useState("");
  const [groupForm, setGroupForm] = useState<AthleteGroup | null>(null);
  const [assignMode, setAssignMode] = useState<AssignMode>("all");
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteTarget>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const undoStack = useRef<TrainingPlan[]>([]);
  const redoStack = useRef<TrainingPlan[]>([]);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editingRef = useRef(editing);
  editingRef.current = editing;

  const load = useCallback(async () => {
    try {
      const [pRes, aRes, tRes, lRes, gRes, uRes] = await Promise.all([
        listPlans({ archived: false }),
        listPlans({ archived: true }),
        listPlans({ templates: true }),
        listLibrary(),
        listGroups().catch(() => null),
        listUsers().catch(() => null),
      ]);
      setPlans((pRes.data as TrainingPlan[]) ?? []);
      setArchive((aRes.data as TrainingPlan[]) ?? []);
      setTemplates((tRes.data as TrainingPlan[]) ?? []);
      setLibrary((lRes.data as ExerciseLibraryItem[]) ?? []);
      setGroups((gRes?.data as AthleteGroup[] | undefined) ?? []);
      const u = (uRes?.data as PublicUser[] | undefined) ?? [];
      setUsers(u.filter((x) => x.roles.includes("zawodnik")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd planów");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function pushUndo(next: TrainingPlan) {
    if (editing) undoStack.current.push(clonePlan(editing));
    redoStack.current = [];
    setEditing(next);
  }

  function undo() {
    const prev = undoStack.current.pop();
    if (!prev || !editing) return;
    redoStack.current.push(clonePlan(editing));
    setEditing(prev);
  }

  function redo() {
    const next = redoStack.current.pop();
    if (!next || !editing) return;
    undoStack.current.push(clonePlan(editing));
    setEditing(next);
  }

  function scheduleAutosave(plan: TrainingPlan) {
    if (!plan.id) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void (async () => {
        const cur = editingRef.current;
        if (!cur?.id) return;
        try {
          await updatePlan(cur.id, toBody(cur, false));
        } catch {
          /* cichy autosave */
        }
      })();
    }, 1200);
  }

  function setEditingTracked(next: TrainingPlan) {
    pushUndo(next);
    scheduleAutosave(next);
  }

  function startNew() {
    undoStack.current = [];
    redoStack.current = [];
    setEditing(newDraftPlan());
    setAssignMode("all");
    setWeekIdx(0);
    setDayIdx(0);
    setTab("plans");
  }

  function openEdit(p: TrainingPlan) {
    undoStack.current = [];
    redoStack.current = [];
    const weeks = ensureWeeks(p);
    setEditing({
      ...p,
      weeks,
      assigned_user_ids: p.assigned_user_ids ?? [],
      assigned_group_ids: p.assigned_group_ids ?? [],
    });
    setAssignMode(detectAssignMode(p));
    setWeekIdx(0);
    setDayIdx(0);
    setTab("plans");
  }

  function closeEditing() {
    setEditing(null);
  }

  async function save(e: FormEvent, publish = false) {
    e.preventDefault();
    if (!editing) return;
    if (assignMode === "personal" && !(editing.assigned_user_ids?.length === 1)) {
      setError("Wybierz jednego zawodnika dla planu personalnego.");
      toast.error("Przypisanie", "Wybierz jednego zawodnika.");
      return;
    }
    setError(null);
    try {
      const body = toBody(editing, publish);
      if (editing.id) {
        const res = await updatePlan(editing.id, body);
        toast.success(publish ? "Opublikowano plan" : "Zapisano plan", editing.title);
        setEditing(res.data as TrainingPlan);
      } else {
        const res = await createPlan(body);
        toast.success(publish ? "Utworzono i opublikowano" : "Dodano plan", editing.title);
        setEditing(res.data as TrainingPlan);
      }
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("Plan treningowy", msg);
    }
  }

  function remove(id: string) {
    setConfirmDelete({ kind: "plan", id });
  }

  async function runConfirmDelete() {
    if (!confirmDelete) return;
    setConfirmBusy(true);
    try {
      if (confirmDelete.kind === "plan") {
        await deletePlan(confirmDelete.id);
        toast.success("Usunięto plan");
        if (editing?.id === confirmDelete.id) setEditing(null);
      } else if (confirmDelete.kind === "library") {
        await deleteLibraryItem(confirmDelete.id);
        toast.success("Usunięto");
      } else {
        await deleteGroup(confirmDelete.id);
        toast.success("Usunięto grupę", confirmDelete.name);
      }
      setConfirmDelete(null);
      await load();
    } catch (err) {
      toast.error("Usuwanie", err instanceof Error ? err.message : "Błąd");
    } finally {
      setConfirmBusy(false);
    }
  }

  async function doCopy(id: string) {
    try {
      const res = await copyPlan(id);
      toast.success("Skopiowano plan");
      openEdit(res.data as TrainingPlan);
      setTab("plans");
      await load();
    } catch (err) {
      toast.error("Kopia", err instanceof Error ? err.message : "Błąd");
    }
  }

  async function doVersion(id: string) {
    try {
      const res = await newPlanVersion(id);
      toast.success("Nowa wersja planu");
      openEdit(res.data as TrainingPlan);
      await load();
    } catch (err) {
      toast.error("Wersja", err instanceof Error ? err.message : "Błąd");
    }
  }

  async function setArchived(plan: TrainingPlan, archived: boolean) {
    try {
      await updatePlan(plan.id, { ...toBody(plan, false), archived });
      toast.success(archived ? "Zarchiwizowano plan" : "Przywrócono plan");
      if (editing?.id === plan.id) setEditing(null);
      await load();
    } catch (err) {
      toast.error("Archiwum", err instanceof Error ? err.message : "Błąd");
    }
  }

  const editingActions = usePlanEditingActions(editing, setEditingTracked, weekIdx, dayIdx);
  const progressReplies = usePlanProgressReplies(editing?.id, users);
  const ai = useAiPlanDraft(aiEnabled, openEdit);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!editing) return;
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save({ preventDefault() {} } as FormEvent, false);
      }
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (meta && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (!meta && e.key.toLowerCase() === "n" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
        editingActions.addExercise();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, weekIdx, dayIdx]);

  return {
    aiEnabled,
    ai,

    tab,
    setTab,
    listQuery,
    setListQuery,

    plans,
    archive,
    templates,
    library,
    groups,
    users,
    load,

    editing,
    weekIdx,
    setWeekIdx,
    dayIdx,
    setDayIdx,
    assignMode,
    setAssignMode,
    startNew,
    openEdit,
    closeEditing,
    setEditingTracked,
    undo,
    redo,
    save,
    doCopy,
    doVersion,
    setArchived,
    remove,

    ...editingActions,
    ...progressReplies,

    groupForm,
    setGroupForm,

    error,
    confirmDelete,
    setConfirmDelete,
    confirmBusy,
    runConfirmDelete,
  };
}

export type StaffPlansEditor = ReturnType<typeof useStaffPlansEditor>;
export type SetConfirmDelete = Dispatch<SetStateAction<ConfirmDeleteTarget>>;
