# Changelog — Frontend

Notatki developerskie (Next.js). Wspólna wersja z `Slavia.toml` przy braku breaking API.

Format sekcji:

```
## [X.Y.Z] - YYYY-MM-DD
### Tytuł wpisu
- punkt
```

Opcjonalnie po dacie: `!breaking` (breaking API).

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
