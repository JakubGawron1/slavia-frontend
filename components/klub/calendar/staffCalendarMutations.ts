import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";
import type { CalendarEventFull, TrainingScheduleDefaults } from "@/lib/events";
import {
  acceptWithdrawal as acceptWithdrawalApi,
  cancelEvent,
  clearWithdrawal as clearWithdrawalApi,
  createEvent,
  deleteEvent,
  rejectWithdrawal as rejectWithdrawalApi,
  restoreEvent as restoreEventApi,
  updateEvent,
  updateSchedule,
} from "@/lib/api/generated/default/default";
import type { EventBody } from "@/lib/api/generated/models";
import { eventFormSchema } from "@/lib/validation/event";
import { parseOrMessage } from "@/lib/validation/parse";
import type {
  CtxMenu,
  DialogState,
  FormState,
} from "@/components/klub/calendar/staffCalendarTypes";

type Toast = ReturnType<typeof useToast>;

type Deps = {
  toast: Toast;
  router: ReturnType<typeof useRouter>;
  form: FormState | null;
  formMode: "create" | "edit";
  dialog: DialogState | null;
  schedule: TrainingScheduleDefaults | null;
  setForm: (v: FormState | null) => void;
  setCtx: (v: CtxMenu | null) => void;
  setDialog: (v: DialogState | null) => void;
  setDetail: (v: CalendarEventFull | null) => void;
  setError: (v: string | null) => void;
  setSchedule: (v: TrainingScheduleDefaults | null) => void;
  load: () => Promise<void>;
};

export function createStaffCalendarMutations(d: Deps) {
  async function saveForm(e: FormEvent) {
    e.preventDefault();
    if (!d.form) return;
    d.setError(null);
    const parsed = parseOrMessage(eventFormSchema, d.form);
    if (!parsed.ok) {
      d.setError(parsed.message);
      d.toast.error("Zapis nieudany", parsed.message);
      return;
    }
    const form = parsed.data;
    const end =
      form.event_type === "zawody" &&
      form.end_date &&
      form.end_date !== form.date
        ? form.end_date
        : null;
    const body: EventBody = {
      title: form.title,
      event_type: form.event_type,
      date: form.date,
      end_date: end,
      time: form.time || null,
      location: form.location || null,
      description: form.description || null,
      assigned_athlete_ids:
        form.event_type === "zawody" ? d.form.assigned_athlete_ids : [],
    };
    try {
      if (d.formMode === "create") {
        await createEvent(body);
        d.toast.success("Dodano wydarzenie", form.title);
      } else {
        await updateEvent(d.form.id, body);
        d.toast.success("Zapisano zmiany", form.title);
      }
      d.setForm(null);
      await d.load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      d.setError(msg);
      d.toast.error("Zapis nieudany", msg);
    }
  }

  function requestDelete(ev: CalendarEventFull) {
    d.setCtx(null);
    d.setDialog({ kind: "delete", event: ev });
  }

  async function confirmDelete() {
    if (d.dialog?.kind !== "delete") return;
    const ev = d.dialog.event;
    d.setDialog(null);
    d.setDetail(null);
    try {
      await deleteEvent(ev.id);
      d.toast.success("Usunięto wydarzenie", ev.title);
      await d.load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Usuwanie nieudane";
      d.setError(msg);
      d.toast.error("Usuwanie nieudane", msg);
    }
  }

  function requestCancel(ev: CalendarEventFull) {
    d.setDialog({ kind: "cancel", event: ev, note: "" });
  }

  async function confirmCancel() {
    if (d.dialog?.kind !== "cancel") return;
    const { event: ev, note } = d.dialog;
    d.setDialog(null);
    try {
      await cancelEvent(ev.id, { cancellation_note: note.trim() || null });
      d.toast.success("Odwołano wydarzenie", ev.title);
      await d.load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się odwołać";
      d.setError(msg);
      d.toast.error("Odwołanie nieudane", msg);
    }
  }

  async function restoreEvent(ev: CalendarEventFull, force = false) {
    try {
      await restoreEventApi(ev.id, { force });
      d.setDialog(null);
      d.toast.success(
        force ? "Przywrócono (wymuszone)" : "Przywrócono wydarzenie",
        ev.title,
      );
      await d.load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się przywrócić";
      if (msg.includes("force=true")) {
        d.setDialog({ kind: "restore-force", event: ev, message: msg });
        return;
      }
      d.setError(msg);
      d.toast.error("Przywracanie nieudane", msg);
    }
  }

  function goToAttendance() {
    d.router.push("/klub/obecnosc");
  }

  async function acceptWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await acceptWithdrawalApi(ev.id, athleteId);
      d.toast.success("Zaakceptowano rezygnację");
      await d.load();
    } catch (err) {
      d.toast.error(
        "Akceptacja nieudana",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function rejectWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await rejectWithdrawalApi(ev.id, athleteId);
      d.toast.success("Odrzucono rezygnację");
      await d.load();
    } catch (err) {
      d.toast.error(
        "Odrzucenie nieudane",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function clearWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await clearWithdrawalApi(ev.id, athleteId);
      d.toast.success("Przywrócono na trening");
      await d.load();
    } catch (err) {
      d.toast.error(
        "Operacja nieudana",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function saveSchedule(e: FormEvent) {
    e.preventDefault();
    if (!d.schedule) return;
    d.setDialog({ kind: "schedule" });
  }

  async function confirmSchedule() {
    if (!d.schedule || d.dialog?.kind !== "schedule") return;
    d.setDialog(null);
    try {
      const updated = await updateSchedule(d.schedule);
      d.setSchedule(updated.data as TrainingScheduleDefaults);
      d.toast.success("Zapisano terminarz treningów");
      await d.load();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Zapis terminarza nieudany";
      d.setError(msg);
      d.toast.error("Terminarz", msg);
    }
  }

  return {
    saveForm,
    requestDelete,
    confirmDelete,
    requestCancel,
    confirmCancel,
    restoreEvent,
    goToAttendance,
    acceptWithdrawal,
    rejectWithdrawal,
    clearWithdrawal,
    saveSchedule,
    confirmSchedule,
  };
}
