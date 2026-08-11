import {
  buildWeekSpans,
  eventEndKey,
  getWeekdayLabels,
  isMultiDay,
  type CalendarCell,
} from "@/lib/calendar";
import { ATTENDANCE_COUNTS_CHIP, ATTENDANCE_STYLES, attendanceCountsTone } from "@/lib/attendance-ui";
import type { ClubEvent } from "@/lib/events";
import {
  EVENT_BAR,
  type SelectEventHandler,
  type ToneClasses,
} from "@/components/calendar/calendar-styles";

export type MonthGridProps = {
  t: ToneClasses;
  weeks: CalendarCell[][];
  filtered: ClubEvent[];
  eventsById: Map<string, ClubEvent>;
  todayKey: string;
  selectedKey: string;
  onCellSelect: (key: string) => void;
  onSelectEvent?: SelectEventHandler;
  roomy: boolean;
  maxVisible: number;
  barH: number;
  barGap: number;
  dayHead: number;
  dayNumClass: string;
  weekdayClass: string;
  barTextClass: string;
  weekPad: number;
  colTemplate: string;
};

export function MonthGrid({
  t,
  weeks,
  filtered,
  eventsById,
  todayKey,
  selectedKey,
  onCellSelect,
  onSelectEvent,
  roomy,
  maxVisible,
  barH,
  barGap,
  dayHead,
  dayNumClass,
  weekdayClass,
  barTextClass,
  weekPad,
  colTemplate,
}: MonthGridProps) {
  return (
    <>
      <div
        className={`grid border-b text-center ${t.rootBorder} ${t.headerBg}`}
        style={{ gridTemplateColumns: colTemplate }}
      >
        {getWeekdayLabels().map((label) => (
          <div
            key={label}
            className={`py-3 font-display tracking-[0.16em] uppercase ${t.muted} ${weekdayClass}`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className={`flex min-h-0 flex-1 flex-col border-b ${t.rootBorder}`}>
        {weeks.map((week) => {
          const spans = buildWeekSpans(week, filtered);
          const laneCount =
            spans.length === 0 ? 0 : Math.max(...spans.map((s) => s.lane)) + 1;
          const visibleLaneCount = Math.min(laneCount, maxVisible);
          const extraLanes = laneCount - visibleLaneCount;
          const barsRem =
            visibleLaneCount * (barH + barGap) + (extraLanes > 0 ? 1.1 : 0);
          const weekMinH = dayHead + barsRem + weekPad;

          return (
            <div
              key={week[0]?.key ?? "week"}
              className={`relative grid min-h-0 ${roomy ? "h-full flex-1" : ""}`}
              style={{
                minHeight: `${weekMinH}rem`,
                gridTemplateColumns: colTemplate,
                gridTemplateRows: "1fr",
              }}
            >
              {week.map((cell) => {
                const selected = cell.key === selectedKey;
                const isToday = cell.key === todayKey;
                return (
                  <div
                    key={cell.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => onCellSelect(cell.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onCellSelect(cell.key);
                      }
                    }}
                    className={`relative flex cursor-pointer flex-col border-r border-b p-1.5 text-left sm:p-2 ${t.rootBorder} ${
                      selected
                        ? t.cellSelected
                        : cell.inMonth
                          ? t.cellIn
                          : t.cellOut
                    }`}
                  >
                    <span
                      className={`inline-flex shrink-0 items-center justify-center font-display ${dayNumClass} ${
                        isToday
                          ? "bg-brand text-paper"
                          : selected
                            ? "text-brand"
                            : t.dayNum
                      } ${!cell.inMonth && !isToday ? "opacity-40" : ""}`}
                    >
                      {cell.day}
                    </span>
                  </div>
                );
              })}

              <div
                className="pointer-events-none absolute right-0 left-0 z-[1] grid px-0.5"
                style={{
                  top: `${dayHead}rem`,
                  bottom: "0.25rem",
                  gridTemplateColumns: colTemplate,
                  gridAutoRows: `${barH}rem`,
                  rowGap: `${barGap}rem`,
                  alignContent: "start",
                }}
              >
                {spans
                  .filter((s) => s.lane < maxVisible)
                  .map((span) => {
                    const event = eventsById.get(span.eventId);
                    if (!event) return null;
                    const showTitle = !span.continuesLeft;
                    return (
                      <button
                        key={`${span.eventId}-${span.startCol}-${span.lane}`}
                        type="button"
                        title={`${event.title}${
                          isMultiDay(event)
                            ? ` · ${event.date} – ${eventEndKey(event)}`
                            : event.time
                              ? ` · ${event.time}`
                              : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCellSelect(week[span.startCol]?.key ?? event.date);
                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          onSelectEvent?.(event, rect, "calendar");
                        }}
                        className={`pointer-events-auto mx-0.5 overflow-hidden px-2 text-left font-display leading-snug tracking-wide uppercase ${barTextClass} ${
                          event.status === "cancelled"
                            ? "line-through opacity-70"
                            : ""
                        } ${EVENT_BAR[event.type]} ${
                          span.continuesLeft ? "rounded-l-none" : ""
                        } ${span.continuesRight ? "rounded-r-none" : ""}`}
                        style={{
                          gridColumn: `${span.startCol + 1} / ${span.endCol + 2}`,
                          gridRow: span.lane + 1,
                        }}
                      >
                        <span className="flex h-full min-w-0 items-center gap-1.5">
                          {event.attendance_status ? (
                            <span
                              className={`inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-paper/40 ${ATTENDANCE_STYLES[event.attendance_status].dot}`}
                              title={ATTENDANCE_STYLES[event.attendance_status].label}
                              aria-hidden
                            />
                          ) : null}
                          <span className="min-w-0 flex-1 truncate">
                            {span.continuesLeft ? "… " : ""}
                            {showTitle ? event.title : ""}
                            {span.continuesRight ? " …" : ""}
                          </span>
                          <EventAttendanceCountsChip event={event} />
                        </span>
                      </button>
                    );
                  })}
                {extraLanes > 0 ? (
                  <span
                    className={`px-1 text-[0.65rem] ${t.muted}`}
                    style={{
                      gridColumn: "1 / -1",
                      gridRow: visibleLaneCount + 1,
                    }}
                  >
                    +{extraLanes} więcej
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function EventAttendanceCountsChip({ event }: { event: ClubEvent }) {
  if (!event.attendance_counts) return null;
  const tone = attendanceCountsTone(
    event.attendance_counts.present,
    event.attendance_counts.expected,
  );
  if (tone === "empty") return null;
  return (
    <span
      className={`ml-0.5 shrink-0 px-1 py-0.5 font-display text-[0.6rem] leading-none tracking-wide sm:text-[0.65rem] ${ATTENDANCE_COUNTS_CHIP[tone]}`}
    >
      {event.attendance_counts.present}/{event.attendance_counts.expected}
    </span>
  );
}
