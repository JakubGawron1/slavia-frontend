import type { PublicUser } from "@/lib/api/generated/models";
import type { CalendarEventFull } from "@/lib/events";
import type { AttendanceRecordLocal } from "./useStaffObecnosc";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChip } from "@/components/ui/FilterChip";
import { formatAttendanceCheckedAt, formatAttendanceCheckedAtLabel } from "@/lib/attendance-ui";

type AttendanceListViewProps = {
  trainings: CalendarEventFull[];
  selectedEventId: string;
  onSelectedEventIdChange: (id: string) => void;
  selectedTraining: CalendarEventFull | undefined;
  view: "agenda" | "day";
  onViewChange: (view: "agenda" | "day") => void;
  users: PublicUser[];
  filterUser: string;
  onFilterUserChange: (id: string) => void;
  onRefresh: () => void;
  filtered: AttendanceRecordLocal[];
  byDay: [string, AttendanceRecordLocal[]][];
};

export function AttendanceListView({
  trainings,
  selectedEventId,
  onSelectedEventIdChange,
  selectedTraining,
  view,
  onViewChange,
  users,
  filterUser,
  onFilterUserChange,
  onRefresh,
  filtered,
  byDay,
}: AttendanceListViewProps) {
  return (
    <>
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <label className="text-sm">
          Filtr treningu
          <select
            className="mt-1 block min-w-[16rem] border border-paper/20 bg-chrome/40 px-2 py-2 text-sm"
            value={selectedEventId}
            onChange={(e) => onSelectedEventIdChange(e.target.value)}
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
        <FilterChip
          active={view === "agenda"}
          onClick={() => onViewChange("agenda")}
          label="Agenda"
        />
        <FilterChip
          active={view === "day"}
          onClick={() => onViewChange("day")}
          label="Lista"
        />
        <select
          className="border border-paper/20 bg-chrome/40 px-2 py-1.5 text-sm"
          value={filterUser}
          onChange={(e) => onFilterUserChange(e.target.value)}
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
          onClick={onRefresh}
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
                      {formatAttendanceCheckedAt(r.checked_at).time}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {byDay.length === 0 ? (
            <li>
              <EmptyState
                title="Brak obecności w filtrze"
                description="Zmień trening, zawodnika albo odśwież listę."
              />
            </li>
          ) : null}
        </ul>
      ) : (
        <ul className="divide-y divide-paper/10 border border-paper/10">
          {filtered.map((r) => (
            <li key={r.id} className="px-3 py-2 text-sm">
              <span className="font-medium">{r.display_name}</span>
              <span className="ml-2 text-paper/45">
                {r.status ?? "present"} ·{" "}
                {formatAttendanceCheckedAtLabel(r.checked_at)}
              </span>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li>
              <EmptyState
                title="Brak wpisów"
                description="W wybranym filtrze nie ma zapisanych obecności."
              />
            </li>
          ) : null}
        </ul>
      )}
    </>
  );
}
