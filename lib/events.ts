/** Typy kalendarza — spójne z backendem CalendarEvent / DTO. */

export type EventType = "zawody" | "trening" | "zebranie" | "inne";

export type EventStatus = "scheduled" | "cancelled";

export type WithdrawalStatus = "pending" | "accepted" | "rejected";

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

export type CalendarEventFull = {
  id: string;
  title: string;
  event_type: string;
  date: string;
  end_date?: string | null;
  time?: string | null;
  location?: string | null;
  description?: string | null;
  status: string;
  cancellation_note?: string | null;
  club_assigned: boolean;
  source: string;
  locked: boolean;
  all_athletes: boolean;
  assigned_athlete_ids: string[];
  withdrawals: Array<{
    athlete_id: string;
    user_id?: string | null;
    reason: string;
    at: string;
    status: WithdrawalStatus;
  }>;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type AssignedAthleteBrief = {
  id: string;
  display_name: string;
};

export type AthleteCalendarEvent = {
  id: string;
  title: string;
  event_type: string;
  date: string;
  end_date?: string | null;
  time?: string | null;
  location?: string | null;
  description?: string | null;
  status: string;
  cancellation_note?: string | null;
  club_assigned: boolean;
  all_athletes: boolean;
  assigned_athletes: AssignedAthleteBrief[];
  i_am_assigned: boolean;
  roster_announced: boolean;
  my_withdrawal_status?: string | null;
  attendance_status?: string | null;
};

export type TrainingScheduleDefaults = {
  weekdays: number[];
  time: string;
  end_time: string;
  location: string;
  title: string;
  attendance_buffer_minutes: number;
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

export function publicApiToClubEvent(raw: {
  id: string;
  title: string;
  event_type: string;
  date: string;
  end_date?: string | null;
  time?: string | null;
  location?: string | null;
  description?: string | null;
  status?: string;
  cancellation_note?: string | null;
}): ClubEvent {
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

export function fullToClubEvent(e: CalendarEventFull): ClubEvent {
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
        const data = (await response.json()) as Array<{
          id: string;
          title: string;
          event_type: string;
          date: string;
          end_date?: string | null;
          time?: string | null;
          location?: string | null;
          description?: string | null;
          status?: string;
          cancellation_note?: string | null;
        }>;
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
