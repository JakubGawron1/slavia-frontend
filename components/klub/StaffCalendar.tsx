"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarMonthGrid } from "@/components/calendar/CalendarMonthGrid";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/toast/ToastProvider";
import {
  ATTENDANCE_NONE_BADGE,
  ATTENDANCE_NONE_LABEL,
  ATTENDANCE_STYLES,
  type AttendanceViewStatus,
} from "@/lib/attendance-ui";
import { toDateKey } from "@/lib/calendar";
import {
  fullToClubEvent,
  type CalendarEventFull,
  type ClubEvent,
  type TrainingScheduleDefaults,
  type WithdrawalStatus,
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

type AttendanceRecordLocal = {
  id: string;
  user_id: string;
  display_name: string;
  checked_at: string;
  session_token: string;
  event_id?: string | null;
  status?: string;
  source?: string;
};

type RosterAttendanceRow = {
  athleteId: string;
  displayName: string;
  status: AttendanceViewStatus | "none";
};

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Pon",
  2: "Wt",
  3: "Śr",
  4: "Czw",
  5: "Pt",
  6: "Sob",
  7: "Niedz",
};

type FormState = {
  id: string;
  title: string;
  event_type: "zawody" | "trening";
  date: string;
  end_date: string;
  time: string;
  location: string;
  description: string;
  assigned_athlete_ids: string[];
};

const emptyForm = (date?: string): FormState => ({
  id: "",
  title: "",
  event_type: "trening",
  date: date ?? toDateKey(new Date()),
  end_date: date ?? toDateKey(new Date()),
  time: "15:00",
  location: "ul. Konopnickiej 13, Ruda Śląska",
  description: "",
  assigned_athlete_ids: [],
});

type CtxMenu = {
  event: CalendarEventFull;
  x: number;
  y: number;
};

type DialogState =
  | { kind: "cancel"; event: CalendarEventFull; note: string }
  | { kind: "delete"; event: CalendarEventFull }
  | { kind: "restore-force"; event: CalendarEventFull; message: string }
  | { kind: "schedule" };

