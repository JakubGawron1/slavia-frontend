export type EventType = "zawody" | "trening" | "zebranie" | "inne";

export type ClubEvent = {
  id: string;
  title: string;
  type: EventType;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** optional HH:mm */
  time?: string;
  location?: string;
  description?: string;
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  zawody: "Zawody",
  trening: "Trening",
  zebranie: "Zebranie",
  inne: "Inne",
};

/**
 * Mock na czas developmentu.
 * Po podłączeniu API Rust zastąp implementację getEvents() fetchiem.
 */
const MOCK_EVENTS: ClubEvent[] = [
  {
    id: "1",
    title: "Trening klubowy",
    type: "trening",
    date: "2026-08-03",
    time: "15:00",
    location: "ul. Konopnickiej 13, Ruda Śląska",
    description: "Regularny trening dwuboju — rwanie i podrzut.",
  },
  {
    id: "2",
    title: "Trening klubowy",
    type: "trening",
    date: "2026-08-05",
    time: "15:00",
    location: "ul. Konopnickiej 13, Ruda Śląska",
  },
  {
    id: "3",
    title: "Trening klubowy",
    type: "trening",
    date: "2026-08-07",
    time: "15:00",
    location: "ul. Konopnickiej 13, Ruda Śląska",
  },
  {
    id: "4",
    title: "Kontrola masy ciała",
    type: "inne",
    date: "2026-08-12",
    time: "17:00",
    location: "Sala klubowa",
    description: "Ważenie przed startami — obowiązkowe dla zgłoszonych zawodników.",
  },
  {
    id: "5",
    title: "Puchar Śląska — młodzież",
    type: "zawody",
    date: "2026-08-22",
    time: "09:00",
    location: "Piekary Śląskie",
    description: "Starty kategorii młodzieżowych. Zbiórka przy klubie o 7:00.",
  },
  {
    id: "6",
    title: "Zebranie zarządu",
    type: "zebranie",
    date: "2026-08-26",
    time: "18:30",
    location: "ul. Konopnickiej 13",
  },
  {
    id: "7",
    title: "Mistrzostwa Śląska U23",
    type: "zawody",
    date: "2026-09-12",
    time: "10:00",
    location: "Katowice",
    description: "Dwudniowe zawody — szczegóły w ogłoszeniach.",
  },
  {
    id: "8",
    title: "Mistrzostwa Śląska U23 — dzień 2",
    type: "zawody",
    date: "2026-09-13",
    time: "10:00",
    location: "Katowice",
  },
  {
    id: "9",
    title: "Trening otwarty dla rodziców",
    type: "trening",
    date: "2026-09-19",
    time: "16:00",
    location: "ul. Konopnickiej 13",
    description: "Pokaz techniki i rozmowa o planie sezonu.",
  },
];

export type EventsQuery = {
  from?: string;
  to?: string;
};

/**
 * Źródło wydarzeń kalendarza.
 * Próbuje backend Rust (`/api/events`); przy braku endpointu wraca do mocków.
 */
export async function getEvents(query: EventsQuery = {}): Promise<ClubEvent[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (baseUrl) {
    try {
      const params = new URLSearchParams();
      if (query.from) params.set("from", query.from);
      if (query.to) params.set("to", query.to);
      const qs = params.toString();
      const url = `${baseUrl}/api/events${qs ? `?${qs}` : ""}`;

      const response = await fetch(url, {
        next: { revalidate: 60, tags: ["events"] },
      });

      if (response.ok) {
        return (await response.json()) as ClubEvent[];
      }
    } catch {
      // Backend niedostępny lub brak /api/events — mock poniżej
    }
  }

  return MOCK_EVENTS.filter((event) => {
    if (query.from && event.date < query.from) return false;
    if (query.to && event.date > query.to) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""));
}
