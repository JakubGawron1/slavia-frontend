/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { ChangelogEntry } from "@/lib/changelog";

export const GENERATED_CHANGELOG: ChangelogEntry[] = [
  {
    "version": "1.0.0.3+20",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Feature: `event_date` w wynikach",
    "notes": [
      "`CompetitionResult.event_date` (YYYY-MM-DD) + wymagane w `POST /api/results` (zawody i trening).",
      "Kategoria wagowa nadal z podanej masy ciała + tabel JSON i wieku/płci z profilu — data wydarzenia jej nie zmienia."
    ]
  },
  {
    "version": "1.0.0.3+19",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Feature: auto kategoria wagowa (2026)",
    "notes": [
      "`POST /api/results` (zawody): kategoria z profilu (`birth_date`, `sex`) + `bodyweight_kg` wg tabel U15–Senior.",
      "Opcjonalne `profile_id` (staff); masa ciała wymagana; ręczne `category` ignorowane dla zawodów.",
      "Moduł `weightlifting_categories` + testy jednostkowe."
    ]
  },
  {
    "version": "1.0.0.3+19",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Feature: auto kategoria wagowa przy zawodach",
    "notes": [
      "Panel `/panel/wyniki` i weryfikacja: zawodnik podaje tylko masę ciała; kategoria z wieku/płci profilu + tabeli 2026.",
      "Podgląd kategorii w formularzu (`U20 M 75` itd.)."
    ]
  },
  {
    "version": "1.0.0.3+20",
    "date": "2026-08-05",
    "category": "mobile",
    "title": "Feature: data zawodów / treningu",
    "notes": [
      "Formularz wyników: wybór daty wydarzenia (wymagana) dla zawodów i rekordów treningowych."
    ]
  },
  {
    "version": "1.0.0.3+20",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Feature: data zawodów / treningu w wynikach",
    "notes": [
      "Formularze panelu i weryfikacji: wymagane pole daty (`event_date`).",
      "Kategoria wagowa bez zmian: z podanej masy + tabel 2026 i wieku/płci z profilu."
    ]
  },
  {
    "version": "1.0.0.3+21",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Feature: kategoria z zawodów → profil",
    "notes": [
      "Po akceptacji wyniku z zawodów (weryfikacja albo wpis kadry) `category` + `bodyweight_kg` trafiają do `AthleteProfile`.",
      "Statystyki panelu i listy kont biorą kategorię z profilu — wahania wagi przy krawędzi kategorii rozwiązane ważeniem na zawodach."
    ]
  },
  {
    "version": "1.0.0.3+15",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Fix: CORS dla X-View-As-User",
    "notes": [
      "`CorsLayer.allow_headers` obejmuje `x-view-as-user` — bez tego przeglądarka nie wysyłała nagłówka podglądu."
    ]
  },
  {
    "version": "1.0.0.3+15",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Fix: podgląd konta — dane targetu",
    "notes": [
      "CORS: dozwolony nagłówek `X-View-As-User` (wcześniej przeglądarka go blokowała).",
      "Czyszczenie cache React Query przy zmianie `viewAs`.",
      "Panel (pulpit/plany/wyniki/obecność/kalendarz): przeładowanie przy zmianie podglądanego konta."
    ]
  },
  {
    "version": "1.0.0.3+15",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Fix: skrzynka powiadomień na mobile",
    "notes": [
      "`NotificationBell`: panel przez portal `fixed` z clampem do viewportu (nie ucieka poza ekran / nie jest ucinany przez `overflow-hidden` w shellach).",
      "Nagłówki `KlubShell` / `PanelShell`: zawijanie i krótsze etykiety akcji na wąskich ekranach."
    ]
  },
  {
    "version": "1.0.0.3+18",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Flagi e-mail",
    "notes": [
      "Katalog: `experimental_notification_emails` (OFF) — gate w `notify_user` dla kanałów Squad/TrainingPlan/Contact.",
      "Stable ON: `email_password_reset`, `email_verification`, `email_contact_confirmation`, `email_test` + `Database::is_flag_enabled`.",
      "Public flags: ekspozycja `experimental_notification_emails`."
    ]
  },
  {
    "version": "1.0.0.3+18",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Flagi: e-maile powiadomień vs transakcyjne",
    "notes": [
      "Nowa flaga experimental `experimental_notification_emails` (domyślnie OFF) — przełączniki w ustawieniach i wysyłka maili o składzie / planach / kontakcie.",
      "Nowe flagi stable (domyślnie ON): `email_password_reset`, `email_verification`, `email_contact_confirmation`, `email_test`."
    ]
  },
  {
    "version": "1.0.0.3+21",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Sync: kategoria po weryfikacji zawodów",
    "notes": [
      "Po zaakceptowaniu wyniku z zawodów oficjalna kategoria/masa w profilu aktualizuje się automatycznie (widać na pulpicie i w kontach)."
    ]
  },
  {
    "version": "1.0.0.3+17",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "UX: kalendarz / agenda",
    "notes": [
      "`CalendarMonthGrid`: desktop domyślnie siatka miesiąca, poniżej `lg` zawsze agenda; toggle „Agenda / Kalendarz” tylko na desktopie.",
      "Dotyczy publicznego `/kalendarz`, kadry `/klub/kalendarz` i panelu `/panel/kalendarz`.",
      "Hook `useIsDesktop` (`lib/use-media-query.ts`)."
    ]
  },
  {
    "version": "1.0.0.3+17",
    "date": "2026-08-05",
    "category": "mobile",
    "title": "UX: kalendarz = agenda",
    "notes": [
      "Ekran kalendarza: lista wydarzeń według dni (bez siatki miesiąca), nawigacja miesiącami."
    ]
  },
  {
    "version": "1.0.0.3+19",
    "date": "2026-08-05",
    "category": "mobile",
    "title": "UX: kategoria wagowa z profilu",
    "notes": [
      "Przy zawodach tylko masa ciała — kategoria wyliczana na serwerze z wieku/płci w profilu."
    ]
  },
  {
    "version": "1.0.0.3+16",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "UX: rekord treningowy bez nazwy",
    "notes": [
      "Panel `/panel/wyniki`: przy rodzaju „Rekord treningowy” brak pola nazwy — wysyłane jako „Trening”."
    ]
  },
  {
    "version": "1.0.0.3+16",
    "date": "2026-08-05",
    "category": "mobile",
    "title": "UX: rekord treningowy bez nazwy",
    "notes": [
      "Formularz wyników: przy „Trening” brak pola nazwy (wysyłane jako „Trening”); masa/miejsce/kategoria tylko przy zawodach."
    ]
  },
  {
    "version": "1.0.0.3+16",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Wyniki: trening bez wymaganej nazwy",
    "notes": [
      "`POST /api/results` przy `kind=training`: puste `event_name` → domyślnie „Trening”; nazwa wymagana tylko dla zawodów."
    ]
  },
  {
    "version": "1.0.0.2+13",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Baza danych: modal zamiast confirm",
    "notes": [
      "`/klub/baza-danych`: potwierdzenie usunięcia rekordu w `Modal` zamiast natywnego `window.confirm`."
    ]
  },
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
    "version": "1.0.0.2+6",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Dzwonek: usuwanie powiadomień",
    "notes": [
      "W skrzynce powiadomień (dzwonek) każdy wpis ma przycisk usuwania; klient OpenAPI: `DELETE /api/notifications/{id}`."
    ]
  },
  {
    "version": "1.0.0.2+10",
    "date": "2026-08-04",
    "category": "mobile",
    "title": "Feature: nawigacja wstecz (desktop + Android)",
    "notes": [
      "Przycisk Back myszy, Alt+← / BrowserBack — `pop` ze stacku GoRouter.",
      "Systemowy wstecz: z zakładki wraca na pulpit; podstrony mają `BackButton`.",
      "`DetailScaffold` dla Sinclair / Co nowego / Ustawienia."
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
    "version": "1.0.0.2+7",
    "date": "2026-08-04",
    "category": "mobile",
    "title": "Fix: logowanie Windows — komunikat zamiast „ciszy”",
    "notes": [
      "Konto bez roli `zawodnik` (np. superadmin) pokazuje błąd zamiast wracać na `/login` bez informacji.",
      "GoRouter nie jest odtwarzany przy każdej zmianie auth (stabilniejsza nawigacja po loginie).",
      "Czytelniejsze komunikaty przy braku połączenia z API."
    ]
  },
  {
    "version": "1.0.0.2+12",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Fix: SettingsCategory i typy details",
    "notes": [
      "`SettingsCategory`: stan `open` zamiast nieobsługiwanego w typach React `defaultOpen` na `<details>` (build TypeScript)."
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
    "version": "1.0.0.2+11",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Kalendarz: tylko tytuł na paskach",
    "notes": [
      "Siatka miesiąca: w ramkach wydarzeń widoczny wyłącznie tytuł (bez godziny); godzina nadal w tooltipie i panelu dnia."
    ]
  },
  {
    "version": "1.0.0.2+8",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Klub / Konta: formularze w modalach",
    "notes": [
      "`/klub/konta`: na stronie tylko tabele; tworzenie i edycja kont oraz profili w `Modal`."
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
    "version": "1.0.0.3+14",
    "date": "2026-08-04",
    "category": "backend",
    "title": "Podgląd kont — View-As (read-only)",
    "notes": [
      "`AuthUser.view_as` + nagłówek `X-View-As-User` (tylko superadmin).",
      "`GET /api/auth/me` i scoped reads (`plans`, `notifications`, `athlete/stats`, `results?mine`, `my-events`, attendance) używają `effective_id`.",
      "Mutacje przy aktywnym View-As → 403 (wyjątek: `preview/start|stop`).",
      "`preview/start` odrzuca nieaktywne / własne konto."
    ]
  },
  {
    "version": "1.0.0.3+14",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Podgląd kont / ról — pełny pakiet",
    "notes": [
      "Automatyczny nagłówek `X-View-As-User` w `apiMutator` / `fetchMe` (sesja actora bez nagłówka).",
      "Nav i RoleSwitcher pokazują target; banner kończy podgląd przez `preview/stop`.",
      "`/klub/podglad`: wyszukiwanie, filtr roli, redirect do `/klub` lub `/panel`.",
      "Panel zawodnika: banner podglądu, dane targetu, powrót do `/klub/podglad`."
    ]
  },
  {
    "version": "1.0.0.2+6",
    "date": "2026-08-04",
    "category": "backend",
    "title": "Powiadomienia: usuwanie",
    "notes": [
      "`DELETE /api/notifications/{id}` — właściciel może usunąć swoje powiadomienie."
    ]
  },
  {
    "version": "1.0.0.2+9",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Ustawienia: dwa kolumny",
    "notes": [
      "Zwijane kategorie ustawień w układzie `lg:grid-cols-2` (konto | wygląd/prywatność)."
    ]
  },
  {
    "version": "1.0.0.2+10",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Ustawienia: E-mail i hasło w jednej kategorii",
    "notes": [
      "Sekcje e-mail i hasło połączone w zwijaną kategorię „E-mail i hasło”."
    ]
  },
  {
    "version": "1.0.0.2+7",
    "date": "2026-08-04",
    "category": "frontend",
    "title": "Ustawienia: kategorie zwijane",
    "notes": [
      "Strona ustawień konta: układ w jednej kolumnie, sekcje Profil / E-mail / Hasło / Powiadomienia / Wygląd / Prywatność jako zwijane kategorie (`SettingsCategory`)."
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
