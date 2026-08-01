"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { klubFetch } from "@/lib/klub-api";
import { QrCodeImage } from "@/components/QrCodeImage";

type AttendanceSession = {
  token: string;
  label: string;
  refreshed_at: string;
};

type AttendanceRecord = {
  id: string;
  user_id: string;
  display_name: string;
  checked_at: string;
};

type PublicUser = {
  id: string;
  display_name: string;
  roles: string[];
};

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export default function StaffObecnoscPage() {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"agenda" | "day">("agenda");

  const load = useCallback(async () => {
    setError(null);
    try {
      const [s, r, u] = await Promise.all([
        klubFetch<AttendanceSession>("/api/attendance/session"),
        klubFetch<AttendanceRecord[]>("/api/attendance"),
        klubFetch<PublicUser[]>("/api/users").catch(() => [] as PublicUser[]),
      ]);
      setSession(s);
      setRecords(r);
      setUsers(u.filter((x) => x.roles.includes("zawodnik")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd obecności");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refreshQr() {
    try {
      const s = await klubFetch<AttendanceSession>("/api/attendance/session", {
        method: "POST",
        body: {},
      });
      setSession(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się odświeżyć");
    }
  }

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterUser && r.user_id !== filterUser) return false;
      if (filterDay && !r.checked_at.startsWith(filterDay)) return false;
      return true;
    });
  }, [records, filterUser, filterDay]);

  const byDay = useMemo(() => {
    const map = new Map<string, AttendanceRecord[]>();
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
          Kod QR odświeżany tylko ręcznie. Lista w oknie: bieżący rok ± 2 miesiące.
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="border border-paper/10 bg-paper/[0.03] p-4 print:border-0">
          <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
            Kod sesji · {session?.label ?? "—"}
          </p>
          {session && qrPayload ? (
            <QrCodeImage
              value={qrPayload}
              size={280}
              alt="Kod QR obecności"
              className="mx-auto mt-4 h-56 w-56 bg-paper p-2"
            />
          ) : (
            <p className="mt-4 text-sm text-paper/45">Brak sesji — odśwież kod.</p>
          )}
          <p className="mt-3 break-all font-mono text-[10px] text-paper/40">
            {session?.token}
          </p>
          <p className="mt-1 text-xs text-paper/40">
            Odświeżono: {session?.refreshed_at ?? "—"}
          </p>
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

        <div className="space-y-4">
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
              Kalendarz dnia
            </button>
            <select
              className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm"
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
            <input
              type="date"
              className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            />
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
                    {day} · {list.length} os.
                  </p>
                  <ul className="mt-2 divide-y divide-paper/10 border border-paper/10">
                    {list.map((r) => (
                      <li
                        key={r.id}
                        className="flex justify-between gap-3 px-3 py-2 text-sm"
                      >
                        <span>{r.display_name}</span>
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
                  <span className="ml-2 text-paper/45">{r.checked_at}</span>
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
