"use client";

import { useState } from "react";
import {
  buildMonthGrid,
  formatPolishDate,
  getMonthLabel,
  getWeekdayLabels,
  shiftMonth,
} from "@/lib/calendar";
import {
  EVENT_TYPE_LABELS,
  type ClubEvent,
  type EventType,
} from "@/lib/events";

const TYPE_STYLES: Record<EventType, string> = {
  zawody: "bg-brand text-paper",
  trening: "bg-steel text-paper",
  zebranie: "bg-mist text-ink",
  inne: "bg-background text-ink ring-1 ring-mist",
};

const EVENT_BAR: Record<EventType, string> = {
  zawody: "bg-brand/90 text-paper",
  trening: "bg-steel/90 text-paper",
  zebranie: "bg-mist text-ink",
  inne: "bg-background text-steel ring-1 ring-mist",
};

type ClubCalendarProps = {
  initialEvents: ClubEvent[];
  todayKey: string;
};

export function ClubCalendar({ initialEvents, todayKey }: ClubCalendarProps) {
  const initial = (() => {
    const [y, m] = todayKey.split("-").map(Number);
    return { year: y, monthIndex: m - 1 };
  })();

  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [filter, setFilter] = useState<EventType | "all">("all");

  const filtered =
    filter === "all"
      ? initialEvents
      : initialEvents.filter((e) => e.type === filter);

  const eventsByDate = new Map<string, ClubEvent[]>();
  for (const event of filtered) {
    const list = eventsByDate.get(event.date) ?? [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  const cells = buildMonthGrid(year, monthIndex);
  const selectedEvents = eventsByDate.get(selectedKey) ?? [];
  const upcoming = filtered.filter((e) => e.date >= todayKey).slice(0, 5);

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

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-6">
      <div className="border border-mist bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist px-4 py-3 sm:px-5">
          <h2 className="font-display text-2xl tracking-wide text-ink uppercase sm:text-3xl lg:text-4xl">
            {getMonthLabel(year, monthIndex)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="border border-mist px-3.5 py-2.5 text-base text-steel transition-colors hover:border-steel-soft hover:text-ink"
              aria-label="Poprzedni miesiąc"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToday}
              className="border border-mist px-3.5 py-2.5 font-display text-sm tracking-[0.12em] text-steel uppercase transition-colors hover:border-brand hover:text-brand"
            >
              Dziś
            </button>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="border border-mist px-3.5 py-2.5 text-base text-steel transition-colors hover:border-steel-soft hover:text-ink"
              aria-label="Następny miesiąc"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-mist px-4 py-3 sm:px-5">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Wszystkie"
          />
          {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
            <FilterChip
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
              label={EVENT_TYPE_LABELS[type]}
            />
          ))}
        </div>

        <div className="grid grid-cols-7 border-b border-mist bg-background/80 text-center">
          {getWeekdayLabels().map((label) => (
            <div
              key={label}
              className="py-2.5 font-display text-xs tracking-[0.16em] text-steel uppercase sm:text-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr">
          {cells.map((cell) => {
            const dayEvents = eventsByDate.get(cell.key) ?? [];
            const selected = cell.key === selectedKey;
            const isToday = cell.key === todayKey;
            const visibleEvents = dayEvents.slice(0, 3);
            const extra = dayEvents.length - visibleEvents.length;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedKey(cell.key)}
                className={`flex min-h-[5.75rem] flex-col gap-1 border-r border-b border-mist p-1.5 text-left transition-colors sm:min-h-[7rem] sm:p-2 md:min-h-[8rem] lg:min-h-[9rem] lg:p-2.5 ${
                  selected
                    ? "bg-ink text-paper"
                    : cell.inMonth
                      ? "bg-paper text-ink hover:bg-background"
                      : "bg-background/70 text-steel-soft/60"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center font-display text-base sm:h-9 sm:w-9 sm:text-lg md:text-xl ${
                    isToday
                      ? selected
                        ? "bg-brand text-paper"
                        : "bg-brand text-paper"
                      : selected
                        ? "text-paper"
                        : "text-ink"
                  } ${!cell.inMonth && !isToday ? "text-steel-soft/50" : ""}`}
                >
                  {cell.day}
                </span>

                <span className="flex min-h-0 w-full flex-1 flex-col gap-0.5 overflow-hidden">
                  {visibleEvents.map((event) => (
                    <span
                      key={event.id}
                      className={`truncate px-1 py-0.5 font-display text-[0.65rem] leading-tight tracking-wide uppercase sm:text-xs ${
                        selected
                          ? "bg-brand/80 text-paper"
                          : EVENT_BAR[event.type]
                      }`}
                      title={event.title}
                    >
                      {event.time ? `${event.time} · ` : ""}
                      {event.title}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span
                      className={`px-1 text-[0.65rem] sm:text-xs ${
                        selected ? "text-paper/60" : "text-steel-soft"
                      }`}
                    >
                      +{extra} więcej
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
        <section className="border border-mist bg-ink text-paper">
          <div className="border-b border-paper/10 px-4 py-3 sm:px-5">
            <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
              Wybrany dzień
            </p>
            <h3 className="mt-1 font-display text-lg tracking-wide uppercase sm:text-xl">
              {formatPolishDate(selectedKey)}
            </h3>
          </div>
          <ul className="divide-y divide-paper/10">
            {selectedEvents.length === 0 ? (
              <li className="px-4 py-5 text-sm text-paper/55 sm:px-5">
                Brak wydarzeń tego dnia.
              </li>
            ) : (
              selectedEvents.map((event) => (
                <li key={event.id} className="px-4 py-4 sm:px-5">
                  <EventRow event={event} dark />
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="border border-mist bg-paper">
          <div className="border-b border-mist px-4 py-3 sm:px-5">
            <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
              Nadchodzące
            </p>
            <h3 className="mt-1 font-display text-lg tracking-wide text-ink uppercase">
              Najbliższe terminy
            </h3>
          </div>
          <ul className="divide-y divide-mist">
            {upcoming.length === 0 ? (
              <li className="px-4 py-5 text-sm text-steel-soft sm:px-5">
                Brak nadchodzących wydarzeń w filtrze.
              </li>
            ) : (
              upcoming.map((event) => (
                <li key={event.id} className="px-4 py-3.5 sm:px-5">
                  <button
                    type="button"
                    className="w-full text-left transition-opacity hover:opacity-80"
                    onClick={() => {
                      const parts = event.date.split("-").map(Number);
                      setYear(parts[0]);
                      setMonthIndex(parts[1] - 1);
                      setSelectedKey(event.date);
                    }}
                  >
                    <EventRow event={event} compact />
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors sm:text-sm ${
        active
          ? "bg-brand text-paper"
          : "border border-mist text-steel hover:border-steel-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function EventRow({
  event,
  dark = false,
  compact = false,
}: {
  event: ClubEvent;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col ${compact ? "gap-1" : "gap-1.5"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${TYPE_STYLES[event.type]}`}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>
        <span className={`text-xs ${dark ? "text-paper/50" : "text-steel-soft"}`}>
          {event.date}
          {event.time ? ` · ${event.time}` : ""}
        </span>
      </div>
      <p
        className={`font-display tracking-wide uppercase ${
          compact ? "text-base" : "text-lg"
        } ${dark ? "text-paper" : "text-ink"}`}
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
    </div>
  );
}
