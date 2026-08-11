import {
  ATTENDANCE_COUNTS_CHIP,
  ATTENDANCE_STYLES,
  attendanceCountsTone,
} from "@/lib/attendance-ui";
import { EVENT_TYPE_LABELS, type ClubEvent } from "@/lib/events";
import { TYPE_STYLES } from "@/components/calendar/calendar-styles";

export function EventRow({
  event,
  dark = false,
  compact = false,
}: {
  event: ClubEvent;
  dark?: boolean;
  compact?: boolean;
}) {
  const cancelled = event.status === "cancelled";
  const countsTone = event.attendance_counts
    ? attendanceCountsTone(
        event.attendance_counts.present,
        event.attendance_counts.expected,
      )
    : "empty";
  return (
    <div className={`flex flex-col ${compact ? "gap-1" : "gap-1.5"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${TYPE_STYLES[event.type]}`}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>
        {cancelled ? (
          <span className="px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] text-brand uppercase ring-1 ring-brand/60">
            Odwołane
          </span>
        ) : null}
        {event.attendance_status ? (
          <span
            className={`px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${ATTENDANCE_STYLES[event.attendance_status].badge}`}
          >
            {ATTENDANCE_STYLES[event.attendance_status].label}
          </span>
        ) : null}
        {event.attendance_counts && countsTone !== "empty" ? (
          <span
            className={`px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${ATTENDANCE_COUNTS_CHIP[countsTone]}`}
          >
            {event.attendance_counts.present}/{event.attendance_counts.expected}
          </span>
        ) : null}
        <span className={`text-xs ${dark ? "text-paper/50" : "text-steel-soft"}`}>
          {event.end_date && event.end_date !== event.date
            ? `${event.date} – ${event.end_date}`
            : event.date}
          {event.time ? ` · ${event.time}` : ""}
        </span>
      </div>
      <p
        className={`font-display tracking-wide break-words uppercase ${
          compact ? "text-base" : "text-lg"
        } ${dark ? "text-paper" : "text-ink"} ${cancelled ? "line-through opacity-80" : ""}`}
      >
        {event.title}
      </p>
      {!compact && event.location ? (
        <p className={`text-sm ${dark ? "text-paper/60" : "text-steel-soft"}`}>
          {event.location}
        </p>
      ) : null}
      {!compact && event.description ? (
        <p className={`text-sm ${dark ? "text-paper/55" : "text-steel-soft"}`}>
          {event.description}
        </p>
      ) : null}
      {!compact && cancelled && event.cancellation_note ? (
        <p className={`text-sm ${dark ? "text-brand/80" : "text-brand"}`}>
          Powód: {event.cancellation_note}
        </p>
      ) : null}
    </div>
  );
}
