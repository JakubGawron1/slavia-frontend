import {
  ATTENDANCE_NONE_BADGE,
  ATTENDANCE_NONE_LABEL,
  ATTENDANCE_STYLES,
} from "@/lib/attendance-ui";
import type { RosterAttendanceRow } from "@/components/klub/calendar/useStaffCalendar";

export function AttendanceSection({
  detailRoster,
}: {
  detailRoster: RosterAttendanceRow[];
}) {
  return (
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
  );
}
