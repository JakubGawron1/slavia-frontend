# Changelog — Frontend

Notatki developerskie (Next.js). Wspólna wersja z `Slavia.toml` przy braku breaking API.

Format sekcji:

```
## [X.Y.Z] - YYYY-MM-DD
### Tytuł wpisu
- punkt
```

Opcjonalnie po dacie: `!breaking` (breaking API).

## [1.1.1.1+2] - 2026-08-11
### Refaktor: modulyzacja monolitów UI
- Soft limit ~400 linii; foldery domenowe: `components/plans/`, `calendar/`, `results/`, `klub/konta|devtools|calendar/`, `settings/account/`, `home/`.
- Rozbicie StaffPlansInner, StaffCalendar, CalendarMonthGrid, konta, weryfikacja wyników, DevTools, settings, shell, home, obecność.
- Przywrócone panele Debug z 1.1.1.0+1 (schowek, ping health, storage, env, Orval test e-mail) po refaktorze.
- Fix hydration: `Footer` jako Server Component (wersja z SSR); nawigacja flag → `FooterNav` client.

## [1.1.1.0+1] - 2026-08-11
### DevTools: więcej narzędzi w Debug
- Panele: schowek (dump/token/user id/API URL), ping health z latency, odśwież `/me`, invalidate/clear React Query, test toastów, twarde wylogowanie.
- Inspector `localStorage` (`slavia_*`) — usuwanie kluczy, reset „Co nowego” / cookies consent, clear poza sesją.
- Snapshot środowiska przeglądarki (UA, viewport, timezone, online).
- Test e-mail przez Orval `useSendTestEmail` (bez ręcznego `fetch`).

## [1.1.0.27+28] - 2026-08-11
### Feature: flagi planów treningowych
- Stable `training_plans` (ON) — gate nav + `/klub/plany` + `/panel/plany` + kafelek sezonu / ops.
- `experimental_club_assistant` → rollout **Stub** (opis: stub, Groq później).
- Placeholdery Planned (OFF, nie publiczne): `experimental_plan_pdf_export`, `…_qr_checkin`, `…_day_rpe`, `…_public_share`, `…_rest_timer`.

## [1.1.0.26+27] - 2026-08-11
### UX: obciążenie Kg XOR %1RM w edytorze planu
- Przełącznik Kg / % 1RM na ćwiczeniu i w seriach — pola wzajemnie się wykluczają.
- Zapis normalizuje dane (nie wysyła obu naraz).

## [1.1.0.25+26] - 2026-08-11
### UX: polish strony planów treningowych
- Kadra: taby jak w skrzynce, focus mode edytora (bez listy pod spodem), sekcje formularza, karty ćwiczeń z etykietami, sticky stopka Zapisz.
- Biblioteka / grupy / lista planów — spójne panele, pusty stan, akcje jak CMS.
- Panel zawodnika: eyebrow + chipy planów w tym samym stylu.

## [1.1.0.24+25] - 2026-08-11
### UI: checkboxy pod motywy
- Globalne style `input[type=checkbox]` w `globals.css` — brand / ink / paper (witryna + `data-panel-theme`).
- Checked, hover, focus-visible, indeterminate, disabled; radius z `--panel-radius-sm` gdy dostępny.

## [1.1.0.23+24] - 2026-08-11
### UX: `ConfirmModal` zamiast `window.confirm`
- Nowy `components/ui/ConfirmModal` (na bazie `Modal`).
- Podmienione potwierdzenia usuwania: plany / biblioteka / grupy, konta, CMS, wiadomości; baza danych też przez `ConfirmModal`.

## [1.1.0.22+23] - 2026-08-11
### Feature: % PR tego ćwiczenia (`PctOfLift::Exercise`)
- Nowy wariant `pct_of: exercise` — np. 80% PR deadlift; bez auto-kg z profilu (zawodnik dobiera sam).
- UI kadry + etykiety panel/mobile; hint przy % PR ruchu.

