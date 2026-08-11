"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PublicUser } from "@/lib/api/generated/models";
import {
  approveAttendance,
  getSession,
  listAttendance,
  listEvents,
  listUsers,
  refreshSession,
  rejectAttendance,
} from "@/lib/api/generated/default/default";
import { QrCodeImage } from "@/components/QrCodeImage";
import { useToast } from "@/components/toast/ToastProvider";
import type { CalendarEventFull } from "@/lib/events";

type AttendanceSessionLocal = {
  token: string;
  label: string;
  created_at: string;
  refreshed_at: string;
};

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

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export default function StaffObecnoscInner() {
  const search = useSearchParams();
  const toast = useToast();
  const eventFromUrl = search.get("event") ?? "";

  const [session, setSession] = useState<AttendanceSessionLocal | null>(null);
  const [records, setRecords] = useState<AttendanceRecordLocal[]>([]);
  const [pending, setPending] = useState<AttendanceRecordLocal[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [trainings, setTrainings] = useState<CalendarEventFull[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(eventFromUrl);
  const [approveEventById, setApproveEventById] = useState<Record<string, string>>(
    {},
  );
  const [filterUser, setFilterUser] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"agenda" | "day">("agenda");

  const load = useCallback(async () => {
    setError(null);
    try {
      const [rRes, unauthorizedRes, uRes, eventsRes, sRes] = await Promise.all([
        listAttendance(
          selectedEventId ? { event_id: selectedEventId } : undefined,
        ),
        listAttendance({ status: "pending_unauthorized" }),
        listUsers().catch(() => null),
        listEvents().catch(() => null),
        getSession(),
      ]);
      const r = (rRes.data as AttendanceRecordLocal[]) ?? [];
      const unauthorized =
        (unauthorizedRes.data as AttendanceRecordLocal[]) ?? [];
      const u = (uRes?.data as PublicUser[] | undefined) ?? [];
      const events = (eventsRes?.data as CalendarEventFull[] | undefined) ?? [];
      setRecords(r.filter((x) => x.status !== "pending_unauthorized"));
      setPending(unauthorized);
      setUsers(u.filter((x) => x.roles.includes("zawodnik") && x.is_active));
      setTrainings(
        events.filter(
          (e) => e.event_type === "trening" && e.status === "scheduled",
        ),
      );
      setSession(sRes.data as AttendanceSessionLocal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd obecności");
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (eventFromUrl) setSelectedEventId(eventFromUrl);
  }, [eventFromUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  async function refreshQr() {
    try {
      const s = await refreshSession({});
      setSession(s.data as AttendanceSessionLocal);
      toast.success("Odświeżono kod QR", "Poprzedni token przestał działać.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się odświeżyć QR";
      setError(msg);
      toast.error("QR obecności", msg);
    }
  }

  async function approvePending(record: AttendanceRecordLocal) {
    const eventId =
      record.event_id ?? approveEventById[record.id] ?? selectedEventId;
    if (!eventId) {
      toast.error("Wybierz trening", "Wskaż trening do przypisania obecności.");
      return;
    }
    try {
      await approveAttendance(record.id, { event_id: eventId });
      toast.success("Zaakceptowano obecność", record.display_name);
      await load();
    } catch (err) {
      toast.error(
        "Akceptacja",
        err instanceof Error ? err.message : "Nie udało się zaakceptować",
      );
    }
  }

  async function rejectPending(record: AttendanceRecordLocal) {
    try {
      await rejectAttendance(record.id);
      toast.success("Odrzucono skan", record.display_name);
      await load();
    } catch (err) {
      toast.error(
        "Odrzucenie",
        err instanceof Error ? err.message : "Nie udało się odrzucić",
      );
    }
  }

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterUser && r.user_id !== filterUser) return false;
      if (selectedEventId && r.event_id !== selectedEventId) return false;
      return true;
    });
  }, [records, filterUser, selectedEventId]);

  const byDay = useMemo(() => {
    const map = new Map<string, AttendanceRecordLocal[]>();
    for (const r of filtered) {
      const k = dayKey(r.checked_at);
      const list = map.get(k) ?? [];
      list.push(r);
      map.set(k, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const qrPayload = session
    ? typeof window !== "undefined"
      ? `${window.location.origin}/panel/obecnosc?code=${session.token}`
      : session.token
    : "";

  const selectedTraining = trainings.find((t) => t.id === selectedEventId);

  return (
    <div className="animate-rise max-w-5xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Trening
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Obecność
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Stały kod QR klubu — działa na kolejne treningi, aż go odświeżysz.
        </p>
      </div>

      {error ? (
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="border border-paper/10 bg-paper/[0.03] p-4 print:border-0">
          <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
            Kod klubowy · {session?.label ?? "—"}
          </p>
          {session && qrPayload ? (
            <QrCodeImage
              value={qrPayload}
              size={280}
              alt="Kod QR obecności"
              className="mx-auto mt-4 h-56 w-56 bg-surface p-2"
            />
          ) : (
            <p className="mt-4 text-sm text-paper/45">Ładowanie sesji QR…</p>
          )}
          <p className="mt-3 break-all font-mono text-[10px] text-paper/40">
            {session?.token}
          </p>
          {session?.refreshed_at ? (
            <p className="mt-1 text-[10px] text-paper/35">
              Odświeżono: {session.refreshed_at.slice(0, 19).replace("T", " ")}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => void refreshQr()}
              className="bg-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
            >
              Odśwież QR
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-paper/25 px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
            >
              Drukuj
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {pending.length > 0 ? (
            <div className="border border-amber-500/35 bg-amber-500/10 p-4">
              <h2 className="font-display text-sm tracking-[0.12em] uppercase">
                Nieautoryzowane skany ({pending.length})
              </h2>
              <p className="mt-1 text-xs text-paper/55">
                Skan poza oknem treningu lub w dniu bez treningu. Zawodnik widzi
                tylko komunikat o braku treningu.
              </p>
              <ul className="mt-3 divide-y divide-paper/10 border border-paper/10">
                {pending.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-col gap-2 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{r.display_name}</p>
                      <p className="text-xs text-paper/45">
                        {r.checked_at.slice(0, 19).replace("T", " ")}
                        {r.event_id
                          ? ` · trening ${
                              trainings.find((t) => t.id === r.event_id)
                                ?.title ?? r.event_id.slice(0, 8)
                            }`
                          : " · bez treningu"}
                      </p>
                      {!r.event_id ? (
                        <select
                          className="mt-2 border border-paper/20 bg-chrome/40 px-2 py-1 text-xs"
                          value={approveEventById[r.id] ?? ""}
                          onChange={(e) =>
                            setApproveEventById((prev) => ({
                              ...prev,
                              [r.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">— przypisz trening —</option>
                          {trainings.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.date} · {t.title}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => void approvePending(r)}
                        className="border border-brand/50 bg-brand/15 px-3 py-1.5 text-[11px] uppercase"
                      >
                        Zezwól
                      </button>
                      <button
                        type="button"
                        onClick={() => void rejectPending(r)}
                        className="border border-paper/25 px-3 py-1.5 text-[11px] uppercase"
                      >
                        Odrzuć
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-end gap-3 print:hidden">
            <label className="text-sm">
              Filtr treningu
              <select
                className="mt-1 block min-w-[16rem] border border-paper/20 bg-chrome/40 px-2 py-2 text-sm"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                <option value="">Wszystkie</option>
                {trainings.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.date} · {t.title}
                    {t.time ? ` · ${t.time}` : ""}
                  </option>
                ))}
              </select>
            </label>
            {selectedTraining ? (
              <p className="pb-2 text-sm text-paper/55">
                {selectedTraining.title} · {selectedTraining.date}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setView("agenda")}
              className={
                view === "agenda"
                  ? "border border-brand bg-brand/20 px-3 py-1.5 text-xs uppercase"
                  : "border border-paper/20 px-3 py-1.5 text-xs uppercase text-paper/50"
              }
            >
              Agenda
            </button>
            <button
              type="button"
              onClick={() => setView("day")}
              className={
                view === "day"
                  ? "border border-brand bg-brand/20 px-3 py-1.5 text-xs uppercase"
                  : "border border-paper/20 px-3 py-1.5 text-xs uppercase text-paper/50"
              }
            >
              Lista
            </button>
            <select
              className="border border-paper/20 bg-chrome/40 px-2 py-1.5 text-sm"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="">Wszyscy zawodnicy</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.display_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void load()}
              className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
            >
              Odśwież listę
            </button>
          </div>

          {view === "agenda" ? (
            <ul className="space-y-4">
              {byDay.map(([day, list]) => (
                <li key={day}>
                  <p className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
                    {day} · {list.length} wpisów
                  </p>
                  <ul className="mt-2 divide-y divide-paper/10 border border-paper/10">
                    {list.map((r) => (
                      <li
                        key={r.id}
                        className="flex justify-between gap-3 px-3 py-2 text-sm"
                      >
                        <span>
                          {r.display_name}{" "}
                          <span className="text-paper/45">
                            ({r.status ?? "present"}
                            {r.source ? `/${r.source}` : ""})
                          </span>
                        </span>
                        <span className="text-paper/45">
                          {r.checked_at.slice(11, 19)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {byDay.length === 0 ? (
                <li className="text-paper/45">Brak obecności w filtrze.</li>
              ) : null}
            </ul>
          ) : (
            <ul className="divide-y divide-paper/10 border border-paper/10">
              {filtered.map((r) => (
                <li key={r.id} className="px-3 py-2 text-sm">
                  <span className="font-medium">{r.display_name}</span>
                  <span className="ml-2 text-paper/45">
                    {r.status ?? "present"} · {r.checked_at}
                  </span>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-paper/45">Brak wpisów.</li>
              ) : null}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
