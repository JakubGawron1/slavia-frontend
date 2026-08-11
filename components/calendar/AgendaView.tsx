import type { ReactNode } from "react";
import { formatPolishDate } from "@/lib/calendar";
import type { ClubEvent } from "@/lib/events";
import { EventRow } from "@/components/calendar/EventRow";
import type {
  CalendarTone,
  SelectEventHandler,
  ToneClasses,
} from "@/components/calendar/calendar-styles";

export type AgendaDay = { key: string; events: ClubEvent[] };

export type AgendaViewProps = {
  t: ToneClasses;
  tone: CalendarTone;
  agendaDays: AgendaDay[];
  todayKey: string;
  onSelectDay?: (dateKey: string) => void;
  onSelectEvent?: SelectEventHandler;
  renderEventDetails?: (event: ClubEvent) => ReactNode;
  setSelectedKey: (key: string) => void;
};

export function AgendaView({
  t,
  tone,
  agendaDays,
  todayKey,
  onSelectDay,
  onSelectEvent,
  renderEventDetails,
  setSelectedKey,
}: AgendaViewProps) {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto border-b ${t.rootBorder}`}>
      <ul>
        {agendaDays.map(({ key: dayKey, events: dayEvents }) => (
          <li key={dayKey} className={`border-b ${t.rootBorder}`}>
            <div
              className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 ${t.headerBg}`}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3
                  className={`font-display text-sm tracking-wide uppercase sm:text-base ${t.title}`}
                >
                  {formatPolishDate(dayKey)}
                </h3>
                {dayKey === todayKey ? (
                  <span className="font-display text-[0.65rem] tracking-[0.14em] text-brand uppercase">
                    Dziś
                  </span>
                ) : null}
              </div>
              {onSelectDay ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(dayKey);
                    onSelectDay(dayKey);
                  }}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center border font-display text-lg leading-none transition-colors hover:border-brand hover:text-brand ${t.chipIdle}`}
                  aria-label={`Dodaj wydarzenie ${formatPolishDate(dayKey)}`}
                  title="Dodaj wydarzenie"
                >
                  +
                </button>
              ) : null}
            </div>
            {dayEvents.length === 0 ? (
              <p className={`px-4 py-3 text-sm sm:px-5 ${t.muted}`}>
                Brak wydarzeń
              </p>
            ) : (
              <ul
                className={`divide-y ${
                  tone === "panel" ? "divide-paper/10" : "divide-mist"
                }`}
              >
                {dayEvents.map((event) => (
                  <li key={event.id} className="px-4 py-3.5 sm:px-5">
                    {onSelectEvent ? (
                      <button
                        type="button"
                        className="w-full text-left transition-opacity hover:opacity-80"
                        onClick={(e) => {
                          setSelectedKey(dayKey);
                          onSelectEvent(
                            event,
                            (
                              e.currentTarget as HTMLElement
                            ).getBoundingClientRect(),
                            "agenda",
                          );
                        }}
                      >
                        <EventRow event={event} dark={tone === "panel"} />
                      </button>
                    ) : (
                      <EventRow event={event} dark={tone === "panel"} />
                    )}
                    {renderEventDetails?.(event)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