## [1.1.0.21+22] - 2026-08-11
### Feature: plan sezonu + odpowiedź trenera na feedback
- Pulpit zawodnika: kafelek aktywnego planu sezonu (`is_season_active`) z linkiem do `/panel/plany?plan=…`.
- Kadra: checkbox „Plan sezonu”, lista feedbacku + `PUT …/coach-reply`.
- Panel/mobile: wyświetlanie `coach_reply` / `coach_replied_at`.

## [1.1.0.20+21] - 2026-08-11
### Fix/Feature: plany — ćwiczenia zawodnika, serie, biblioteka, personalne
- Fix: zawodnik widzi ćwiczenia (fallback z pustych tygodni / legacy flat list).
- Rozpis serii (`set_scheme`) + %1RM per seria; filtr „tylko dziś”.
- Edycja/usuwanie pozycji biblioteki ćwiczeń.
- Tryb przypisania: wszyscy / jeden zawodnik / grupa.

## [1.1.0.19+20] - 2026-08-11
### Feature: plany treningowe premium
- Edytor tygodni/dni, katalog szablonów, biblioteka ćwiczeń, grupy zawodników.
- %1RM, warm-up, zamienniki (kontuzja), DnD, undo/redo, autosave, skróty, szkic AI (flaga).
- Panel zawodnika: tygodnie, notatki trenera, feedback, badge ukończenia, wybór zamiennika.
- Kalendarz kadry: powiązanie treningu z `plan_id` / tydzień / dzień.

## [1.1.0.18+19] - 2026-08-11
### Refactor: `fetchMe` → Orval `me()`; flagi `client_visible`
- Bootstrap sesji (`lib/auth.ts` `fetchMe`) woła Orval `me()` przez `customFetch` (`authToken` + `viewAsUserId`).
- DevTools: UI flag budowany z `GET /api/admin/flags`; opis flow w zakładce Flagi; oznaczenie client/server.

## [1.1.0.17+18] - 2026-08-11
### Refactor: pełna migracja FE na Orval
- Usunięto legacy `klubFetch` (`lib/klub-api.ts`); wszystkie call site’y używają klienta Orval + `customFetch`.
- Mutator Orval: opcjonalne `viewAsUserId` (`null` = bez `X-View-As-User` dla actora / preview stop).

## [1.1.0.5+5] - 2026-08-07

### Fix: agenda kadry — menu kontekstowe

- Klik w wydarzenie w agendzie kalendarza kadry otwiera menu (Edytuj / Szczegóły / Usuń), jak w siatce miesiąca.

## [1.1.0.5+4] - 2026-08-07

### UX: agenda — wszystkie dni, plus i szczegóły

- Agenda pokazuje każdy dzień miesiąca (także bez wydarzeń).
- Kalendarz kadry: „+” przy dacie dodaje wydarzenie; klik w wydarzenie w agendzie otwiera menu (jak w siatce).
- Publiczny `/kalendarz`: klik w wydarzenie (agenda/siatka) → modal ze szczegółami.

## [1.1.0.5+3] - 2026-08-07

### UX: czytelna lista obecności w panelu zawodnika

- `/panel/obecnosc`: zamiast surowego ISO — polska data, godzina zapisu i badge statusu (Obecny / Nieobecny).

## [1.1.0.5+2] - 2026-08-05

### UX: sortowanie i filtr zawodnika na weryfikacji

- `/klub/weryfikacja-wynikow`: listy do weryfikacji i pozostałe sortowane od najnowszej daty wydarzenia; filtr według zawodnika.

## [1.1.0.5+1] - 2026-08-05

### Fix: ponowna weryfikacja po poprawce zaakceptowanego

- Panel: „Popraw” także przy zaakceptowanym wyniku — po zapisie wraca do kolejki weryfikacji.

## [1.0.0.3+23] - 2026-08-05

### Feature: edycja wyników w UI

- `/klub/weryfikacja-wynikow`: modal edycji wyników oczekujących, do poprawy i zaakceptowanych.
- `/panel/wyniki`: „Popraw” dla wyników oczekujących / do edycji (z notatką trenera).

## [1.0.0.3+22] - 2026-08-05

### UX: auto kategoria w formularzu profilu

