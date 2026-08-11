/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { ChangelogEntry } from "@/lib/changelog";

export const GENERATED_CHANGELOG: ChangelogEntry[] = [
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
      "Przywrócone panele Debug z 1.1.1.0+1 (schowek, ping health, storage, env, Orval test e-mail) po refaktorze."
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
