/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { ChangelogEntry } from "@/lib/changelog";

export const GENERATED_CHANGELOG: ChangelogEntry[] = [
  {
    "version": "1.1.2.5+6",
    "date": "2026-08-12",
    "category": "backend",
    "title": "DX: CI, bacon, sync OpenAPI",
    "notes": [
      "Workflow CI (fmt + clippy + test) na PR/`main`.",
      "`bacon.toml` (check / clippy / test / export-openapi); README + deploy: `pnpm sync:api` z roota."
    ]
  },
  {
    "version": "1.1.2.7+8",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "DX: root `package.json` z wersją platformy",
    "notes": [
      "`sync-version` ustawia też `package.json` w rootcie workspace (jak FE)."
    ]
  },
  {
    "version": "1.1.2.7+8",
    "date": "2026-08-12",
    "category": "backend",
    "title": "DX: root `package.json` z wersją platformy",
    "notes": [
      "`scripts/sync-version.mjs` synchronizuje też wersję meta-workspace w root `package.json`."
    ]
  },
  {
    "version": "1.1.2.6+7",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "DX: tooling FE (kontynuacja) + sync wersji",
    "notes": [
      "Lefthook w repo FE (Biome + ESLint na staged); `prepare` instaluje hooki.",
      "Meta-workspace: root `pnpm`/`just`/`lefthook`, CI, Zod, RQ Devtools — wpis bazowy w `1.1.2.5+6`."
    ]
  },
  {
    "version": "1.1.2.5+6",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "DX: tooling, walidacja Zod, React Query Devtools",
    "notes": [
      "Skrypty: `typecheck`, `format` (Biome), `knip`, `sync:api`; CI PR (`lint` + `tsc` + `build`).",
      "Zod: walidacja kont, profili, wydarzeń i wyników (kadra + panel).",
      "DevTools: zakładka React Query; README pod prawdziwy workflow Orval/pnpm."
    ]
  },
  {
    "version": "1.1.2.3+4",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: admin — wyślij reset hasła użytkownikowi",
    "notes": [
      "`POST /api/users/{id}/send-password-reset` (Admin+): token Reset + mail; czytelne błędy (ban, `.dev`/`.local`, flaga, wysyłka).",
      "Wspólny helper `create_and_send_password_reset` dla forgot-password i admin."
    ]
  },
  {
    "version": "1.1.2.2+3",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: AI — własne ćwiczenia poza biblioteką",
    "notes": [
      "Prompt: biblioteka zawsze jako podpowiedź; własne nazwy PL dozwolone gdy brak odpowiednika.",
      "`resolve_name` tylko exact match (bez partial overwrite)."
    ]
  },
  {
    "version": "1.1.2.0+1",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: DevTools — ustawienia AI (Groq)",
    "notes": [
      "Meta `ai_settings`: model, styl odpowiedzi, temperature, max_tokens, default_weeks, biblioteka, warmup, custom instructions.",
      "`GET/PUT /api/admin/ai-settings`, `GET /api/admin/ai-models` (lista z Groq).",
      "Szkic planu czyta ustawienia z meta (fallback `GROQ_MODEL`)."
    ]
  },
  {
    "version": "1.1.2.0+1",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: DevTools → zakładka AI",
    "notes": [
      "Ustawienia modelu Groq (lista z API), styl odpowiedzi, temperature / tokens / tygodnie, warmup, biblioteka, instrukcje extra."
    ]
  },
  {
    "version": "1.1.2.4+5",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: herb CKS Slavia jako logo",
    "notes": [
      "`ClubMark` używa oficjalnego herbu (`/brand/cks-slavia-herb.png`) zamiast placeholder SVG.",
      "Favicon z herbu (`app/icon.png`); herb też w nawigacji klubu."
    ]
  },
  {
    "version": "1.1.2.1+2",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: limity AI wg Groq Free Plan",
    "notes": [
      "Katalog RPM/RPD/TPM/TPD dla znanych modeli; clamp `max_tokens` do TPM.",
      "`daily_drafts_limit` (domyślnie 100 dla 8b) + zużycie UTC w meta; egzekwowane przy `ai-draft`.",
      "DevTools AI: podgląd free planu i limitu dziennego."
    ]
  },
  {
    "version": "1.1.2.1+2",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: limity Free Plan w DevTools AI",
    "notes": [
      "Podgląd RPM/RPD/TPM/TPD, dzienny limit szkiców + zużycie; bezpieczny `max_tokens` pod TPM."
    ]
  },
  {
    "version": "1.1.1.16+17",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: obciążenie „sama sztanga”",
    "notes": [
      "Pole `load_text` na `PlanExercise` / `PlanSet` / `PlanExerciseAlt` (XOR z kg/%).",
      "Edytor: chip „Sztanga” obok Kg / %; przepis i postęp pokazują „sama sztanga”."
    ]
  },
  {
    "version": "1.1.1.16+17",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: obciążenie „sama sztanga”",
    "notes": [
      "`load_text` na ćwiczeniu / serii / zamienniku (opcjonalne, XOR z `load_kg` / `%`).",
      "OpenAPI zaktualizowane."
    ]
  },
  {
    "version": "1.1.1.18+19",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: obciążenie „zawodnik sam ustala ciężar”",
    "notes": [
      "Preset `load_text` obok „sama sztanga”; chip „Sam ustala” w edytorze (wspólny + serie).",
      "Wspólny komponent `LoadModeChips`."
    ]
  },
  {
    "version": "1.1.1.16+17",
    "date": "2026-08-12",
    "category": "mobile",
    "title": "Feature: obciążenie `load_text` (sama sztanga)",
    "notes": [
      "`PlanExercise` / `PlanExerciseAlt`: pole `loadText`; subtitle planu pokazuje tekst zamiast kg/%."
    ]
  },
  {
    "version": "1.1.2.3+4",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: reset hasła z listy kont + podgląd hasła dev",
    "notes": [
      "Przycisk „Reset hasła” na liście kont (Admin/Superadmin) → `POST /api/users/{id}/send-password-reset`.",
      "Po utworzeniu konta `.dev` / `.local` modal z hasłem do skopiowania (+ przełącznik Pokaż w formularzu)."
    ]
  },
  {
    "version": "1.1.1.15+16",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: seria rozgrzewkowa w planie",
    "notes": [
      "W edytorze serii indywidualnych: checkbox „Rozgrzewka” (`PlanSet.is_warmup`).",
      "`formatPrescription` i widok postępu oznaczają serie warm-up jako `W` / `Wn`."
    ]
  },
  {
    "version": "1.1.1.19+20",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: szkic AI planu (Groq)",
    "notes": [
      "Panel planów: liczba tygodni + stan „Generuję…”; backend generuje realny szkic (nie stub)."
    ]
  },
  {
    "version": "1.1.1.19+20",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Feature: szkic planu przez Groq",
    "notes": [
      "`POST /api/plans/ai-draft` woła Groq (JSON) z biblioteką ćwiczeń; wymaga `GROQ_API_KEY`.",
      "Flaga `experimental_club_assistant` → Wired (nadal default OFF).",
      "Serwisy `services/groq.rs` + `services/plans_ai.rs`."
    ]
  },
  {
    "version": "1.1.2.2+3",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Feature: własne ćwiczenia AI → biblioteka",
    "notes": [
      "AI może używać nazw spoza biblioteki; w edytorze planu przycisk „Dodaj do biblioteki” dla ćwiczeń spoza listy."
    ]
  },
  {
    "version": "1.1.2.10+11",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Fix: „Ruda Śląska” obok herbu w headerze",
    "notes": [
      "Przywrócony podpis miasta pod „CKS Slavia” w nawigacji publicznej."
    ]
  },
  {
    "version": "1.1.2.9+10",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Fix: proporcje herbu",
    "notes": [
      "Herb z oryginalnego pliku (szersze proporcje); `ClubMark` z `width: auto`, by Next/Image nie ściskał znaku."
    ]
  },
  {
    "version": "1.1.2.6+7",
    "date": "2026-08-12",
    "category": "backend",
    "title": "Improve: czytelniejsze logi backendu + AI przy starcie",
    "notes": [
      "Compact tracing + sekcje startowe (platforma, baza, integracje, AI/Groq, gotowe).",
      "Startup: klucz Groq, aktywny model, styl, limity, flaga `experimental_club_assistant`, zużycie dzienne.",
      "Więcej logów: HTTP `→`/`←`, Groq chat/modele (latency), `ai-draft`, zapis ustawień AI; audyt DevTools (`source=ai`).",
      "DX: `lefthook.yml` (cargo fmt na staged); CI clippy bez `-D warnings` (doczyszczenie osobno)."
    ]
  },
  {
    "version": "1.1.2.8+9",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "Polish: herb pod UI witryny",
    "notes": [
      "Czystszy herb z przezroczystym tłem (elementy herbu bez zmian) + lekki drop-shadow.",
      "Większy znak w headerze/logowaniu; mniej zdublowanego tekstu obok herbu."
    ]
  },
  {
    "version": "1.1.1.17+18",
    "date": "2026-08-12",
    "category": "frontend",
    "title": "UX: dodawanie ćwiczeń pod listą",
    "notes": [
      "W edytorze dnia: „Szybko z biblioteki” i „+ Ćwiczenie” zawsze pod ostatnim ćwiczeniem."
    ]
  },
  {
    "version": "1.1.1.14+15",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Chore: Next.js 16.3 + TypeScript 7",
    "notes": [
      "`next` / `eslint-config-next` → 16.3.0 (natywne type-check przez `tsc` CLI).",
      "`typescript` ^7 — naprawia błąd builda „does not provide the compiler API”."
    ]
  },
  {
    "version": "1.1.1.0+1",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "DevTools: więcej narzędzi w Debug",
    "notes": [
      "Panele: schowek (dump/token/user id/API URL), ping health z latency, odśwież `/me`, invalidate/clear React Query, test toastów, twarde wylogowanie.",
      "Inspector `localStorage` (`slavia_*`) — usuwanie kluczy, reset „Co nowego” / cookies consent, clear poza sesją.",
      "Snapshot środowiska przeglądarki (UA, viewport, timezone, online).",
      "Test e-mail przez Orval `useSendTestEmail` (bez ręcznego `fetch`)."
    ]
  },
  {
    "version": "1.1.0.22+23",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: % PR tego ćwiczenia (`PctOfLift::Exercise`)",
    "notes": [
      "Nowy wariant `pct_of: exercise` — np. 80% PR deadlift; bez auto-kg z profilu (zawodnik dobiera sam).",
      "UI kadry + etykiety panel/mobile; hint przy % PR ruchu."
    ]
  },
  {
    "version": "1.1.0.18+19",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: `client_visible` w katalogu flag",
    "notes": [
      "`FeatureFlag.client_visible` — źródło prawdy w katalogu BE (`sync_flag_catalog`).",
      "`GET /api/flags/public` filtruje po `client_visible` (bez hardkodowanej listy kluczy).",
      "DevTools nadal listuje wszystkie flagi (stable + experimental) i przełącza przez `PATCH /api/admin/flags/{key}`."
    ]
  },
  {
    "version": "1.1.0.22+23",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: `PctOfLift::Exercise`",
    "notes": [
      "`%` względem PR tego ćwiczenia w planie (bez stats z profilu)."
    ]
  },
  {
    "version": "1.1.1.4+5",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: `PlanExercise.individual_load`",
    "notes": [
      "Flaga `individual_load` (default `false`): obciążenie per seria vs wspólne z pól ćwiczenia.",
      "Kompatybilne wstecz — brak pola w starym JSON = wspólny ciężar; OpenAPI + klient FE zaktualizowane."
    ]
  },
  {
    "version": "1.1.0.20+21",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: `PlanSet` / soft-merge ćwiczeń w tygodnie",
    "notes": [
      "`PlanExercise.set_scheme` — rozpis serii z %1RM/kg.",
      "`normalize()`: jeśli tygodnie są puste, a jest legacy `exercises` — scalenie do dnia 1."
    ]
  },
  {
    "version": "1.1.0.22+23",
    "date": "2026-08-11",
    "category": "mobile",
    "title": "Feature: etykieta % PR ćwiczenia",
    "notes": [
      "Wyświetlanie `pct_of: exercise` jako „PR {nazwa}” + hint doboru kg."
    ]
  },
  {
    "version": "1.1.0.27+28",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: flagi planów treningowych",
    "notes": [
      "Stable `training_plans` (ON) — gate nav + `/klub/plany` + `/panel/plany` + kafelek sezonu / ops.",
      "`experimental_club_assistant` → rollout **Stub** (opis: stub, Groq później).",
      "Placeholdery Planned (OFF, nie publiczne): `experimental_plan_pdf_export`, `…_qr_checkin`, `…_day_rpe`, `…_public_share`, `…_rest_timer`."
    ]
  },
  {
    "version": "1.1.0.27+28",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: katalog flag — plany treningowe",
    "notes": [
      "`training_plans` (stable/wired/ON); `experimental_club_assistant` → Stub; placeholdery Planned: PDF, QR check-in, RPE dnia, share-link, rest timer."
    ]
  },
  {
    "version": "1.1.1.9+10",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: katalog tagów biblioteki ćwiczeń",
    "notes": [
      "Meta `exercise_library_tags` + seed z defaultów / istniejących tagów.",
      "`GET /api/exercise-library/tags`, `PUT /api/exercise-library/tags` (Trener).",
      "Model `ExerciseTagsBody`; OpenAPI zaktualizowane."
    ]
  },
  {
    "version": "1.1.1.9+10",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: klubowa lista tagów ćwiczeń",
    "notes": [
      "Zakładka Biblioteka: zarządzanie tagami (dodaj / usuń) zamiast wpisywania po przecinku.",
      "Przy edycji ćwiczenia: chipy z katalogu (toggle).",
      "API: `GET/PUT /api/exercise-library/tags` + `ExerciseTagsManager.tsx`."
    ]
  },
  {
    "version": "1.1.1.5+6",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: kopiowanie ćwiczeń tydzień → tydzień",
    "notes": [
      "W edytorze planu: „Kopiuj → T{n+1}” oraz „Wklej z T{n-1}”.",
      "Dopasowanie po `day_of_week` (Pon→Pon…); brakujące dni w celu są tworzone.",
      "Nowe UUID ćwiczeń/zamienników; nadpisanie docelowych dni (Ctrl+Z cofa).",
      "Helper: `lib/plans/copyWeek.ts`."
    ]
  },
  {
    "version": "1.1.1.13+14",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: kopiuj tydzień do wszystkich tygodni",
    "notes": [
      "W edytorze planu: „Kopiuj do wszystkich tygodni” (Pon→Pon…, nowe UUID, jedno Ctrl+Z)."
    ]
  },
  {
    "version": "1.1.0.21+22",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: plan sezonu + coach reply",
    "notes": [
      "`is_season_active` (jeden aktywny): czyszczenie przy create/update.",
      "`TrainingPlanProgress.coach_reply` / `coach_replied_at`; `PUT /api/plans/{id}/coach-reply` (notyfikacja); athlete save nie nadpisuje reply."
    ]
  },
  {
    "version": "1.1.0.21+22",
    "date": "2026-08-11",
    "category": "mobile",
    "title": "Feature: plan sezonu + odpowiedź trenera",
    "notes": [
      "Pulpit: kafelek planu sezonu; plany: domyślny wybór sezonu + wyświetlanie `coach_reply`."
    ]
  },
  {
    "version": "1.1.0.21+22",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: plan sezonu + odpowiedź trenera na feedback",
    "notes": [
      "Pulpit zawodnika: kafelek aktywnego planu sezonu (`is_season_active`) z linkiem do `/panel/plany?plan=…`.",
      "Kadra: checkbox „Plan sezonu”, lista feedbacku + `PUT …/coach-reply`.",
      "Panel/mobile: wyświetlanie `coach_reply` / `coach_replied_at`."
    ]
  },
  {
    "version": "1.1.0.19+20",
    "date": "2026-08-11",
    "category": "mobile",
    "title": "Feature: plany premium (odczyt/postęp)",
    "notes": [
      "Model tygodni/dni, zamienniki, warm-up, notatki trenera, feedback, badge ukończenia."
    ]
  },
  {
    "version": "1.1.0.19+20",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: plany treningowe premium",
    "notes": [
      "Edytor tygodni/dni, katalog szablonów, biblioteka ćwiczeń, grupy zawodników.",
      "%1RM, warm-up, zamienniki (kontuzja), DnD, undo/redo, autosave, skróty, szkic AI (flaga).",
      "Panel zawodnika: tygodnie, notatki trenera, feedback, badge ukończenia, wybór zamiennika.",
      "Kalendarz kadry: powiązanie treningu z `plan_id` / tydzień / dzień."
    ]
  },
  {
    "version": "1.1.0.19+20",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: plany treningowe premium (API)",
    "notes": [
      "Model: `weeks`/`days`, `%1RM`, warm-up, alternatives, wersje, szablony, archiwum, publish.",
      "CRUD `/api/groups`, `/api/exercise-library`; `copy` / `new-version` / `ai-draft` / `progress/all`.",
      "`CalendarEvent.plan_id` (+ week/day); flaga `experimental_club_assistant`; soft-migracja legacy."
    ]
  },
  {
    "version": "1.1.1.8+9",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: publiczny terminarz treningów",
    "notes": [
      "`GET /api/public/training-schedule` — bez auth, zwraca `TrainingScheduleDefaults` (dni/godziny) do strony głównej."
    ]
  },
  {
    "version": "1.1.1.10+11",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: strzałka wstecz na desktopie (web)",
    "notes": [
      "Komponent `BackLink`: `history.back()` albo fallback na pulpit / listę.",
      "Panel: Sinclair, Co nowego, ustawienia.",
      "Klub: Sinclair, Co nowego, ustawienia, DevTools, baza, logi, podgląd.",
      "Edytor planu: „Lista planów”; polityka prywatności → strona główna."
    ]
  },
  {
    "version": "1.1.1.7+8",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: tworzenie konta bez hasła (invite mail)",
    "notes": [
      "Formularz konta / profilu: hasło wymagane tylko dla `.dev` / `.local`.",
      "Zwykły e-mail → toast o wysłanym linku; strona `/ustaw-haslo` (complete-invite).",
      "Helper `lib/email.ts` (`isDevEmail`); mutator: publiczny `complete-invite`."
    ]
  },
  {
    "version": "1.1.1.4+5",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: wspólny vs indywidualny ciężar serii",
    "notes": [
      "Przełącznik w edytorze ćwiczenia: wspólny ciężar (sets×reps@load) albo obciążenie per seria.",
      "Usunięto osobny przycisk „Rozpisz serie” — tryb indywidualny buduje `set_scheme`.",
      "Helpers: `isIndividualLoad` / `toIndividualLoad` / `toUniformLoad`; `normalizeExerciseLoad` respektuje flagę.",
      "Legacy: niepuste `set_scheme` bez flagi nadal traktowane jako indywidualne."
    ]
  },
  {
    "version": "1.1.1.7+8",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Feature: zaproszenie po create (verify + set password)",
    "notes": [
      "`CreateUserBody.password` opcjonalne; wymagane tylko dla e-maili `.dev` / `.local`.",
      "Po utworzeniu zwykłego konta: token `Invite` (48h) + mail z linkiem `/ustaw-haslo`.",
      "`POST /api/auth/complete-invite` — ustawia hasło i oznacza `email_verified`.",
      "Przy błędzie wysyłki maila konto jest rollbackowane (`delete_user`)."
    ]
  },
  {
    "version": "1.1.1.8+9",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: żywy pasek statystyk na stronie głównej",
    "notes": [
      "SSR pobiera publiczne profile, wyniki i terminarz treningów; metryki (kadra, Sinclair, PB, dni treningowe) z API zamiast hardcodu.",
      "Helper `lib/home-stats.ts`; fallback do dotychczasowych wartości przy błędzie API.",
      "Revalidate 60 s."
    ]
  },
  {
    "version": "1.1.1.11+12",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Feature: żywy Top 3 Sinclair na stronie głównej",
    "notes": [
      "Ranking z publicznych profili/wyników (`topSinclairPodium`); wspólny fetch z paskiem statystyk.",
      "Pusty stan gdy brak zaakceptowanych startów; fallback hardcodu przy błędzie API."
    ]
  },
  {
    "version": "1.1.1.6+7",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Fix (mobile): strzałka wstecz na podstronach",
    "notes": [
      "Zawsze widoczny `BackButton` na DetailScaffold / powiadomieniach; fallback na pulpit gdy brak stacku.",
      "Pulpit: podstrony narzędziowe przez `push` zamiast `go`.",
      "Gest / Back myszy / Alt+← z podstrony bez stacku też wraca na pulpit."
    ]
  },
  {
    "version": "1.1.1.12+13",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Fix: `GET /api/plans?mine=true` respektuje przypisania",
    "notes": [
      "Query `mine=true` zawsze filtruje przez `plans_for_user(effective_id)` — także dla Trener/Superadmin.",
      "Panel kadry bez `mine` nadal zwraca pełną listę.",
      "`PUT …/progress`: usunięty bypass edytora — postęp tylko na planach dostępnych dla effective_id."
    ]
  },
  {
    "version": "1.1.1.12+13",
    "date": "2026-08-11",
    "category": "mobile",
    "title": "Fix: lista planów z `mine=true`",
    "notes": [
      "`AthleteRepository.plans()` woła `/api/plans?mine=true` — konta kadry nie dostają cudzych planów w widoku zawodnika."
    ]
  },
  {
    "version": "1.1.1.12+13",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Fix: panel zawodnika tylko z własnymi planami",
    "notes": [
      "`listPlans({ mine: true })` w `useAthletePlanProgress` i na pulpicie panelu.",
      "Superadmin/Trener nie widzi cudzych przypisań w swoim panelu zawodnika."
    ]
  },
  {
    "version": "1.1.1.6+7",
    "date": "2026-08-11",
    "category": "mobile",
    "title": "Fix: strzałka wstecz na podstronach",
    "notes": [
      "`DetailScaffold` / powiadomienia: zawsze `BackButton`; bez stacku → powrót na pulpit.",
      "Pulpit: Sinclair / analiza toru / Co nowego / Ustawienia przez `push` (stack + gest wstecz).",
      "Gest / Back myszy / Alt+←: z podstrony bez stacku też wraca na pulpit."
    ]
  },
  {
    "version": "1.1.1.2+3",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Fix: tryb % nie przełącza się na kg przy backspace",
    "notes": [
      "`loadModeOf` uznaje `pct_of` jako tryb % także gdy `load_pct` jest puste.",
      "Edycja % w ćwiczeniu / seriach zachowuje `pct_of`, więc backspace nie flipuje przełącznika na Kg."
    ]
  },
  {
    "version": "1.1.1.3+4",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Fix: widoczne etykiety pól w formularzach",
    "notes": [
      "Inputy/selecty/textarea z samym placeholderem dostały wrapping `<label>` + podpis (wyniki, konta, plany, CMS, logi, obecność, baza).",
      "Placeholdery zostają tylko jako podpowiedź formatu (np. slug, URL), nie zamiast nazwy pola."
    ]
  },
  {
    "version": "1.1.0.20+21",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Fix/Feature: plany — ćwiczenia zawodnika, serie, biblioteka, personalne",
    "notes": [
      "Fix: zawodnik widzi ćwiczenia (fallback z pustych tygodni / legacy flat list).",
      "Rozpis serii (`set_scheme`) + %1RM per seria; filtr „tylko dziś”.",
      "Edycja/usuwanie pozycji biblioteki ćwiczeń.",
      "Tryb przypisania: wszyscy / jeden zawodnik / grupa."
    ]
  },
  {
    "version": "1.1.0.16+17",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Perf: szybsza kompilacja (local + HF)",
    "notes": [
      "Tokio: zamiast `full` tylko `rt-multi-thread`, `macros`, `net`, `sync`.",
      "Profil `dev`: `debug = \"line-tables-only\"`, `opt-level = 1` dla zależności.",
      "`.cargo/config.toml`: incremental + `/DEBUG:FASTLINK` (Windows MSVC).",
      "Dockerfile (HF): mold + BuildKit cache mounts (`registry` / `git` / `target`)."
    ]
  },
  {
    "version": "1.1.0.18+19",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Refactor: `fetchMe` → Orval `me()`; flagi `client_visible`",
    "notes": [
      "Bootstrap sesji (`lib/auth.ts` `fetchMe`) woła Orval `me()` przez `customFetch` (`authToken` + `viewAsUserId`).",
      "DevTools: UI flag budowany z `GET /api/admin/flags`; opis flow w zakładce Flagi; oznaczenie client/server."
    ]
  },
  {
    "version": "1.1.0.17+18",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Refactor: pełna migracja FE na Orval",
    "notes": [
      "Usunięto legacy `klubFetch` (`lib/klub-api.ts`); wszystkie call site’y używają klienta Orval + `customFetch`.",
      "Mutator Orval: opcjonalne `viewAsUserId` (`null` = bez `X-View-As-User` dla actora / preview stop)."
    ]
  },
  {
    "version": "1.1.1.1+2",
    "date": "2026-08-11",
    "category": "backend",
    "title": "Refaktor: modulyzacja `db` / handlers / models",
    "notes": [
      "`db.rs` → `src/db/*` (domeny + helpers); `models/club.rs` → modele domenowe + facade `club`.",
      "Handlery: `events/`, `plans/`, `results/`; auth `handlers/{session,email_verify,password_reset}`.",
      "Cienka warstwa `services/{plans,results}` dla grubej logiki; bez zmiany kontraktu HTTP."
    ]
  },
  {
    "version": "1.1.1.1+2",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "Refaktor: modulyzacja monolitów UI",
    "notes": [
      "Soft limit ~400 linii; foldery domenowe: `components/plans/`, `calendar/`, `results/`, `klub/konta|devtools|calendar/`, `settings/account/`, `home/`.",
      "Rozbicie StaffPlansInner, StaffCalendar, CalendarMonthGrid, konta, weryfikacja wyników, DevTools, settings, shell, home, obecność.",
      "Przywrócone panele Debug z 1.1.1.0+1 (schowek, ping health, storage, env, Orval test e-mail) po refaktorze.",
      "Fix hydration: `Footer` jako Server Component (wersja z SSR); nawigacja flag → `FooterNav` client."
    ]
  },
  {
    "version": "1.1.0.24+25",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "UI: checkboxy pod motywy",
    "notes": [
      "Globalne style `input[type=checkbox]` w `globals.css` — brand / ink / paper (witryna + `data-panel-theme`).",
      "Checked, hover, focus-visible, indeterminate, disabled; radius z `--panel-radius-sm` gdy dostępny."
    ]
  },
  {
    "version": "1.1.0.23+24",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "UX: `ConfirmModal` zamiast `window.confirm`",
    "notes": [
      "Nowy `components/ui/ConfirmModal` (na bazie `Modal`).",
      "Podmienione potwierdzenia usuwania: plany / biblioteka / grupy, konta, CMS, wiadomości; baza danych też przez `ConfirmModal`."
    ]
  },
  {
    "version": "1.1.0.26+27",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "UX: obciążenie Kg XOR %1RM w edytorze planu",
    "notes": [
      "Przełącznik Kg / % 1RM na ćwiczeniu i w seriach — pola wzajemnie się wykluczają.",
      "Zapis normalizuje dane (nie wysyła obu naraz)."
    ]
  },
  {
    "version": "1.1.0.25+26",
    "date": "2026-08-11",
    "category": "frontend",
    "title": "UX: polish strony planów treningowych",
    "notes": [
      "Kadra: taby jak w skrzynce, focus mode edytora (bez listy pod spodem), sekcje formularza, karty ćwiczeń z etykietami, sticky stopka Zapisz.",
      "Biblioteka / grupy / lista planów — spójne panele, pusty stan, akcje jak CMS.",
      "Panel zawodnika: eyebrow + chipy planów w tym samym stylu."
    ]
  },
  {
    "version": "1.1.0.6+6",
    "date": "2026-08-07",
    "category": "mobile",
    "title": "Feature: stub analizy toru sztangi",
    "notes": [
      "Ekran `/panel/analiza-toru` + wpis w Więcej / pulpicie — kieruje do pełnego narzędzia web (tracking lokalny w przeglądarce)."
    ]
  },
  {
    "version": "1.1.0.5+5",
    "date": "2026-08-07",
    "category": "frontend",
    "title": "Fix: agenda kadry — menu kontekstowe",
    "notes": [
      "Klik w wydarzenie w agendzie kalendarza kadry otwiera menu (Edytuj / Szczegóły / Usuń), jak w siatce miesiąca."
    ]
  },
  {
    "version": "1.1.0.5+4",
    "date": "2026-08-07",
    "category": "frontend",
    "title": "UX: agenda — wszystkie dni, plus i szczegóły",
    "notes": [
      "Agenda pokazuje każdy dzień miesiąca (także bez wydarzeń).",
      "Kalendarz kadry: „+” przy dacie dodaje wydarzenie; klik w wydarzenie w agendzie otwiera menu (jak w siatce).",
      "Publiczny `/kalendarz`: klik w wydarzenie (agenda/siatka) → modal ze szczegółami."
    ]
  },
  {
    "version": "1.1.0.5+3",
    "date": "2026-08-07",
    "category": "frontend",
    "title": "UX: czytelna lista obecności w panelu zawodnika",
    "notes": [
      "`/panel/obecnosc`: zamiast surowego ISO — polska data, godzina zapisu i badge statusu (Obecny / Nieobecny)."
    ]
  },
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
    "version": "1.0.0.3+22",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Feature: auto kategoria przy zapisie profilu",
    "notes": [
      "`POST/PATCH /api/profiles`: gdy są masa, data urodzenia i płeć — `category` wyliczana z tabel 2026 (nadpisuje ręczną wartość)."
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
    "version": "1.0.0.3+23",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Feature: edycja wyników (kadra + zawodnik)",
    "notes": [
      "`PATCH /api/results/{id}`: opcjonalne pola wyniku (nazwa, data, ciężary, masa, miejsce) + opcjonalny status.",
      "Kadra: edycja `pending` / `needs_edit` / `accepted` (poprawki); po zapisie zaakceptowanego — sync kategorii w profilu.",
      "Zawodnik: edycja własnych `pending` / `needs_edit` → wraca do `pending`."
    ]
  },
  {
    "version": "1.0.0.3+23",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Feature: edycja wyników w UI",
    "notes": [
      "`/klub/weryfikacja-wynikow`: modal edycji wyników oczekujących, do poprawy i zaakceptowanych.",
      "`/panel/wyniki`: „Popraw” dla wyników oczekujących / do edycji (z notatką trenera)."
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
    "version": "1.1.0.5+1",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "Fix: ponowna weryfikacja po poprawce zaakceptowanego",
    "notes": [
      "Panel: „Popraw” także przy zaakceptowanym wyniku — po zapisie wraca do kolejki weryfikacji."
    ]
  },
  {
    "version": "1.1.0.5+1",
    "date": "2026-08-05",
    "category": "backend",
    "title": "Fix: poprawka zaakceptowanego wyniku przez zawodnika",
    "notes": [
      "Zawodnik może edytować też wynik `accepted`; po zapisie status → `pending` + powiadomienie kadry."
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
    "version": "1.0.0.3+22",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "UX: auto kategoria w formularzu profilu",
    "notes": [
      "`/klub/konta`: kategoria wyliczana z masy + płci + daty urodzenia (bez ręcznego pola)."
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
    "version": "1.1.0.5+2",
    "date": "2026-08-05",
    "category": "frontend",
    "title": "UX: sortowanie i filtr zawodnika na weryfikacji",
    "notes": [
      "`/klub/weryfikacja-wynikow`: listy do weryfikacji i pozostałe sortowane od najnowszej daty wydarzenia; filtr według zawodnika."
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
