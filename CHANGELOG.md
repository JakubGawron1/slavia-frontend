# Changelog — Frontend

Notatki developerskie (Next.js). Wspólna wersja z `Slavia.toml` przy braku breaking API.

Format sekcji:

```
## [X.Y.Z] - YYYY-MM-DD
### Tytuł wpisu
- punkt
```

Opcjonalnie po dacie: `!breaking` (breaking API).

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
