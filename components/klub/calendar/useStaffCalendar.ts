import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";
import { type AttendanceViewStatus } from "@/lib/attendance-ui";
import { toDateKey } from "@/lib/calendar";
import {
  fullToClubEvent,
  type CalendarEventFull,
  type ClubEvent,
  type TrainingScheduleDefaults,
} from "@/lib/events";
import {
  acceptWithdrawal as acceptWithdrawalApi,
  cancelEvent,
  clearWithdrawal as clearWithdrawalApi,
  createEvent,
  deleteEvent,
  getSchedule,
  listAttendance,
  listEvents,
  listProfiles,
  rejectWithdrawal as rejectWithdrawalApi,
  restoreEvent as restoreEventApi,
  updateEvent,
  updateSchedule,
} from "@/lib/api/generated/default/default";
import type { AthleteProfile, EventBody } from "@/lib/api/generated/models";
import {
  emptyForm,
  type AttendanceRecordLocal,
  type CtxMenu,
  type DialogState,
  type FormState,
  type RosterAttendanceRow,
} from "@/components/klub/calendar/staffCalendarTypes";

export type {
  AttendanceRecordLocal,
  CtxMenu,
  DialogState,
  FormState,
  RosterAttendanceRow,
} from "@/components/klub/calendar/staffCalendarTypes";

