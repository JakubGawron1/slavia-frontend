# Changelog — Frontend

Notatki developerskie (Next.js). Wspólna wersja z `Slavia.toml` przy braku breaking API.

Format sekcji:

```
## [X.Y.Z] - YYYY-MM-DD
### Tytuł wpisu
- punkt
```

Opcjonalnie po dacie: `!breaking` (breaking API).

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
