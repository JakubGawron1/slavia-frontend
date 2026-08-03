"use client";

import { useState, type ReactNode } from "react";
import {
  buildMonthGrid,
  buildWeekSpans,
  eventEndKey,
  formatPolishDate,
  getMonthLabel,
  getWeekdayLabels,
  isMultiDay,
  shiftMonth,
} from "@/lib/calendar";
import {
  ATTENDANCE_COUNTS_CHIP,
  ATTENDANCE_STYLES,
  attendanceCountsTone,
} from "@/lib/attendance-ui";
import {
  EVENT_TYPE_LABELS,
  type ClubEvent,
  type EventType,
} from "@/lib/events";

export const TYPE_STYLES: Record<EventType, string> = {
  zawody: "bg-brand text-paper",
  trening: "bg-[#2f6f7e] text-paper",
  zebranie: "bg-mist text-ink",
  inne: "bg-background text-ink ring-1 ring-mist",
};

export const EVENT_BAR: Record<EventType, string> = {
  zawody: "bg-brand text-paper",
  trening: "bg-[#2f6f7e] text-paper",
  zebranie: "bg-[#5a5248] text-paper",
  inne: "bg-[#4b5563] text-paper",
};

export type CalendarTone = "site" | "panel";

export type CalendarGridProps = {
  events: ClubEvent[];
  todayKey: string;
  filterTypes?: EventType[];
  hideCancelled?: boolean;
  onHideCancelledChange?: (v: boolean) => void;
  extraFilters?: ReactNode;
  renderEventDetails?: (event: ClubEvent) => ReactNode;
  onSelectEvent?: (event: ClubEvent, anchor?: DOMRect) => void;
  /** Klik w dzień (tło komórki) — np. dodanie wydarzenia */
  onSelectDay?: (dateKey: string) => void;
  size?: "default" | "medium" | "large";
  layout?: "default" | "wide";
  /** panel = ciemny motyw paneli; site = publiczny /kalendarz */
  tone?: CalendarTone;
  /** Ukryj boczne panele dnia/nadchodzących */
  hideAside?: boolean;
};

type ToneClasses = {
  rootBorder: string;
  rootBg: string;
  title: string;
  muted: string;
  chipIdle: string;
  chipActive: string;
  headerBg: string;
  cellIn: string;
  cellOut: string;
  cellSelected: string;
  dayNum: string;
  asideDark: string;
  asideLight: string;
  asideTitle: string;
};

const TONES: Record<CalendarTone, ToneClasses> = {
  site: {
    rootBorder: "border-mist",
    rootBg: "bg-surface",
    title: "text-ink",
    muted: "text-steel",
    chipIdle: "border border-mist text-steel hover:border-steel-soft hover:text-ink",
    chipActive: "bg-brand text-paper",
    headerBg: "bg-background/80",
    cellIn: "bg-surface text-ink hover:bg-background",
    cellOut: "bg-background/70 text-steel-soft/60",
    cellSelected: "bg-brand/[0.08] ring-2 ring-inset ring-brand",
    dayNum: "text-ink",
    asideDark: "border-mist bg-chrome text-paper",
    asideLight: "border-mist bg-surface",
    asideTitle: "text-ink",
  },
  panel: {
    rootBorder: "border-paper/15",
    rootBg: "bg-chrome/55",
    title: "text-paper",
    muted: "text-paper/55",
    chipIdle:
      "border border-paper/20 text-paper/60 hover:border-paper/40 hover:text-paper",
    chipActive: "bg-brand text-paper",
    headerBg: "bg-paper/[0.04]",
    cellIn: "bg-chrome/40 text-paper hover:bg-paper/[0.06]",
    cellOut: "bg-chrome/20 text-paper/30",
    cellSelected: "bg-brand/15 ring-2 ring-inset ring-brand",
    dayNum: "text-paper",
    asideDark: "border-paper/15 bg-chrome/80 text-paper",
    asideLight: "border-paper/15 bg-chrome/50",
    asideTitle: "text-paper",
  },
};