- `/klub/konta`: kategoria wyliczana z masy + płci + daty urodzenia (bez ręcznego pola).

## [1.0.0.3+21] - 2026-08-05

### Sync: kategoria po weryfikacji zawodów

- Po zaakceptowaniu wyniku z zawodów oficjalna kategoria/masa w profilu aktualizuje się automatycznie (widać na pulpicie i w kontach).

## [1.0.0.3+20] - 2026-08-05

### Feature: data zawodów / treningu w wynikach

- Formularze panelu i weryfikacji: wymagane pole daty (`event_date`).
- Kategoria wagowa bez zmian: z podanej masy + tabel 2026 i wieku/płci z profilu.

## [1.0.0.3+19] - 2026-08-05

### Feature: auto kategoria wagowa przy zawodach

- Panel `/panel/wyniki` i weryfikacja: zawodnik podaje tylko masę ciała; kategoria z wieku/płci profilu + tabeli 2026.
- Podgląd kategorii w formularzu (`U20 M 75` itd.).

## [1.0.0.3+18] - 2026-08-05

### Flagi: e-maile powiadomień vs transakcyjne

- Nowa flaga experimental `experimental_notification_emails` (domyślnie OFF) — przełączniki w ustawieniach i wysyłka maili o składzie / planach / kontakcie.
- Nowe flagi stable (domyślnie ON): `email_password_reset`, `email_verification`, `email_contact_confirmation`, `email_test`.

## [1.0.0.3+17] - 2026-08-05

### UX: kalendarz / agenda

- `CalendarMonthGrid`: desktop domyślnie siatka miesiąca, poniżej `lg` zawsze agenda; toggle „Agenda / Kalendarz” tylko na desktopie.
- Dotyczy publicznego `/kalendarz`, kadry `/klub/kalendarz` i panelu `/panel/kalendarz`.
- Hook `useIsDesktop` (`lib/use-media-query.ts`).

## [1.0.0.3+16] - 2026-08-05

### UX: rekord treningowy bez nazwy

- Panel `/panel/wyniki`: przy rodzaju „Rekord treningowy” brak pola nazwy — wysyłane jako „Trening”.

## [1.0.0.3+15] - 2026-08-05

### Fix: podgląd konta — dane targetu

- CORS: dozwolony nagłówek `X-View-As-User` (wcześniej przeglądarka go blokowała).
- Czyszczenie cache React Query przy zmianie `viewAs`.
- Panel (pulpit/plany/wyniki/obecność/kalendarz): przeładowanie przy zmianie podglądanego konta.

## [1.0.0.3+15] - 2026-08-05

### Fix: skrzynka powiadomień na mobile

- `NotificationBell`: panel przez portal `fixed` z clampem do viewportu (nie ucieka poza ekran / nie jest ucinany przez `overflow-hidden` w shellach).
- Nagłówki `KlubShell` / `PanelShell`: zawijanie i krótsze etykiety akcji na wąskich ekranach.

## [1.0.0.3+14] - 2026-08-04

### Podgląd kont / ról — pełny pakiet

- Automatyczny nagłówek `X-View-As-User` w `apiMutator` / `fetchMe` (sesja actora bez nagłówka).
- Nav i RoleSwitcher pokazują target; banner kończy podgląd przez `preview/stop`.
- `/klub/podglad`: wyszukiwanie, filtr roli, redirect do `/klub` lub `/panel`.
- Panel zawodnika: banner podglądu, dane targetu, powrót do `/klub/podglad`.

## [1.0.0.2+13] - 2026-08-04

### Baza danych: modal zamiast confirm

- `/klub/baza-danych`: potwierdzenie usunięcia rekordu w `Modal` zamiast natywnego `window.confirm`.

## [1.0.0.2+12] - 2026-08-04

### Fix: SettingsCategory i typy details

- `SettingsCategory`: stan `open` zamiast nieobsługiwanego w typach React `defaultOpen` na `<details>` (build TypeScript).

## [1.0.0.2+11] - 2026-08-04

### Kalendarz: tylko tytuł na paskach

