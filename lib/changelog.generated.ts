/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { ChangelogEntry } from "@/lib/changelog";

export const GENERATED_CHANGELOG: ChangelogEntry[] = [
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "category": "backend",
    "title": "`end_date` dla zawodów",
    "notes": [
      "`CalendarEvent.end_date` (włącznie); brak / równy `date` = jednodniowe.",
      "Walidacja w create/update: treningi bez zakresu; zawody z opcjonalnym zakresem.",
      "Publiczne / zawodnik DTO zwracają `end_date` gdy zakres > 1 dzień."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "category": "frontend",
    "title": "DevTools: Changelog + wersja platformy",
    "notes": [
      "Nowa zakładka Changelog w `/klub/devtools` (podział Frontend / Backend / Mobile).",
      "Wersja platformy z `Slavia.toml` (`lib/version.ts`) widoczna w stopce strony publicznej.",
      "Skrypt `scripts/sync-version.mjs` synchronizuje version w package.json / Cargo.toml / pubspec.yaml.",
      "Wpisy changelogu pochodzą z `CHANGELOG.md` każdego projektu (`sync-changelog`)."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "category": "frontend",
    "title": "Fix: kalendarz zawodnika",
    "notes": [
      "`GET /api/events/mine` nie robi już N× odczytów DB na każde wydarzenie (profile + attendance raz).",
      "Reconcile auto-nieobecności ograniczone do ostatnich 21 dni i zbatchowane.",
      "Zakres dat w żądaniu FE + wskaźnik ładowania."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "category": "backend",
    "title": "Fix: wydajność `/api/events/mine`",
    "notes": [
      "Jednorazowe `list_profiles` + `list_attendance` przy budowie widoku zawodnika (wcześniej per event).",
      "`reconcile_past_training_attendance_since_days` — batch + limit dni (mine: 21, attendance: 62).",
      "Widoczność: `club_assigned` **lub** `all_athletes` **lub** skład; treningi bez rozdmuchanej listy `assigned_athletes`."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "category": "mobile",
    "title": "Sync wersji poprawki",
    "notes": [
      "`Slavia.toml` dopuszcza `X.Y.Z.W+build`; mobile dostaje kompatybilne `semver3+build` (np. `1.0.1+1`)."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "category": "mobile",
    "title": "Wersja z monorepo",
    "notes": [
      "`pubspec.yaml` version: `X.Y.Z+build` — część `X.Y.Z` z `Slavia.toml`, build zachowywany."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "category": "backend",
    "title": "Wspólna wersja OpenAPI",
    "notes": [
      "`info.version` w OpenAPI synchronizowane z `Slavia.toml` (`sync-version`).",
      "Brak breaking API w tej wersji — klienci (web/mobile) dzielą ten sam numer."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "category": "frontend",
    "title": "Zawody wielodniowe w kalendarzu",
    "notes": [
      "Formularz tworzenia/edycji zawodów: pole **Data zakończenia** (domyślnie = dzień rozpoczęcia).",
      "Siatka kalendarza: pasek wydarzenia przez wiele dni (`end_date`).",
      "Odwołanie / usuwanie / przywracanie przez modale UI (bez `alert` / `confirm` / `prompt`)."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-01",
    "category": "backend",
    "title": "Kalendarz, obecność, RBAC",
    "notes": [
      "`GET /api/events/mine` z `attendance_status`; reconcile auto-absent.",
      "Endpointy obecności / flag / stats pod panelem superadmina.",
      "libSQL lokalnie (dev) / Turso w produkcji."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-01",
    "category": "frontend",
    "title": "Panel klubowy i obecność w kalendarzu",
    "notes": [
      "Kolorystyczna notacja obecności w kalendarzu zawodnika i kadry.",
      "StaffCalendar: frekwencja, lista obecności w modalu, link do `/klub/obecnosc`.",
      "DevTools: flagi (stable/experimental), statystyki, mapa tras, debug sesji."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-07-15",
    "category": "mobile",
    "title": "Bootstrap Flutter",
    "notes": [
      "Szablon aplikacji `slavia_mobile` (Flutter) — baza pod klienta mobilnego API."
    ]
  }
];
