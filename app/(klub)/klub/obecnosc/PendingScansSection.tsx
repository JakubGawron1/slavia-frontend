import type { CalendarEventFull } from "@/lib/events";
import { formatAttendanceCheckedAtLabel } from "@/lib/attendance-ui";
import type { AttendanceRecordLocal } from "./useStaffObecnosc";

type PendingScansSectionProps = {
  pending: AttendanceRecordLocal[];
  trainings: CalendarEventFull[];
  approveEventById: Record<string, string>;
  onApproveEventChange: (recordId: string, eventId: string) => void;
  onApprove: (record: AttendanceRecordLocal) => void;
  onReject: (record: AttendanceRecordLocal) => void;
};

export function PendingScansSection({
  pending,
  trainings,
  approveEventById,
  onApproveEventChange,
  onApprove,
  onReject,
}: PendingScansSectionProps) {
  if (pending.length === 0) return null;

  return (
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
                {formatAttendanceCheckedAtLabel(r.checked_at)}
                {r.event_id
                  ? ` · trening ${
                      trainings.find((t) => t.id === r.event_id)?.title ??
                      r.event_id.slice(0, 8)
                    }`
                  : " · bez treningu"}
              </p>
              {!r.event_id ? (
                <select
                  className="mt-2 border border-paper/20 bg-chrome/40 px-2 py-1 text-xs"
                  value={approveEventById[r.id] ?? ""}
                  onChange={(e) => onApproveEventChange(r.id, e.target.value)}
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
                onClick={() => onApprove(r)}
                className="border border-brand/50 bg-brand/15 px-3 py-1.5 text-[11px] uppercase"
              >
                Zezwól
              </button>
              <button
                type="button"
                onClick={() => onReject(r)}
                className="border border-paper/25 px-3 py-1.5 text-[11px] uppercase"
              >
                Odrzuć
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