- Siatka miesiąca: w ramkach wydarzeń widoczny wyłącznie tytuł (bez godziny); godzina nadal w tooltipie i panelu dnia.

## [1.0.0.2+10] - 2026-08-04

### Ustawienia: E-mail i hasło w jednej kategorii

- Sekcje e-mail i hasło połączone w zwijaną kategorię „E-mail i hasło”.

## [1.0.0.2+9] - 2026-08-04

### Ustawienia: dwa kolumny

- Zwijane kategorie ustawień w układzie `lg:grid-cols-2` (konto | wygląd/prywatność).

## [1.0.0.2+8] - 2026-08-04

### Klub / Konta: formularze w modalach

- `/klub/konta`: na stronie tylko tabele; tworzenie i edycja kont oraz profili w `Modal`.

## [1.0.0.2+7] - 2026-08-04

### Ustawienia: kategorie zwijane

- Strona ustawień konta: układ w jednej kolumnie, sekcje Profil / E-mail / Hasło / Powiadomienia / Wygląd / Prywatność jako zwijane kategorie (`SettingsCategory`).

## [1.0.0.2+6] - 2026-08-04

### Dzwonek: usuwanie powiadomień

- W skrzynce powiadomień (dzwonek) każdy wpis ma przycisk usuwania; klient OpenAPI: `DELETE /api/notifications/{id}`.

## [1.0.0.2+5] - 2026-08-04

### DevTools: test e-mail przez Brevo

- Zakładka Debug: copy i podpowiedzi pod Brevo (zamiast Resend).

## [1.0.0.2+4] - 2026-08-04

### DevTools: test e-mail

- Zakładka Debug: formularz wysyłki testowego maila na podany adres (superadmin).

## [1.0.0.2+3] - 2026-08-03

### Sync „Co nowego” → Flutter

- `scripts/sync-changelog.mjs` generuje `slavia-mobile/lib/generated/user_changelog.g.dart` z `CHANGELOG.user.md`.

### E-mail: weryfikacja, reset hasła, preferencje

- Bramka weryfikacji e-mail po logowaniu (panel + klub); strony `/weryfikacja-emaila`, `/zapomniane-haslo`, `/reset-hasla`.
- Link „Nie pamiętam hasła” na logowaniu.
- Ustawienia: zmiana e-maila + przełączniki powiadomień (skład, plany, kontakt dla kadry).
- Klient OpenAPI / Orval: nowe endpointy auth e-mail.

## [1.0.0.1+1] - 2026-08-03

### Zawody wielodniowe w kalendarzu

- Formularz tworzenia/edycji zawodów: pole **Data zakończenia** (domyślnie = dzień rozpoczęcia).
- Siatka kalendarza: pasek wydarzenia przez wiele dni (`end_date`).
- Odwołanie / usuwanie / przywracanie przez modale UI (bez `alert` / `confirm` / `prompt`).

### Fix: kalendarz zawodnika

- `GET /api/events/mine` nie robi już N× odczytów DB na każde wydarzenie (profile + attendance raz).
- Reconcile auto-nieobecności ograniczone do ostatnich 21 dni i zbatchowane.
- Zakres dat w żądaniu FE + wskaźnik ładowania.

## [1.0.0] - 2026-08-03

### DevTools: Changelog + wersja platformy

- Nowa zakładka Changelog w `/klub/devtools` (podział Frontend / Backend / Mobile).
- Wersja platformy z `Slavia.toml` (`lib/version.ts`) widoczna w stopce strony publicznej.
- Skrypt `scripts/sync-version.mjs` synchronizuje version w package.json / Cargo.toml / pubspec.yaml.
- Wpisy changelogu pochodzą z `CHANGELOG.md` każdego projektu (`sync-changelog`).

## [1.0.0] - 2026-08-01

### Panel klubowy i obecność w kalendarzu

- Kolorystyczna notacja obecności w kalendarzu zawodnika i kadry.
- StaffCalendar: frekwencja, lista obecności w modalu, link do `/klub/obecnosc`.
- DevTools: flagi (stable/experimental), statystyki, mapa tras, debug sesji.