export function StaffCalendar() {
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

  const fieldClass =
    "mt-1 w-full border border-paper/20 bg-chrome/60 px-3 py-2 text-sm text-paper outline-none focus:border-brand";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Kadra
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
            Kalendarz zawodów
          </h1>
          <p className="mt-2 text-sm text-paper/55">
            Kliknij dzień, aby dodać wydarzenie. Kliknij wydarzenie — menu Edytuj / Usuń.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="bg-brand px-4 py-2.5 font-display text-sm tracking-wide text-paper uppercase"
        >
          + Nowe wydarzenie
        </button>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {schedule ? (
        <form
          onSubmit={saveSchedule}
          className="space-y-4 border border-paper/10 bg-paper/[0.03] p-4 sm:p-5"
        >
          <h2 className="font-display text-lg uppercase tracking-wide">
            Terminarz treningów
          </h2>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6, 7] as const).map((d) => {
              const on = schedule.weekdays.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setSchedule({
                      ...schedule,
                      weekdays: on
                        ? schedule.weekdays.filter((x) => x !== d)
                        : [...schedule.weekdays, d].sort(),
                    })
                  }
                  className={`px-3 py-2 font-display text-xs uppercase ${
                    on
                      ? "bg-brand text-paper"
                      : "border border-paper/20 text-paper/60"
                  }`}
                >
                  {WEEKDAY_LABELS[d]}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm text-paper/70">
              Start
              <input
                className={fieldClass}
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
              />
            </label>
            <label className="text-sm text-paper/70">
              Koniec
              <input
                className={fieldClass}
                value={schedule.end_time}
                onChange={(e) =>
                  setSchedule({ ...schedule, end_time: e.target.value })
                }
              />
            </label>
            <label className="text-sm text-paper/70 sm:col-span-2">
              Miejsce
              <input
                className={fieldClass}
                value={schedule.location}
                onChange={(e) =>
                  setSchedule({ ...schedule, location: e.target.value })
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className="border border-paper/20 px-4 py-2 font-display text-sm uppercase tracking-wide hover:border-brand"
          >
            Zapisz terminarz
          </button>
        </form>
      ) : null}

      <div className="flex w-full min-w-0 min-h-[min(48rem,calc(100svh-10.5rem))] flex-col rounded border border-paper/10">
        <div className="min-h-0 flex-1">
        <CalendarMonthGrid
          events={clubEvents}
          todayKey={todayKey}
          filterTypes={["zawody", "trening"]}
          hideCancelled={hideCancelled}
          onHideCancelledChange={setHideCancelled}
          onSelectDay={(dateKey) => openCreate(dateKey)}
          onSelectEvent={onSelectEvent}
          size="large"
          layout="wide"
          tone="panel"
        />
        </div>
      </div>

      {ctx ? (
        <div
          className="fixed z-[60] min-w-[11rem] border border-paper/20 bg-chrome py-1 shadow-xl"
          style={{ left: ctx.x, top: ctx.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="truncate border-b border-paper/10 px-3 py-2 text-xs text-paper/45">
            {ctx.event.title}
          </p>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-paper hover:bg-paper/10"
            onClick={() => openEdit(ctx.event)}
          >
            Edytuj
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-paper hover:bg-paper/10"
            onClick={() => {
              setDetail(ctx.event);
              setCtx(null);
            }}
          >
            Szczegóły
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-brand hover:bg-brand/10"
            onClick={() => requestDelete(ctx.event)}
          >
            Usuń
          </button>
        </div>
      ) : null}

      <Modal
        open={!!form}
        title={formMode === "create" ? "Nowe wydarzenie" : "Edycja wydarzenia"}
        onClose={() => setForm(null)}
        wide
      >
        {form ? (
          <form onSubmit={saveForm} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-paper/70 sm:col-span-2">
                Tytuł
                <input
                  required
                  className={fieldClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="text-sm text-paper/70">
                Typ
                <select
                  className={fieldClass}
                  value={form.event_type}
                  onChange={(e) => {
                    const event_type = e.target.value as "zawody" | "trening";
                    setForm({
                      ...form,
                      event_type,
                      end_date:
                        event_type === "trening" ? form.date : form.end_date,
                    });
                  }}
                >
                  <option value="trening">Trening</option>
                  <option value="zawody">Zawody</option>
                </select>
              </label>
              <label className="text-sm text-paper/70">
                Data rozpoczęcia
                <input
                  type="date"
                  required
                  className={fieldClass}
                  value={form.date}
                  onChange={(e) => {
                    const date = e.target.value;
                    setForm({
                      ...form,
                      date,
                      end_date:
                        form.event_type === "trening" ||
                        !form.end_date ||
                        form.end_date < date
                          ? date
                          : form.end_date,
                    });
                  }}
                />
              </label>
              {form.event_type === "zawody" ? (
                <label className="text-sm text-paper/70">
                  Data zakończenia
                  <input
                    type="date"
                    required
                    min={form.date}
                    className={fieldClass}
                    value={form.end_date || form.date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                  />
                </label>
              ) : null}
              <label className="text-sm text-paper/70">
                Godzina
                <input
                  className={fieldClass}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </label>
              <label className="text-sm text-paper/70">
                Miejsce
                <input
                  className={fieldClass}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </label>
              <label className="text-sm text-paper/70 sm:col-span-2">
                Opis
                <textarea
                  className={fieldClass}
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
            </div>
            {form.event_type === "zawody" ? (
              <fieldset className="space-y-2">
                <legend className="text-sm text-paper/70">Skład zawodników</legend>
                <div className="max-h-48 space-y-1 overflow-y-auto border border-paper/15 p-2">
                  {activeAthletes.length === 0 ? (
                    <p className="px-1 py-2 text-sm text-paper/45">
                      Brak profili zawodników — dodaj je w Konta i profile.
                    </p>
                  ) : (
                    activeAthletes.map((p) => {
                      const checked = form.assigned_athlete_ids.includes(p.id);
                      const noAccount =
                        !p.user_id || p.user_id === "manual";
                      return (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setForm({
                                ...form,
                                assigned_athlete_ids: checked
                                  ? form.assigned_athlete_ids.filter(
                                      (x) => x !== p.id,
                                    )
                                  : [...form.assigned_athlete_ids, p.id],
                              });
                            }}
                          />
                          <span>
                            {p.display_name}
                            {noAccount ? (
                              <span className="text-paper/40"> (bez konta)</span>
                            ) : null}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </fieldset>
            ) : (
              <p className="text-sm text-paper/50">
                Trening: automatycznie wszyscy zawodnicy.
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
              >
                Zapisz
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setForm(null)}
              >
                Anuluj
              </button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={!!detail}
        title={detail?.title ?? "Szczegóły"}
        onClose={() => setDetail(null)}
        wide
      >
        {detail ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/55">
              {detail.event_type}
              {detail.status === "cancelled" ? " · odwołane" : ""} ·{" "}
              {detail.end_date && detail.end_date !== detail.date
                ? `${detail.date} – ${detail.end_date}`
                : detail.date}
              {detail.time ? ` · ${detail.time}` : ""}
              {detail.location ? ` · ${detail.location}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
                onClick={() => {
                  openEdit(detail);
                  setDetail(null);
                }}
              >
                Edytuj
              </button>
              {detail.status === "scheduled" ? (
                <button
                  type="button"
                  className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
                  onClick={() => requestCancel(detail)}
                >
                  Odwołaj
                </button>
              ) : (
                <button
                  type="button"
                  className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
                  onClick={() => void restoreEvent(detail)}
                >
                  Przywróć
                </button>
              )}
              {detail.event_type === "trening" && detail.status === "scheduled" ? (
                <button
                  type="button"
                  className="bg-brand px-3 py-1.5 text-xs text-paper uppercase"
                  onClick={() => goToAttendance()}
                >
                  Otwórz obecność
                </button>
              ) : null}
              <button
                type="button"
                className="border border-brand/40 px-3 py-1.5 text-xs text-brand uppercase"
                onClick={() => requestDelete(detail)}
              >
                Usuń
              </button>
            </div>

            {detail.event_type === "zawody" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-sm uppercase">Skład</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {detail.assigned_athlete_ids.length === 0 ? (
                      <li className="text-paper/45">Skład nieogłoszony</li>
                    ) : (
                      detail.assigned_athlete_ids.map((id) => {
                        const p = profiles.find((x) => x.id === id);
                        return <li key={id}>{p?.display_name ?? id}</li>;
                      })
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-sm uppercase">Nieprzypisani</h3>
                  <ul className="mt-2 space-y-1 text-sm text-paper/55">
                    {missingForDetail.length === 0 ? (
                      <li>Wszyscy aktywni są na składzie</li>
                    ) : (
                      missingForDetail.map((p) => (
                        <li key={p.id}>{p.display_name}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-sm uppercase">Obecność</h3>
                {detailRoster.length === 0 ? (
                  <p className="mt-2 text-sm text-paper/50">
                    Brak zawodników na liście.
                  </p>
                ) : (
                  <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                    {detailRoster.map((row) => {
                      const style =
                        row.status === "none"
                          ? {
                              badge: ATTENDANCE_NONE_BADGE,
                              label: ATTENDANCE_NONE_LABEL,
                            }
                          : ATTENDANCE_STYLES[row.status];
                      return (
                        <li
                          key={row.athleteId}
                          className="flex flex-wrap items-center justify-between gap-2 border border-paper/10 px-3 py-2 text-sm"
                        >
                          <span>{row.displayName}</span>
                          <span
                            className={`px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${style.badge}`}
                          >
                            {style.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {detail.withdrawals.length > 0 ? (
              <div>
                <h3 className="font-display text-sm uppercase">Rezygnacje</h3>
                <ul className="mt-2 space-y-2">
                  {detail.withdrawals.map((w) => {
                    const p = profiles.find((x) => x.id === w.athlete_id);
                    const st = w.status as WithdrawalStatus;
                    return (
                      <li
                        key={`${w.athlete_id}-${w.at}`}
                        className="flex flex-wrap items-center justify-between gap-2 border border-paper/15 px-3 py-2 text-sm"
                      >
                        <span>
                          <strong>{p?.display_name ?? w.athlete_id}</strong> — {w.reason}{" "}
                          <span className="text-paper/45">({st})</span>
                        </span>
                        <span className="flex gap-2">
                          {st === "pending" && detail.event_type === "zawody" ? (
                            <>
                              <button
                                type="button"
                                className="text-xs uppercase text-brand"
                                onClick={() =>
                                  void acceptWithdrawal(detail, w.athlete_id)
                                }
                              >
                                Akceptuj
                              </button>
                              <button
                                type="button"
                                className="text-xs uppercase"
                                onClick={() =>
                                  void rejectWithdrawal(detail, w.athlete_id)
                                }
                              >
                                Odrzuć
                              </button>
                            </>
                          ) : null}
                          {st === "accepted" && detail.event_type === "trening" ? (
                            <button
                              type="button"
                              className="text-xs uppercase"
                              onClick={() =>
                                void clearWithdrawal(detail, w.athlete_id)
                              }
                            >
                              Przywróć
                            </button>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "cancel"}
        title="Odwołaj wydarzenie"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "cancel" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Odwołać <strong className="text-paper">{dialog.event.title}</strong>?
            </p>
            <label className="block text-sm text-paper/70">
              Powód odwołania (opcjonalnie)
              <textarea
                className={fieldClass}
                rows={3}
                value={dialog.note}
                onChange={(e) =>
                  setDialog({ ...dialog, note: e.target.value })
                }
                placeholder="Np. brak sali, zmiana terminu…"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmCancel()}
              >
                Odwołaj
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "delete"}
        title="Usuń wydarzenie"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "delete" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Usunąć trwale{" "}
              <strong className="text-paper">{dialog.event.title}</strong>? Tej
              operacji nie da się cofnąć.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmDelete()}
              >
                Usuń
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "restore-force"}
        title="Kolizja przy przywracaniu"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "restore-force" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60 whitespace-pre-wrap">
              {dialog.message}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void restoreEvent(dialog.event, true)}
              >
                Wymuś przywrócenie
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "schedule"}
        title="Zapisz terminarz"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "schedule" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Zapisać terminarz? Przyszłe seedowane treningi poza nowymi dniami
              zostaną usunięte.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmSchedule()}
              >
                Zapisz
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