export function CalendarMonthGrid({
  events,
  todayKey,
  filterTypes,
  hideCancelled = false,
  onHideCancelledChange,
  extraFilters,
  renderEventDetails,
  onSelectEvent,
  onSelectDay,
  size = "default",
  layout = "default",
  tone = "site",
  hideAside = false,
}: CalendarGridProps) {
  const t = TONES[tone];
  const initial = (() => {
    const [y, m] = todayKey.split("-").map(Number);
    return { year: y, monthIndex: m - 1 };
  })();

  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [filter, setFilter] = useState<EventType | "all">("all");

  const types = filterTypes ?? (Object.keys(EVENT_TYPE_LABELS) as EventType[]);
  const large = size === "large";
  const medium = size === "medium";
  const roomy = large || medium;
  const wide = layout === "wide";

  let filtered = hideCancelled
    ? events.filter((e) => e.status !== "cancelled")
    : events;
  if (filter !== "all") {
    filtered = filtered.filter((e) => e.type === filter);
  }

  const eventsByDate = new Map<string, ClubEvent[]>();
  for (const event of filtered) {
    // Indeksuj po wszystkich dniach zakresu (pasek + panel dnia)
    const end = eventEndKey(event);
    let cursor = event.date;
    while (cursor <= end) {
      const list = eventsByDate.get(cursor) ?? [];
      list.push(event);
      eventsByDate.set(cursor, list);
      const [y, m, d] = cursor.split("-").map(Number);
      const next = new Date(y!, m! - 1, d! + 1);
      cursor = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
    }
  }

  const cells = buildMonthGrid(year, monthIndex);
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const selectedEvents = (eventsByDate.get(selectedKey) ?? []).filter(
    (e, i, arr) => arr.findIndex((x) => x.id === e.id) === i,
  );
  const upcoming = filtered
    .filter((e) => eventEndKey(e) >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  const maxVisible = roomy ? 4 : 3;
  const barH = large ? 1.9 : medium ? 1.55 : 1.15;
  const barGap = roomy ? 0.18 : 0.15;
  const dayHead = large ? 2.7 : medium ? 2.45 : 2.25;
  /** Równe kolumny — paski wydarzeń muszą dzielić ten sam układ co komórki dni. */
  const colTemplate = "repeat(7, minmax(0, 1fr))";

  const monthTitleClass = large
    ? "text-3xl sm:text-4xl lg:text-5xl"
    : medium
      ? "text-2xl sm:text-3xl lg:text-4xl"
      : "text-2xl sm:text-3xl lg:text-4xl";
  const weekdayClass = roomy
    ? "text-sm sm:text-base"
    : "text-xs sm:text-sm";
  const dayNumClass = large
    ? "h-9 w-9 text-lg sm:h-10 sm:w-10 sm:text-xl"
    : medium
      ? "h-8 w-8 text-base sm:h-9 sm:w-9 sm:text-lg"
      : "h-8 w-8 text-base sm:h-9 sm:w-9 sm:text-lg md:text-xl";
  const barTextClass = large
    ? "text-xs sm:text-sm"
    : medium
      ? "text-[0.7rem] sm:text-xs"
      : "text-[0.65rem]";
  const weekPad = roomy ? 0.55 : 0.5;

  function goMonth(delta: number) {
    const next = shiftMonth(year, monthIndex, delta);
    setYear(next.year);
    setMonthIndex(next.monthIndex);
  }

  function goToday() {
    const [y, m] = todayKey.split("-").map(Number);
    setYear(y);
    setMonthIndex(m - 1);
    setSelectedKey(todayKey);
  }

  const eventsById = new Map(filtered.map((e) => [e.id, e]));

  return (
    <div
      className={`grid h-full gap-5 ${
        hideAside
          ? ""
          : wide
            ? "xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-stretch xl:gap-5"
            : "xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6"
      } ${roomy ? "min-h-[min(48rem,calc(100svh-10.5rem))]" : ""}`}
    >
      <div
        className={`flex min-h-0 min-w-0 flex-col border ${t.rootBorder} ${t.rootBg} ${
          roomy ? "h-full" : ""
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 ${t.rootBorder}`}
        >
          <h2
            className={`font-display tracking-wide uppercase ${t.title} ${monthTitleClass}`}
          >
            {getMonthLabel(year, monthIndex)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className={`border px-3.5 py-2.5 text-base transition-colors ${t.chipIdle}`}
              aria-label="Poprzedni miesiąc"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToday}
              className={`border px-3.5 py-2.5 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:border-brand hover:text-brand ${t.chipIdle}`}
            >
              Dziś
            </button>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className={`border px-3.5 py-2.5 text-base transition-colors ${t.chipIdle}`}
              aria-label="Następny miesiąc"
            >
              →
            </button>
          </div>
        </div>

        <div
          className={`flex flex-wrap gap-2 border-b px-4 py-3 sm:px-5 ${t.rootBorder}`}
        >
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Wszystkie"
            idle={t.chipIdle}
            activeClass={t.chipActive}
          />
          {types.map((type) => (
            <FilterChip
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
              label={EVENT_TYPE_LABELS[type]}
              swatch={EVENT_BAR[type]}
              idle={t.chipIdle}
              activeClass={t.chipActive}
            />
          ))}
          {onHideCancelledChange ? (
            <FilterChip
              active={hideCancelled}
              onClick={() => onHideCancelledChange(!hideCancelled)}
              label="Ukryj odwołane"
              idle={t.chipIdle}
              activeClass={t.chipActive}
            />
          ) : null}
          {extraFilters}
        </div>

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

        <div
          className={`flex min-h-0 flex-1 flex-col border-b ${t.rootBorder}`}
        >
          {weeks.map((week) => {
            const spans = buildWeekSpans(week, filtered);
            const laneCount =
              spans.length === 0
                ? 0
                : Math.max(...spans.map((s) => s.lane)) + 1;
            const visibleLaneCount = Math.min(laneCount, maxVisible);
            const extraLanes = laneCount - visibleLaneCount;
            const barsRem =
              visibleLaneCount * (barH + barGap) +
              (extraLanes > 0 ? 1.1 : 0);
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
                      onClick={() => {
                        setSelectedKey(cell.key);
                        onSelectDay?.(cell.key);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedKey(cell.key);
                          onSelectDay?.(cell.key);
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
                            setSelectedKey(
                              week[span.startCol]?.key ?? event.date,
                            );
                            const rect = (
                              e.currentTarget as HTMLElement
                            ).getBoundingClientRect();
                            onSelectEvent?.(event, rect);
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
                              {showTitle
                                ? `${event.time && !isMultiDay(event) && !event.attendance_counts ? `${event.time} · ` : ""}${event.title}`
                                : ""}
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
      </div>

      {!hideAside ? (
        <aside
          className={`flex flex-col gap-4 ${
            roomy
              ? "xl:h-full xl:min-h-0 xl:self-stretch"
              : "xl:sticky xl:top-24 xl:self-start"
          }`}
        >
          <section className={`border ${t.asideDark}`}>
            <div className="border-b border-paper/10 px-4 py-3 sm:px-5">
              <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
                Wybrany dzień
              </p>
              <h3 className="mt-1 font-display text-lg tracking-wide text-paper uppercase sm:text-xl">
                {formatPolishDate(selectedKey)}
              </h3>
            </div>
            <ul className="divide-y divide-paper/10">
              {selectedEvents.length === 0 ? (
                <li className="px-4 py-5 text-sm text-paper/55 sm:px-5">
                  Brak wydarzeń tego dnia.
                  {onSelectDay ? (
                    <button
                      type="button"
                      className="mt-3 block font-display text-xs tracking-wide text-brand uppercase"
                      onClick={() => onSelectDay(selectedKey)}
                    >
                      + Dodaj wydarzenie
                    </button>
                  ) : null}
                </li>
              ) : (
                selectedEvents.map((event) => (
                  <li key={event.id} className="px-4 py-4 sm:px-5">
                    {onSelectEvent ? (
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={(e) =>
                          onSelectEvent(
                            event,
                            (e.currentTarget as HTMLElement).getBoundingClientRect(),
                          )
                        }
                      >
                        <EventRow event={event} dark />
                      </button>
                    ) : (
                      <EventRow event={event} dark />
                    )}
                    {renderEventDetails?.(event)}
                  </li>
                ))
              )}
            </ul>
          </section>

          <section
            className={`flex min-h-0 flex-col border ${t.asideLight} ${
              roomy ? "xl:flex-1" : ""
            }`}
          >
            <div className={`border-b px-4 py-3 sm:px-5 ${t.rootBorder}`}>
              <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
                Nadchodzące
              </p>
              <h3
                className={`mt-1 font-display text-lg tracking-wide uppercase ${t.asideTitle}`}
              >
                Najbliższe terminy
              </h3>
            </div>
            <ul
              className={`min-h-0 divide-y ${
                roomy ? "flex-1 overflow-y-auto" : ""
              } ${tone === "panel" ? "divide-paper/10" : "divide-mist"}`}
            >
              {upcoming.length === 0 ? (
                <li className={`px-4 py-5 text-sm sm:px-5 ${t.muted}`}>
                  Brak nadchodzących wydarzeń w filtrze.
                </li>
              ) : (
                upcoming.map((event) => (
                  <li key={event.id} className="px-4 py-3.5 sm:px-5">
                    <button
                      type="button"
                      className="w-full text-left transition-opacity hover:opacity-80"
                      onClick={(e) => {
                        const parts = event.date.split("-").map(Number);
                        setYear(parts[0]);
                        setMonthIndex(parts[1] - 1);
                        setSelectedKey(event.date);
                        onSelectEvent?.(
                          event,
                          (e.currentTarget as HTMLElement).getBoundingClientRect(),
                        );
                      }}
                    >
                      <EventRow
                        event={event}
                        compact
                        dark={tone === "panel"}
                      />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </aside>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  swatch,
  idle,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  swatch?: string;
  idle: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors sm:text-sm ${
        active ? activeClass : idle
      }`}
    >
      {swatch && !active ? (
        <span className={`h-2.5 w-2.5 shrink-0 ${swatch}`} aria-hidden />
      ) : null}
      {label}
    </button>
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
