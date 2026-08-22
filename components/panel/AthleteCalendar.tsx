"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarMonthGrid } from "@/components/calendar/CalendarMonthGrid";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { useToast } from "@/components/toast/ToastProvider";
import {
  ATTENDANCE_STYLES,
  parseAttendanceStatus,
} from "@/lib/attendance-ui";
import { toDateKey } from "@/lib/calendar";
import {
  eventTypeLabel,
  publicApiToClubEvent,
  type AthleteCalendarEvent,
  type ClubEvent,
} from "@/lib/events";
import {
  listMyEvents,
  withdrawFromEvent,
} from "@/lib/api/generated/default/default";
import { usePanel } from "@/components/panel/PanelProvider";

function eventsRangeAroundToday(): { from: string; to: string } {
  const today = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const toDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);
  return { from: toDateKey(fromDate), to: toDateKey(toDate) };
}

export function AthleteCalendar() {
  const toast = useToast();
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const todayKey = toDateKey(new Date());
  const [events, setEvents] = useState<AthleteCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mineOnly, setMineOnly] = useState(false);
  const [hideCancelled, setHideCancelled] = useState(false);
  const [selected, setSelected] = useState<AthleteCalendarEvent | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { from, to } = eventsRangeAroundToday();
      const res = await listMyEvents({ from, to });
      const data = res.data as AthleteCalendarEvent[];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd kalendarza";
      setError(msg);
      toast.error("Nie udało się załadować", msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load, scopeKey]);

  useEffect(() => {
    if (!selected) return;
    setSelected(events.find((e) => e.id === selected.id) ?? null);
  }, [events]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    let list = events;
    if (mineOnly) {
      list = list.filter((e) => e.event_type === "zawody" && e.i_am_assigned);
    }
    return list;
  }, [events, mineOnly]);

  const clubEvents: ClubEvent[] = useMemo(
    () =>
      visible.map((e) => {
        const base = publicApiToClubEvent(e);
        const attendance_status = parseAttendanceStatus(e.attendance_status);
        return attendance_status ? { ...base, attendance_status } : base;
      }),
    [visible],
  );

  function onSelect(ce: ClubEvent) {
    setSelected(events.find((e) => e.id === ce.id) ?? null);
    setReason("");
  }

  async function withdraw(e: FormEvent) {
    e.preventDefault();
    if (!selected || !reason.trim()) return;
    try {
      await withdrawFromEvent(selected.id, { reason: reason.trim() });
      setReason("");
      toast.success(
        selected.event_type === "trening"
          ? "Zrezygnowano z treningu"
          : "Wysłano prośbę o rezygnację",
        selected.title,
      );
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Rezygnacja nieudana";
      setError(msg);
      toast.error("Rezygnacja nieudana", msg);
    }
  }

  const canWithdraw =
    selected &&
    selected.status === "scheduled" &&
    selected.i_am_assigned &&
    selected.my_withdrawal_status !== "pending" &&
    selected.my_withdrawal_status !== "accepted";

  const selectedAttendance = selected
    ? parseAttendanceStatus(selected.attendance_status)
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panel"
        title="Kalendarz"
        description="Kliknij wydarzenie, aby zobaczyć szczegóły i dostępne akcje."
      />

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}

      {loading && events.length === 0 ? (
        <InlineStatus kind="loading">Ładowanie wydarzeń…</InlineStatus>
      ) : null}

      {!loading && events.length === 0 ? (
        <EmptyState
          title="Brak wydarzeń"
          description="W najbliższych miesiącach nie ma jeszcze treningów ani zawodów w kalendarzu."
        />
      ) : null}

      {events.length > 0 ? (
      <div className="flex w-full min-w-0 min-h-[min(48rem,calc(100svh-10.5rem))] flex-col rounded border border-paper/10">
        <div className="min-h-0 flex-1">
          <CalendarMonthGrid
            events={clubEvents}
            todayKey={todayKey}
            filterTypes={["zawody", "trening"]}
            hideCancelled={hideCancelled}
            onHideCancelledChange={setHideCancelled}
            onSelectEvent={onSelect}
            size="medium"
            layout="wide"
            tone="panel"
            extraFilters={
              <FilterChip
                active={mineOnly}
                onClick={() => setMineOnly((v) => !v)}
                label="Moje starty"
              />
            }
          />
        </div>
      </div>
      ) : null}

      <Modal
        open={!!selected}
        title={selected?.title ?? "Wydarzenie"}
        onClose={() => setSelected(null)}
        wide
      >
        {selected ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/55">
              {eventTypeLabel(selected.event_type)}
              {selected.status === "cancelled" ? " · odwołane" : ""} ·{" "}
              {selected.end_date && selected.end_date !== selected.date
                ? `${selected.date} – ${selected.end_date}`
                : selected.date}
              {selected.time ? ` · ${selected.time}` : ""}
              {selected.location ? ` · ${selected.location}` : ""}
            </p>
            {selected.description ? (
              <p className="text-sm text-paper/70">{selected.description}</p>
            ) : null}
            {selected.plan_title ? (
              <p className="text-sm text-brand">
                Plan: {selected.plan_title}
                {selected.plan_week != null ? ` · T${selected.plan_week}` : ""}
              </p>
            ) : null}
            {selected.cancellation_note ? (
              <p className="text-sm text-brand">
                Powód odwołania: {selected.cancellation_note}
              </p>
            ) : null}

            {selected.i_am_assigned ? (
              <p className="text-sm text-brand">Jesteś zgłoszony</p>
            ) : null}
            {selected.my_withdrawal_status === "pending" ? (
              <p className="text-sm">Oczekuje na akceptację rezygnacji</p>
            ) : null}
            {selected.my_withdrawal_status === "accepted" &&
            !selectedAttendance ? (
              <p className="text-sm">Zrezygnowano</p>
            ) : null}
            {selected.my_withdrawal_status === "rejected" ? (
              <p className="text-sm">
                Rezygnacja odrzucona — jesteś na składzie
              </p>
            ) : null}
            {selectedAttendance ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-paper/55">Obecność:</span>
                <span
                  className={`px-2 py-0.5 font-display text-xs tracking-[0.12em] uppercase ${ATTENDANCE_STYLES[selectedAttendance].badge}`}
                >
                  {ATTENDANCE_STYLES[selectedAttendance].label}
                </span>
              </div>
            ) : null}

            {selected.event_type === "zawody" ? (
              <div>
                <h3 className="font-display text-sm uppercase">Skład</h3>
                {!selected.roster_announced ||
                selected.assigned_athletes.length === 0 ? (
                  <p className="mt-1 text-sm text-paper/45">Skład nieogłoszony</p>
                ) : (
                  <ul className="mt-1 space-y-1 text-sm">
                    {selected.assigned_athletes.map((a) => (
                      <li key={a.id}>{a.display_name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm text-paper/50">
                Trening — wszyscy zawodnicy.
              </p>
            )}

            {canWithdraw ? (
              <form
                onSubmit={withdraw}
                className="space-y-2 border-t border-paper/10 pt-3"
              >
                <label className="block text-sm text-paper/70">
                  Zrezygnuj — podaj powód
                  <input
                    required
                    className="mt-1 w-full border border-paper/20 bg-chrome/60 px-3 py-2 text-paper outline-none focus:border-brand"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="np. choroba"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                >
                  Zrezygnuj
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
