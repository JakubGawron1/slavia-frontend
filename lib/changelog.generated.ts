/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { ChangelogEntry } from "@/lib/changelog";

export const GENERATED_CHANGELOG: ChangelogEntry[] = [
  {
    "version": "1.0.0.2+4",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "DevTools: test e-mail",
    "notes": [
      "Zakładka Debug: formularz wysyłki testowego maila na podany adres (superadmin)."
    ]
  },
  {
    "version": "1.0.0.2+5",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "DevTools: test e-mail przez Brevo",
    "notes": [
      "Zakładka Debug: copy i podpowiedzi pod Brevo (zamiast Resend)."
    ]
  },
  {
    "version": "1.0.0.2+4",
    "date": "2026-08-04",
    "category": "backend",
    "title": "DevTools: testowy e-mail",
    "notes": [
      "`POST /api/admin/debug/send-test-email` (superadmin) — wysyłka testowa przez Resend / log w dev."
    ]
  },
  {
    "version": "1.0.0.2+4",
    "date": "2026-08-04",
    "category": "mobile",
    "title": "Fix: build Windows bez Firebase C++ SDK",
    "notes": [
      "Usunięto `firebase_core` / `firebase_messaging` z `pubspec` — CMake padał na extract `firebase_cpp_sdk_windows_*.zip`.",
      "Push: inbox + lokalne toasty; FCM odłożone na plugin Android-only."
    ]
  },
  {
    "version": "1.0.0.2+5",
    "date": "2026-08-04",
    "category": "mobile",
    "title": "Fix: Windows build bez ATL",
    "notes": [
      "Usunięto `flutter_secure_storage` i `flutter_local_notifications` (wymagały `atlbase.h` / `atlstr.h` w VS Build Tools).",
      "Sesja JWT: `shared_preferences`; powiadomienia: inbox in-app (bez natywnych toastów)."
    ]
  },
  {
    "version": "1.0.0.2+5",
    "date": "2026-08-04",
    "category": "backend",
    "title": "Mail: Resend → Brevo",
    "notes": [
      "Provider e-mail: Brevo (`BREVO_API_KEY`, `EMAIL_FROM` jako zweryfikowany sender).",
      "Usunięto `RESEND_API_KEY` / klienta Resend."
    ]
  },
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
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "category": "mobile",
    "title": "Aplikacja Flutter dla zawodników",
    "notes": [
      "Klient Android/Windows: logowanie z zapisem JWT, pulpit, wyniki, obecność QR, kalendarz, plany, ustawienia (upload zdjęcia), Sinclair, Co nowego, skrzynka powiadomień.",
      "Push FCM na Androidzie (rejestracja `/api/devices`); Windows: inbox + lokalne toasty przy pollingu.",
      "Motyw Material 3 z brandem klubowym; `applicationId` `pl.cksslavia.zawodnik`."
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
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "category": "backend",
    "title": "E-mail (Resend): weryfikacja, reset, powiadomienia",
    "notes": [
      "Moduł `mail` — Resend HTTPS (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ENABLED`); w dev log zamiast wysyłki.",
      "Pola użytkownika: `email_verified`, `pending_email`, `notification_prefs`; KV `email_tokens`.",
      "Auto-weryfikacja adresów z domeną `.dev` / `.local`.",
      "Endpointy: `POST /api/auth/email/request-verification`, `confirm`, `forgot-password`, `reset-password`.",
      "E-mail + in-app: skład zawodów (w tym wypisanie), plany treningowe, kontakt do kadry; potwierdzenie formularza do nadawcy."
    ]
  },
  {
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "category": "frontend",
    "title": "E-mail: weryfikacja, reset hasła, preferencje",
    "notes": [
      "Bramka weryfikacji e-mail po logowaniu (panel + klub); strony `/weryfikacja-emaila`, `/zapomniane-haslo`, `/reset-hasla`.",
      "Link „Nie pamiętam hasła” na logowaniu.",
      "Ustawienia: zmiana e-maila + przełączniki powiadomień (skład, plany, kontakt dla kadry).",
      "Klient OpenAPI / Orval: nowe endpointy auth e-mail."
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
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "category": "backend",
    "title": "Push FCM + device tokens",
    "notes": [
      "`POST/DELETE /api/devices` — rejestracja tokenów FCM per użytkownik (KV `device_tokens`).",
      "Przy `notify_user` wysyłka FCM (legacy HTTP) gdy ustawione `FCM_SERVER_KEY`; invalid tokeny usuwane.",
      "OpenAPI: schemat `DeviceToken`, tag `devices`."
    ]
  },
  {
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "category": "frontend",
    "title": "Sync „Co nowego” → Flutter",
    "notes": [
      "`scripts/sync-changelog.mjs` generuje `slavia-mobile/lib/generated/user_changelog.g.dart` z `CHANGELOG.user.md`."
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
