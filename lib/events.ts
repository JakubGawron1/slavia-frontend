/** Widok UI kalendarza + mapowanie DTO z Orval. */

import type {
  AthleteCalendarEvent,
  CalendarEvent,
  EventWithdrawal,
  PublicCalendarEvent,
  TrainingScheduleDefaults,
  WithdrawalStatus,
} from "@/lib/api/generated/models";

export type {
  AthleteCalendarEvent,
  CalendarEvent,
  TrainingScheduleDefaults,
  WithdrawalStatus,
};

/** Alias historyczny — DTO kadry to `CalendarEvent` z Orval. */
export type CalendarEventFull = CalendarEvent;

export type EventType = "zawody" | "trening" | "zebranie" | "inne";

export type EventStatus = "scheduled" | "cancelled";

export type ClubEvent = {
  id: string;
  title: string;
  type: EventType;
  /** ISO date YYYY-MM-DD — początek */
  date: string;
  /** ISO date YYYY-MM-DD — koniec (włącznie); brak = jednodniowe */
  end_date?: string;
  time?: string;
  location?: string;
  description?: string;
  status?: EventStatus;
  cancellation_note?: string;
  /** Własny status obecności (kalendarz zawodnika, treningi) */
  attendance_status?: "present" | "absent" | "withdrawn";
  /** Frekwencja (kalendarz kadry, treningi) */
  attendance_counts?: { present: number; expected: number };
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  zawody: "Zawody",
  trening: "Trening",
  zebranie: "Zebranie",
  inne: "Inne",
};

export function eventTypeLabel(type: string): string {
  return EVENT_TYPE_LABELS[mapPublicType(type)];
}

export function eventAssignedIds(e: CalendarEvent): string[] {
  return e.assigned_athlete_ids ?? [];
}

export function eventWithdrawals(e: CalendarEvent): EventWithdrawal[] {
  return e.withdrawals ?? [];
}

export type EventsQuery = {
  from?: string;
  to?: string;
};

function mapPublicType(t: string): EventType {
  if (t === "zawody" || t === "trening" || t === "zebranie" || t === "inne") {
    return t;
  }
  return "inne";
}

export function publicApiToClubEvent(raw: PublicCalendarEvent): ClubEvent {
  const end = raw.end_date?.trim();
  return {
    id: raw.id,
    title: raw.title,
    type: mapPublicType(raw.event_type),
    date: raw.date,
    end_date: end && end.length === 10 && end !== raw.date ? end : undefined,
    time: raw.time ?? undefined,
    location: raw.location ?? undefined,
    description: raw.description ?? undefined,
    status: (raw.status as EventStatus) || "scheduled",
    cancellation_note: raw.cancellation_note ?? undefined,
  };
}

export function fullToClubEvent(e: CalendarEvent): ClubEvent {
  return publicApiToClubEvent(e);
}

/**
 * Źródło wydarzeń kalendarza publicznego.
 */
export async function getEvents(query: EventsQuery = {}): Promise<ClubEvent[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (baseUrl) {
    try {
      const params = new URLSearchParams();
      if (query.from) params.set("from", query.from);
      if (query.to) params.set("to", query.to);
      const qs = params.toString();
      const url = `${baseUrl}/api/public/events${qs ? `?${qs}` : ""}`;

      const response = await fetch(url, {
        next: { revalidate: 60, tags: ["events"] },
      });

      if (response.ok) {
        const data = (await response.json()) as PublicCalendarEvent[];
        return data
          .map(publicApiToClubEvent)
          .sort(
            (a, b) =>
              a.date.localeCompare(b.date) ||
              (a.time ?? "").localeCompare(b.time ?? ""),
          );
      }
    } catch {
      // Backend niedostępny
    }
  }

  return [];
}
