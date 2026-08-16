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
import { useToast } from "@/components/toast/ToastProvider";
import type { CalendarEventFull } from "@/lib/events";
import { attendanceDayKey } from "@/lib/attendance-ui";

export type AttendanceSessionLocal = {
  token: string;
  label: string;
  created_at: string;
  refreshed_at: string;
};

export type AttendanceRecordLocal = {
  id: string;
  user_id: string;
  display_name: string;
  checked_at: string;
  session_token: string;
  event_id?: string | null;
  status?: string;
  source?: string;
};

export function useStaffObecnosc() {
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
      const k = attendanceDayKey(r.checked_at);
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

  return {
    session,
    pending,
    users,
    trainings,
    selectedEventId,
    setSelectedEventId,
    approveEventById,
    setApproveEventById,
    filterUser,
    setFilterUser,
    error,
    view,
    setView,
    load,
    refreshQr,
    approvePending,
    rejectPending,
    filtered,
    byDay,
    qrPayload,
    selectedTraining,
  };
}
