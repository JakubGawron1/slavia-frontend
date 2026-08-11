"use client";

import { useState, type ReactNode } from "react";
import {
  buildMonthGrid,
  eventEndKey,
  getMonthLabel,
  shiftMonth,
} from "@/lib/calendar";
import { EVENT_TYPE_LABELS, type ClubEvent, type EventType } from "@/lib/events";
import { useIsDesktop } from "@/lib/use-media-query";
import { AgendaView } from "@/components/calendar/AgendaView";
import { CalendarAside } from "@/components/calendar/CalendarAside";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { EventRow } from "@/components/calendar/EventRow";
import { FilterChip } from "@/components/calendar/FilterChip";
import {
  EVENT_BAR,
  TONES,
  TYPE_STYLES,
  type CalendarTone,
  type SelectEventHandler,
} from "@/components/calendar/calendar-styles";

// Re-eksporty dla zewnętrznych importów (kompatybilność wsteczna).
export { EVENT_BAR, TYPE_STYLES, EventRow };
export type { CalendarTone };

type CalendarViewMode = "calendar" | "agenda";

export type CalendarGridProps = {
  events: ClubEvent[];
  todayKey: string;
  filterTypes?: EventType[];
  hideCancelled?: boolean;
  onHideCancelledChange?: (v: boolean) => void;
  extraFilters?: ReactNode;
  renderEventDetails?: (event: ClubEvent) => ReactNode;
  onSelectEvent?: SelectEventHandler;
  /** Klik w dzień (tło komórki) / plus w agendzie — np. dodanie wydarzenia */
  onSelectDay?: (dateKey: string) => void;
  size?: "default" | "medium" | "large";
  layout?: "default" | "wide";
  /** panel = ciemny motyw paneli; site = publiczny /kalendarz */
  tone?: CalendarTone;
  /** Ukryj boczne panele dnia/nadchodzących */
  hideAside?: boolean;
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
  const isDesktop = useIsDesktop();
  const initial = (() => {
    const [y, m] = todayKey.split("-").map(Number);
    return { year: y, monthIndex: m - 1 };
  })();

  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [filter, setFilter] = useState<EventType | "all">("all");
  /** Preferencja tylko na desktopie; mobile (i SSR) zawsze agenda. */
  const [desktopView, setDesktopView] = useState<CalendarViewMode>("calendar");
  const view: CalendarViewMode = isDesktop === true ? desktopView : "agenda";
  const showCalendar = view === "calendar";
  const showViewToggle = isDesktop === true;

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
  const weekdayClass = roomy ? "text-sm sm:text-base" : "text-xs sm:text-sm";
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

  function selectCell(key: string) {
    setSelectedKey(key);
    onSelectDay?.(key);
  }

  function jumpToUpcoming(event: ClubEvent, anchor?: DOMRect) {
    const parts = event.date.split("-").map(Number);
    setYear(parts[0]!);
    setMonthIndex(parts[1]! - 1);
    setSelectedKey(event.date);
    onSelectEvent?.(event, anchor, "aside");
  }

  const eventsById = new Map(filtered.map((e) => [e.id, e]));

  const agendaDays = (() => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const days: { key: string; events: ClubEvent[] }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = (eventsByDate.get(key) ?? []).filter(
        (e, i, arr) => arr.findIndex((x) => x.id === e.id) === i,
      );
      days.push({ key, events: dayEvents });
    }
    return days;
  })();

  const showAside = !hideAside && showCalendar;

  return (
    <div
      className={`grid h-full gap-5 ${
        !showAside
          ? ""
          : wide
            ? "xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-stretch xl:gap-5"
            : "xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6"
      } ${roomy && showCalendar ? "min-h-[min(48rem,calc(100svh-10.5rem))]" : ""}`}
    >
      <div
        className={`flex min-h-0 min-w-0 flex-col border ${t.rootBorder} ${t.rootBg} ${
          roomy && showCalendar ? "h-full" : ""
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
          <div className="flex flex-wrap items-center gap-2">
            {showViewToggle ? (
              <div
                className="mr-1 flex"
                role="group"
                aria-label="Widok kalendarza"
              >
                <button
                  type="button"
                  onClick={() => setDesktopView("agenda")}
                  className={`border px-3 py-2.5 font-display text-xs tracking-[0.1em] uppercase transition-colors sm:text-sm ${
                    view === "agenda" ? t.chipActive : t.chipIdle
                  }`}
                >
                  Agenda
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopView("calendar")}
                  className={`border px-3 py-2.5 font-display text-xs tracking-[0.1em] uppercase transition-colors sm:text-sm ${
                    view === "calendar" ? t.chipActive : t.chipIdle
                  }`}
                >
                  Kalendarz
                </button>
              </div>
            ) : null}
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

        {!showCalendar ? (
          <AgendaView
            t={t}
            tone={tone}
            agendaDays={agendaDays}
            todayKey={todayKey}
            onSelectDay={onSelectDay}
            onSelectEvent={onSelectEvent}
            renderEventDetails={renderEventDetails}
            setSelectedKey={setSelectedKey}
          />
        ) : null}

        {showCalendar ? (
          <MonthGrid
            t={t}
            weeks={weeks}
            filtered={filtered}
            eventsById={eventsById}
            todayKey={todayKey}
            selectedKey={selectedKey}
            onCellSelect={selectCell}
            onSelectEvent={onSelectEvent}
            roomy={roomy}
            maxVisible={maxVisible}
            barH={barH}
            barGap={barGap}
            dayHead={dayHead}
            dayNumClass={dayNumClass}
            weekdayClass={weekdayClass}
            barTextClass={barTextClass}
            weekPad={weekPad}
            colTemplate={colTemplate}
          />
        ) : null}
      </div>

      {showAside ? (
        <CalendarAside
          t={t}
          tone={tone}
          roomy={roomy}
          selectedKey={selectedKey}
          selectedEvents={selectedEvents}
          upcoming={upcoming}
          onSelectDay={onSelectDay}
          onSelectEvent={onSelectEvent}
          onJumpToUpcoming={jumpToUpcoming}
          renderEventDetails={renderEventDetails}
        />
      ) : null}
    </div>
  );
}