export function useStaffCalendar() {
  const router = useRouter();
  const toast = useToast();
  const todayKey = toDateKey(new Date());
  const [events, setEvents] = useState<CalendarEventFull[]>([]);
  const [profiles, setProfiles] = useState<AthleteProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecordLocal[]>([]);
  const [schedule, setSchedule] = useState<TrainingScheduleDefaults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hideCancelled, setHideCancelled] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [ctx, setCtx] = useState<CtxMenu | null>(null);
  const [detail, setDetail] = useState<CalendarEventFull | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [evRes, prRes, schRes, attRes] = await Promise.all([
        listEvents(),
        listProfiles().catch(() => null),
        getSchedule(),
        listAttendance().catch(() => null),
      ]);
      setEvents((evRes.data as CalendarEventFull[]) ?? []);
      // Profile zawodników (także bez konta w systemie — user_id "manual")
      setProfiles((prRes?.data as AthleteProfile[] | undefined) ?? []);
      setSchedule(schRes.data as TrainingScheduleDefaults);
      setAttendance(
        (attRes?.data as AttendanceRecordLocal[] | undefined) ?? [],
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd kalendarza";
      setError(msg);
      toast.error("Nie udało się załadować", msg);
    }
    // toast API jest stabilne (ref w ToastProvider) — nie w deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!ctx) return;
    function close() {
      setCtx(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("click", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [ctx]);

  useEffect(() => {
    if (!detail) return;
    setDetail(events.find((e) => e.id === detail.id) ?? null);
  }, [events]); // eslint-disable-line react-hooks/exhaustive-deps

  const clubEvents = useMemo(() => {
    return events.map((ev) => {
      const base = fullToClubEvent(ev);
      if (ev.event_type !== "trening") return base;

      const withdrawnIds = new Set(
        ev.withdrawals
          .filter((w) => w.status === "accepted")
          .map((w) => w.athlete_id),
      );
      const expectedAthletes = profiles.filter((p) => !withdrawnIds.has(p.id));
      const expected = expectedAthletes.length;

      const presentUserIds = new Set(
        attendance
          .filter(
            (r) =>
              r.event_id === ev.id &&
              r.status === "present",
          )
          .map((r) => r.user_id),
      );
      let present = 0;
      for (const p of expectedAthletes) {
        if (presentUserIds.has(p.user_id)) present += 1;
      }

      const hasAnyRecord = attendance.some(
        (r) =>
          r.event_id === ev.id &&
          (r.status === "present" || r.status === "absent"),
      );
      if (!hasAnyRecord) return base;

      return {
        ...base,
        attendance_counts: { present, expected },
      };
    });
  }, [events, profiles, attendance]);

  const activeAthletes = profiles;

  const missingForDetail = useMemo(() => {
    if (!detail || detail.event_type !== "zawody") return [];
    return activeAthletes.filter((p) => !detail.assigned_athlete_ids.includes(p.id));
  }, [detail, activeAthletes]);

  const detailRoster = useMemo((): RosterAttendanceRow[] => {
    if (!detail || detail.event_type !== "trening") return [];

    const byUserId = new Map(
      attendance
        .filter(
          (r) =>
            r.event_id === detail.id &&
            (r.status === "present" || r.status === "absent"),
        )
        .map((r) => [r.user_id, r.status as "present" | "absent"]),
    );

    const withdrawn = new Map(
      detail.withdrawals
        .filter((w) => w.status === "accepted")
        .map((w) => [w.athlete_id, true]),
    );

    return profiles
      .map((p) => {
        let status: AttendanceViewStatus | "none" = "none";
        if (withdrawn.has(p.id)) {
          status = "withdrawn";
        } else {
          const rec = byUserId.get(p.user_id);
          if (rec === "present" || rec === "absent") status = rec;
        }
        return {
          athleteId: p.id,
          displayName: p.display_name,
          status,
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName, "pl"));
  }, [detail, profiles, attendance]);

  function openCreate(dateKey?: string) {
    setCtx(null);
    setFormMode("create");
    setForm(emptyForm(dateKey));
  }

  function openEdit(ev: CalendarEventFull) {
    setCtx(null);
    setFormMode("edit");
    setForm({
      id: ev.id,
      title: ev.title,
      event_type: ev.event_type === "zawody" ? "zawody" : "trening",
      date: ev.date,
      end_date: ev.end_date ?? ev.date,
      time: ev.time ?? "",
      location: ev.location ?? "",
      description: ev.description ?? "",
      assigned_athlete_ids: [...ev.assigned_athlete_ids],
      plan_id: ev.plan_id ?? "",
      plan_week: ev.plan_week != null ? String(ev.plan_week) : "",
      plan_day: ev.plan_day != null ? String(ev.plan_day) : "",
    });
  }

  function onSelectEvent(ce: ClubEvent, rect?: DOMRect) {
    const full = events.find((e) => e.id === ce.id);
    if (!full) return;
    const x = rect ? Math.min(rect.left, window.innerWidth - 200) : 80;
    const y = rect ? Math.min(rect.bottom + 4, window.innerHeight - 220) : 120;
    setCtx({ event: full, x, y });
  }

  async function saveForm(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
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
        form.event_type === "zawody" ? form.assigned_athlete_ids : [],
      plan_id: form.plan_id.trim() || null,
      plan_week: form.plan_week ? Number(form.plan_week) : null,
      plan_day: form.plan_day ? Number(form.plan_day) : null,
    };
    try {
      if (formMode === "create") {
        await createEvent(body);
        toast.success("Dodano wydarzenie", form.title);
      } else {
        await updateEvent(form.id, body);
        toast.success("Zapisano zmiany", form.title);
      }
      setForm(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("Zapis nieudany", msg);
    }
  }

  function requestDelete(ev: CalendarEventFull) {
    setCtx(null);
    setDialog({ kind: "delete", event: ev });
  }

  async function confirmDelete() {
    if (dialog?.kind !== "delete") return;
    const ev = dialog.event;
    setDialog(null);
    setDetail(null);
    try {
      await deleteEvent(ev.id);
      toast.success("Usunięto wydarzenie", ev.title);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Usuwanie nieudane";
      setError(msg);
      toast.error("Usuwanie nieudane", msg);
    }
  }

  function requestCancel(ev: CalendarEventFull) {
    setDialog({ kind: "cancel", event: ev, note: "" });
  }

  async function confirmCancel() {
    if (dialog?.kind !== "cancel") return;
    const { event: ev, note } = dialog;
    setDialog(null);
    try {
      await cancelEvent(ev.id, { cancellation_note: note.trim() || null });
      toast.success("Odwołano wydarzenie", ev.title);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się odwołać";
      setError(msg);
      toast.error("Odwołanie nieudane", msg);
    }
  }

  async function restoreEvent(ev: CalendarEventFull, force = false) {
    try {
      await restoreEventApi(ev.id, { force });
      setDialog(null);
      toast.success(
        force ? "Przywrócono (wymuszone)" : "Przywrócono wydarzenie",
        ev.title,
      );
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się przywrócić";
      if (msg.includes("force=true")) {
        setDialog({ kind: "restore-force", event: ev, message: msg });
        return;
      }
      setError(msg);
      toast.error("Przywracanie nieudane", msg);
    }
  }

  function goToAttendance() {
    router.push("/klub/obecnosc");
  }

  async function acceptWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await acceptWithdrawalApi(ev.id, athleteId);
      toast.success("Zaakceptowano rezygnację");
      await load();
    } catch (err) {
      toast.error(
        "Akceptacja nieudana",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function rejectWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await rejectWithdrawalApi(ev.id, athleteId);
      toast.success("Odrzucono rezygnację");
      await load();
    } catch (err) {
      toast.error(
        "Odrzucenie nieudane",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function clearWithdrawal(ev: CalendarEventFull, athleteId: string) {
    try {
      await clearWithdrawalApi(ev.id, athleteId);
      toast.success("Przywrócono na trening");
      await load();
    } catch (err) {
      toast.error(
        "Operacja nieudana",
        err instanceof Error ? err.message : undefined,
      );
    }
  }

  async function saveSchedule(e: FormEvent) {
    e.preventDefault();
    if (!schedule) return;
    setDialog({ kind: "schedule" });
  }

  async function confirmSchedule() {
    if (!schedule || dialog?.kind !== "schedule") return;
    setDialog(null);
    try {
      const updated = await updateSchedule(schedule);
      setSchedule(updated.data as TrainingScheduleDefaults);
      toast.success("Zapisano terminarz treningów");
      await load();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Zapis terminarza nieudany";
      setError(msg);
      toast.error("Terminarz", msg);
    }
  }

  return {
    todayKey,
    events,
    profiles,
    schedule,
    setSchedule,
    error,
    hideCancelled,
    setHideCancelled,
    form,
    setForm,
    formMode,
    ctx,
    setCtx,
    detail,
    setDetail,
    dialog,
    setDialog,
    clubEvents,
    activeAthletes,
    missingForDetail,
    detailRoster,
    openCreate,
    openEdit,
    onSelectEvent,
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
