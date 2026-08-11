import type { ReactNode } from "react";
import { formatPolishDate } from "@/lib/calendar";
import type { ClubEvent } from "@/lib/events";
import { EventRow } from "@/components/calendar/EventRow";
import type {
  CalendarTone,
  SelectEventHandler,
  ToneClasses,
} from "@/components/calendar/calendar-styles";

export type CalendarAsideProps = {
  t: ToneClasses;
  tone: CalendarTone;
  roomy: boolean;
  selectedKey: string;
  selectedEvents: ClubEvent[];
  upcoming: ClubEvent[];
  onSelectDay?: (dateKey: string) => void;
  onSelectEvent?: SelectEventHandler;
  onJumpToUpcoming: (event: ClubEvent, anchor?: DOMRect) => void;
  renderEventDetails?: (event: ClubEvent) => ReactNode;
};

export function CalendarAside({
  t,
  tone,
  roomy,
  selectedKey,
  selectedEvents,
  upcoming,
  onSelectDay,
  onSelectEvent,
  onJumpToUpcoming,
  renderEventDetails,
}: CalendarAsideProps) {
  return (
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
                        "aside",
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
                  onClick={(e) =>
                    onJumpToUpcoming(
                      event,
                      (e.currentTarget as HTMLElement).getBoundingClientRect(),
                    )
                  }
                >
                  <EventRow event={event} compact dark={tone === "panel"} />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
}
