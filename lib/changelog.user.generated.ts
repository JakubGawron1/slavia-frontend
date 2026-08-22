/** Wygenerowane przez scripts/sync-changelog.mjs — nie edytuj ręcznie. */
import type { UserChangelogEntry } from "@/lib/user-changelog";

export const GENERATED_USER_CHANGELOG: UserChangelogEntry[] = [
  {
    "version": "2.2.0.0+1",
    "date": "2026-08-22",
    "title": "Analiza techniki z filmu",
    "notes": [
      "W panelu zawodnika i w klubie możesz wgrać film rwania, zarzutu, podrzutu albo akcesorium. Dostajesz opis, co jest dobrze, co poprawić i jakie ćwiczenia dodać — bez rysowania po filmie.",
      "Superadmin włącza to flagą „Analiza techniki (AI)” w DevTools. Film zostaje na telefonie; na serwer idą tylko zdjęcia klatek."
    ]
  },
  {
    "version": "2.2.0.0+2",
    "date": "2026-08-22",
    "title": "Herb w karcie przeglądarki",
    "notes": [
      "W karcie przeglądarki i na ikonie na telefonie widać herb CKS Slavia."
    ]
  },
  {
    "version": "2.1.0.0+4",
    "date": "2026-08-22",
    "title": "Kreator, edytor i obowiązkowe ćwiczenia",
    "notes": [
      "Po ułożeniu planu w kreatorze od razu otwiera się edytor. Można też wejść prosto do pustego edytora, bez kreatora.",
      "Ćwiczenia z kreatora są oznaczone jako Must do (bursztynowe, obowiązkowe). W edytorze da się to włączyć lub wyłączyć przy każdym ćwiczeniu — zawodnik widzi to samo oznaczenie.",
      "Publikacja zamyka edytor. Jeśli nie podasz daty startu, plan zaczyna się od dziś."
    ]
  },
  {
    "version": "2.1.0.0+5",
    "date": "2026-08-22",
    "title": "Szkic AI układa cały plan, nie tylko pierwszy tydzień",
    "notes": [
      "Trener opisuje cel, dni i ewentualnie zawodnika albo grupę. AI oddaje przepis, a system rozpisuje wszystkie tygodnie (w tym lżejsze).",
      "Edytor sam zapisuje szkic. Zawodnik z grupy widzi kilogramy ze swoich rekordów, nie jedną sztangę dla wszystkich."
    ]
  },
  {
    "version": "2.1.0.0+2",
    "date": "2026-08-16",
    "title": "Edytor planu",
    "notes": [
      "Układ jak dziennik treningowy: karty dni, chipy tygodni, kopiowanie schowane pod spodem."
    ]
  },
  {
    "version": "2.0.0.0+1",
    "date": "2026-08-16",
    "title": "Koniec planów treningowych w panelu",
    "notes": [
      "Moduł planów (kadra i zawodnik) został wyłączony — nie ma już listy programów, biblioteki ćwiczeń ani szkiców AI planu.",
      "W ustawieniach zostają maile o składzie zawodów i formularzu kontaktowym.",
      "Wszystkie motywy paneli (w tym układy Kapsuła, Studio, Dok) są dostępne od razu, bez osobnej flagi."
    ]
  },
  {
    "version": "2.0.0.1+3",
    "date": "2026-08-16",
    "title": "Obecność QR w czasie polskim",
    "notes": [
      "Godzina i dzień skanu kodu QR są liczone według Warszawy, nawet gdy serwer działa w UTC."
    ]
  },
  {
    "version": "2.0.0.0+2",
    "date": "2026-08-16",
    "title": "Panel zawodnika tylko w przeglądarce",
    "notes": [
      "Aplikacja mobilna Flutter nie jest już rozwijana — logowanie, kalendarz i wyniki zostają na stronie."
    ]
  },
  {
    "version": "2.1.0.0+2",
    "date": "2026-08-16",
    "title": "Szablony w katalogu",
    "notes": [
      "Kadra może dodać własny szablon, poprawić gotowiec i usunąć ten, którego klub nie używa."
    ]
  },
  {
    "version": "2.1.0.0+1",
    "date": "2026-08-16",
    "title": "Wracają plany treningowe",
    "notes": [
      "Trener układa program w czterech krokach (tytuł, dni, ćwiczenia, kto trenuje), bierze gotowiec z katalogu albo prosi o szkic AI — wszystko trafia do edytora jednego tygodnia.",
      "W edytorze widać jeden tydzień naraz; dzień (np. poniedziałek) i cały tydzień można skopiować na wybrany lub na wszystkie tygodnie.",
      "Zawodnik widzi dzisiejszy trening z kilogramami na pulpicie i w zakładce Plan.",
      "Rekordy przysiadu i innych ćwiczeń zgłasza się osobno od wyników dwuboju; kadra akceptuje je w Rekordach ćwiczeń.",
      "Kalendarz treningu można spiąć z dniem planu."
    ]
  },
  {
    "version": "1.1.2.12+13",
    "date": "2026-08-14",
    "title": "Czyszczenie skrzynki powiadomień",
    "notes": [
      "Przy dzwonku można usunąć wszystkie powiadomienia naraz.",
      "Wpisy starsze niż 2 tygodnie znikają same."
    ]
  },
  {
    "version": "1.1.3.1+2",
    "date": "2026-08-14",
    "title": "Czytelniejsze panele",
    "notes": [
      "Puste listy mówią, co zrobić dalej — nie wyglądają już jak błąd ładowania.",
      "Jeśli coś się nie wczyta (obecność, wyniki, plany), zobaczysz komunikat zamiast ciszy.",
      "Na telefonie konta i profile kadry są kartami, nie szeroką tabelą.",
      "Kalendarz pokazuje „Zawody” / „Trening” zamiast surowych nazw."
    ]
  },
  {
    "version": "1.2.0.0+1",
    "date": "2026-08-14",
    "title": "Gotowe plany w katalogu",
    "notes": [
      "Trener może skopiować gotowy program 12 tygodni (poniedziałek, środa, piątek): rwanie, podrzut, przysiady albo kulturystyka — osobno dla początkujących i średniozaawansowanych.",
      "Obciążenie rośnie z tygodnia na tydzień, a co czwarty tydzień jest lżejszy (zrzut)."
    ]
  },
  {
    "version": "1.1.3.0+1",
    "date": "2026-08-14",
    "title": "Lepsze szkice planu z AI",
    "notes": [
      "Długie programy (np. 10–16 tygodni) mają te same dni treningowe w każdym tygodniu — nie zostaje sam poniedziałek na końcu.",
      "Szkic może zawierać rozpis serii na rwanie, podrzut i przysiad oraz zamienniki ćwiczeń."
    ]
  },
  {
    "version": "1.1.3.2+3",
    "date": "2026-08-14",
    "title": "Plany: szkic AI, archiwum i postęp",
    "notes": [
      "Trener opisuje program, wybiera dni i opcjonalnie zawodnika albo grupę — szkic trafia do edytora, zapisujesz gdy jest OK.",
      "Aktywne plany można zarchiwizować i przywrócić; nad listą jest wyszukiwarka.",
      "Na chipie planu widać, ile procent ćwiczeń jest odhaczone; trener widzi postęp wszystkich przypisanych."
    ]
  },
  {
    "version": "1.1.2.11+12",
    "date": "2026-08-14",
    "title": "Skanowanie obecności w godzinach treningu",
    "notes": [
      "Kod QR działa w czasie polskim — obecność zapisze się też między 14 a 19.",
      "Po zeskanowaniu kodu obecność zapisuje się sama, bez dodatkowego przycisku."
    ]
  },
  {
    "version": "1.1.2.1+2",
    "date": "2026-08-12",
    "title": "Limity AI (Free Plan)",
    "notes": [
      "W DevTools widać limity Groq Free Plan dla wybranego modelu oraz dzienny limit szkiców planu."
    ]
  },
  {
    "version": "1.1.2.9+10",
    "date": "2026-08-12",
    "title": "Naturalniejsze proporcje herbu",
    "notes": [
      "Herb w nawigacji nie wygląda już na ściśnięty — wróciły oryginalne proporcje."
    ]
  },
  {
    "version": "1.1.2.10+11",
    "date": "2026-08-12",
    "title": "Nazwa miasta w nagłówku",
    "notes": [
      "Obok herbu znowu widać „Ruda Śląska” pod nazwą klubu."
    ]
  },
  {
    "version": "1.1.2.4+5",
    "date": "2026-08-12",
    "title": "Oficjalny herb klubu",
    "notes": [
      "Na stronie i w panelu widać herb CKS „Slavia” Ruda Śląska zamiast dotychczasowego znaku."
    ]
  },
  {
    "version": "1.1.2.3+4",
    "date": "2026-08-12",
    "title": "Reset hasła z listy kont",
    "notes": [
      "Admin może wysłać użytkownikowi mail z linkiem do resetu hasła z listy kont.",
      "Przy kontach testowych (.dev / .local) po utworzeniu widać hasło do skopiowania."
    ]
  },
  {
    "version": "1.1.1.16+17",
    "date": "2026-08-12",
    "title": "Sama sztanga w planie",
    "notes": [
      "Przy obciążeniu możesz wybrać „Sztanga” zamiast kg lub % — w planie widać wtedy „sama sztanga”."
    ]
  },
  {
    "version": "1.1.1.15+16",
    "date": "2026-08-12",
    "title": "Serie rozgrzewkowe w planie",
    "notes": [
      "Przy indywidualnym rozpisie serii możesz oznaczyć wybrane serie jako rozgrzewkowe — zawodnik widzi je w planie jako W1, W2…"
    ]
  },
  {
    "version": "1.1.1.19+20",
    "date": "2026-08-12",
    "title": "Szkic planu z AI",
    "notes": [
      "W planach kadry możesz wygenerować szkic programu (po włączeniu asystenta AI w DevTools) — wybierasz liczbę tygodni i opis."
    ]
  },
  {
    "version": "1.1.1.17+18",
    "date": "2026-08-12",
    "title": "Szybsze dokładanie ćwiczeń w planie",
    "notes": [
      "W edytorze dnia przyciski z biblioteki i „+ Ćwiczenie” są pod listą ćwiczeń — bez przewijania w górę."
    ]
  },
  {
    "version": "1.1.2.0+1",
    "date": "2026-08-12",
    "title": "Ustawienia AI w DevTools",
    "notes": [
      "Superadmin może wybrać model Groq, styl szkiców planu i kilka parametrów generowania (w zakładce AI)."
    ]
  },
  {
    "version": "1.1.2.2+3",
    "date": "2026-08-12",
    "title": "Własne ćwiczenia w planie",
    "notes": [
      "Szkic AI może użyć ćwiczeń spoza biblioteki; w edytorze możesz jednym kliknięciem dodać takie ćwiczenie do biblioteki klubu."
    ]
  },
  {
    "version": "1.1.2.8+9",
    "date": "2026-08-12",
    "title": "Wyraźniejszy herb",
    "notes": [
      "Herb klubu ma przezroczyste tło i lepiej widać go na ciemnym pasku nawigacji."
    ]
  },
  {
    "version": "1.1.1.18+19",
    "date": "2026-08-12",
    "title": "Zawodnik sam ustala ciężar",
    "notes": [
      "W planie możesz oznaczyć obciążenie jako „zawodnik sam ustala ciężar” (obok opcji „sama sztanga”)."
    ]
  },
  {
    "version": "1.1.0.22+23",
    "date": "2026-08-11",
    "title": "% obciążenia z PR ćwiczenia",
    "notes": [
      "Trener może ustawić np. 80% PR tego samego ruchu co w planie (deadlift itd.).",
      "System nie wylicza kg z profilu — dobierasz ciężar według własnego PR."
    ]
  },
  {
    "version": "1.1.1.8+9",
    "date": "2026-08-11",
    "title": "Aktualne liczby na stronie głównej",
    "notes": [
      "Pasek pod banerem (zawodnicy, Sinclair, rekord PB, dni treningów) pokazuje dane z klubu na żywo."
    ]
  },
  {
    "version": "1.1.1.7+8",
    "date": "2026-08-11",
    "title": "Aktywacja konta z e-maila",
    "notes": [
      "Po utworzeniu konta dostajesz mail z linkiem — potwierdzasz adres i ustawiasz własne hasło.",
      "Adresy testowe (.dev / .local) nadal bez weryfikacji; wtedy hasło ustawia admin przy tworzeniu."
    ]
  },
  {
    "version": "1.1.0.24+25",
    "date": "2026-08-11",
    "title": "Checkboxy w kolorach motywu",
    "notes": [
      "Zaznaczenia w ustawieniach i panelach dopasowują się do wybranego motywu kolorystycznego."
    ]
  },
  {
    "version": "1.1.1.3+4",
    "date": "2026-08-11",
    "title": "Czytelniejsze formularze",
    "notes": [
      "Pola w formularzach mają teraz podpisane etykiety — nie trzeba domyślać się znaczenia z samego placeholdera."
    ]
  },
  {
    "version": "1.1.0.25+26",
    "date": "2026-08-11",
    "title": "Czytelniejsze plany treningowe",
    "notes": [
      "Edycja planu w klubie jest jaśniej podzielona (przypisanie, tygodnie, ćwiczenia).",
      "Biblioteka i grupy wyglądają spójniej z resztą panelu.",
      "W panelu zawodnika wybór planu i widok sesji są czytelniejsze."
    ]
  },
  {
    "version": "1.1.1.12+13",
    "date": "2026-08-11",
    "title": "Fix: tylko własne plany w panelu",
    "notes": [
      "W panelu zawodnika (także gdy masz role kadry) widać wyłącznie plany przypisane do Ciebie, Twojej grupy albo do wszystkich — nie cudze indywidualne."
    ]
  },
  {
    "version": "1.1.1.13+14",
    "date": "2026-08-11",
    "title": "Kopiowanie planu na wszystkie tygodnie",
    "notes": [
      "W edytorze planu jednym kliknięciem skopiujesz ćwiczenia bieżącego tygodnia na wszystkie pozostałe tygodnie."
    ]
  },
  {
    "version": "1.1.0.19+20",
    "date": "2026-08-11",
    "title": "Lepsze plany treningowe",
    "notes": [
      "Trener układa plany na tygodnie i dni, korzysta z katalogu programów i biblioteki ćwiczeń.",
      "Możesz odhaczać ćwiczenia, wybrać zamiennik przy kontuzji, dodać komentarz do trenera i zobaczyć odznakę ukończenia planu.",
      "Obciążenia mogą być podane jako procent Twojego najlepszego wyniku (rwanie / podrzut)."
    ]
  },
  {
    "version": "1.1.0.26+27",
    "date": "2026-08-11",
    "title": "Obciążenie: kg albo procent",
    "notes": [
      "W planie treningowym wybierasz albo stałe kg, albo % 1RM — nie trzeba wypełniać obu."
    ]
  },
  {
    "version": "1.1.0.21+22",
    "date": "2026-08-11",
    "title": "Plan sezonu i odpowiedź trenera",
    "notes": [
      "Na pulpicie widać aktywny plan sezonu — jednym kliknięciem otwierasz ćwiczenia.",
      "Gdy trener odpowie na Twój komentarz przy planie, zobaczysz tę odpowiedź w panelu (i w aplikacji)."
    ]
  },
  {
    "version": "1.1.0.20+21",
    "date": "2026-08-11",
    "title": "Plany treningowe — serie i plan osobisty",
    "notes": [
      "Widać pełną rozpiskę ćwiczeń (serie i procent obciążenia).",
      "Trener może przypisać plan tylko do Ciebie albo do grupy.",
      "Filtr „tylko dziś” w panelu planów."
    ]
  },
  {
    "version": "1.1.1.2+3",
    "date": "2026-08-11",
    "title": "Poprawka: kasowanie % w planie",
    "notes": [
      "Usuwanie ostatniej cyfry w polu procentu nie przełącza już automatycznie na kilogramy."
    ]
  },
  {
    "version": "1.1.0.23+24",
    "date": "2026-08-11",
    "title": "Spójniejsze potwierdzenia usuwania",
    "notes": [
      "Usuwanie w panelu klubu (plany, konta, CMS, wiadomości) pyta w stylu aplikacji, nie w okienku przeglądarki."
    ]
  },
  {
    "version": "1.1.1.6+7",
    "date": "2026-08-11",
    "title": "Strzałka wstecz w aplikacji",
    "notes": [
      "Na podstronach (Sinclair, analiza toru, Co nowego, ustawienia, powiadomienia) zawsze jest strzałka wstecz — także gdy wejdziesz z pulpitu."
    ]
  },
  {
    "version": "1.1.1.10+11",
    "date": "2026-08-11",
    "title": "Strzałka wstecz w panelu web",
    "notes": [
      "Na ustawieniach, Sinclairze, „Co nowego” i w wybranych narzędziach klubu jest strzałka wstecz (wraca do poprzedniej strony albo na pulpit).",
      "W edytorze planu wrócisz do listy jednym kliknięciem u góry."
    ]
  },
  {
    "version": "1.1.1.5+6",
    "date": "2026-08-11",
    "title": "Szybkie kopiowanie tygodnia w planie",
    "notes": [
      "W wielotygodniowym planie możesz skopiować ćwiczenia z jednego tygodnia na następny jednym kliknięciem (poniedziałek → poniedziałek i tak dalej)."
    ]
  },
  {
    "version": "1.1.1.9+10",
    "date": "2026-08-11",
    "title": "Tagi ćwiczeń na wspólnej liście",
    "notes": [
      "W bibliotece ćwiczeń możesz dodać i usuwać tagi klubu, a potem zaznaczać je przy każdym ćwiczeniu — bez wpisywania ręcznie po przecinku."
    ]
  },
  {
    "version": "1.1.1.11+12",
    "date": "2026-08-11",
    "title": "Top 3 Sinclair na żywo",
    "notes": [
      "Na stronie głównej podium Sinclair bierze się z aktualnych wyników zawodów klubu."
    ]
  },
  {
    "version": "1.1.1.4+5",
    "date": "2026-08-11",
    "title": "Wspólny albo indywidualny ciężar w planie",
    "notes": [
      "Przy ćwiczeniu wybierasz: ten sam ciężar na wszystkie serie albo osobny ciężar na każdą serię."
    ]
  },
  {
    "version": "1.1.0.5+4",
    "date": "2026-08-07",
    "title": "Agenda kalendarza",
    "notes": [
      "W widoku listy widać wszystkie dni miesiąca.",
      "W kalendarzu kadry przy dacie jest plus do dodania wydarzenia, a kliknięcie wydarzenia otwiera menu (edycja, szczegóły, usuwanie).",
      "W publicznym kalendarzu kliknięcie wydarzenia pokazuje szczegóły."
    ]
  },
  {
    "version": "1.1.0.5+3",
    "date": "2026-08-07",
    "title": "Czytelniejsza lista obecności",
    "notes": [
      "Na stronie Obecność widać teraz zwykłą datę i godzinę oraz czy byłeś obecny, czy nie — bez technicznego znacznika czasu."
    ]
  },
  {
    "version": "1.0.0.3+20",
    "date": "2026-08-05",
    "title": "Data zawodów i treningu",
    "notes": [
      "Przy zgłaszaniu wyniku podajesz też datę zawodów albo treningu."
    ]
  },
  {
    "version": "1.0.0.3+17",
    "date": "2026-08-05",
    "title": "Kalendarz czytelniejszy na telefonie",
    "notes": [
      "Na wąskim ekranie kalendarz otwiera się jako lista (agenda); na komputerze domyślnie siatka miesiąca, z przełącznikiem Agenda / Kalendarz."
    ]
  },
  {
    "version": "1.0.0.3+21",
    "date": "2026-08-05",
    "title": "Kategoria po zawodach w profilu",
    "notes": [
      "Gdy trener zaakceptuje wynik z zawodów (albo sam go wpisze), Twoja kategoria wagowa i masa w profilu aktualizują się według tego ważenia."
    ]
  },
  {
    "version": "1.0.0.3+22",
    "date": "2026-08-05",
    "title": "Kategoria w profilu sama się ustawia",
    "notes": [
      "Przy dodawaniu lub edycji profilu zawodnika kategoria wagowa wylicza się z wagi, płci i daty urodzenia."
    ]
  },
  {
    "version": "1.0.0.3+19",
    "date": "2026-08-05",
    "title": "Kategoria wagowa sama się ustawia",
    "notes": [
      "Przy zgłaszaniu wyniku z zawodów podajesz tylko aktualną wagę — kategorię dobieramy z Twojego wieku i płci w profilu."
    ]
  },
  {
    "version": "1.0.0.3+23",
    "date": "2026-08-05",
    "title": "Poprawianie wyników",
    "notes": [
      "Trener może poprawić wynik (także już zaakceptowany, gdy wkradł się błąd).",
      "Zawodnik może poprawić wynik oczekujący albo odesłany do edycji — wraca wtedy do weryfikacji."
    ]
  },
  {
    "version": "1.0.0.3+24",
    "date": "2026-08-05",
    "title": "Poprawka już zaakceptowanego wyniku",
    "notes": [
      "Jeśli zauważysz błąd w zaakceptowanym wyniku, możesz go poprawić — wtedy znowu trafia do trenera do weryfikacji."
    ]
  },
  {
    "version": "1.0.0.3+15",
    "date": "2026-08-05",
    "title": "Powiadomienia na telefonie",
    "notes": [
      "Lista po kliknięciu dzwonka mieści się na ekranie — nie ucieka poza krawędź.",
      "Przyciski w nagłówku paneli są czytelniejsze na wąskim ekranie."
    ]
  },
  {
    "version": "1.0.0.3+16",
    "date": "2026-08-05",
    "title": "Prostsze zgłaszanie rekordu treningowego",
    "notes": [
      "Przy rekordzie z treningu nie trzeba już podawać nazwy — wystarczy rwanie i podrzut."
    ]
  },
  {
    "version": "1.0.0.2+5",
    "date": "2026-08-04",
    "title": "E-mail i powiadomienia",
    "notes": [
      "Po pierwszym logowaniu możesz potwierdzić adres e-mail albo podać swój prawdziwy — potem maile klubowe trafią właśnie tam.",
      "Jeśli zapomnisz hasła, na stronie logowania jest link do resetu przez e-mail.",
      "W ustawieniach konta włączysz lub wyłączysz maile o składzie zawodów, planach treningowych (oraz — dla kadry — o wiadomościach z formularza kontaktowego).",
      "Po wysłaniu wiadomości przez formularz kontaktowy dostaniesz potwierdzenie na podany e-mail; kadra dostaje mail o nowej wiadomości."
    ]
  },
  {
    "version": "1.0.0.2+11",
    "date": "2026-08-04",
    "title": "Kalendarz czytelniejszy",
    "notes": [
      "Na paskach wydarzeń w siatce miesiąca widać tylko tytuł — bez godziny (godzina jest w szczegółach dnia)."
    ]
  },
  {
    "version": "1.0.0.2+8",
    "date": "2026-08-04",
    "title": "Konta i profile",
    "notes": [
      "W panelu klubu dodawanie i edycja kont oraz profili zawodników odbywa się w oknach dialogowych — lista pozostaje czytelna."
    ]
  },
  {
    "version": "1.0.0.2+10",
    "date": "2026-08-04",
    "title": "Nawigacja wstecz w aplikacji zawodnika",
    "notes": [
      "Możesz wrócić wstecz przyciskiem w pasku, gestem/przyciskiem systemowym albo przyciskiem Back na myszy (Windows)."
    ]
  },
  {
    "version": "1.0.0.2+6",
    "date": "2026-08-04",
    "title": "Powiadomienia",
    "notes": [
      "W dzwonku możesz usunąć pojedyncze powiadomienie (ikona × przy wpisie)."
    ]
  },
  {
    "version": "1.0.0.2+7",
    "date": "2026-08-04",
    "title": "Ustawienia konta",
    "notes": [
      "Ustawienia są podzielone na kategorie (profil, e-mail, hasło, powiadomienia, wygląd, prywatność) — możesz je zwijać i rozwijać."
    ]
  },
  {
    "version": "1.0.0.2+3",
    "date": "2026-08-03",
    "title": "Aplikacja mobilna dla zawodników",
    "notes": [
      "Jest aplikacja CKS Slavia na Androida i Windows — logowanie, pulpit, wyniki, obecność QR, kalendarz, plany treningowe i ustawienia.",
      "Możesz zgłaszać wyniki, skanować obecność, liczyć punkty Sinclair i czytać „Co nowego” także w aplikacji.",
      "Powiadomienia docierają do telefonu (push), a w aplikacji masz skrzynkę z historią."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "title": "Bezpieczeństwo i ustawienia konta",
    "notes": [
      "W ustawieniach zmienisz motyw paneli, nazwę wyświetlaną, hasło oraz zgody na cookies."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "title": "Łatwiej śledzić obecność na treningach",
    "notes": [
      "W kalendarzu treningi mają kolory zależne od Twojej obecności — od razu widać, czy byłeś na sali.",
      "Po kliknięciu w trening zobaczysz czytelny status obecności."
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-08-03",
    "title": "Panel klubowy dla kadry",
    "notes": [
      "Trenerzy i admini mają przejrzyście ułożony panel: konta, obecność QR, plany i kalendarz.",
      "Wyniki zgłoszone przez zawodników łatwiej zweryfikować w jednym miejscu."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "title": "Szybszy kalendarz zawodnika",
    "notes": [
      "Treningi i zawody w panelu zawodnika ładują się wyraźnie szybciej i znów są widoczne na siatce."
    ]
  },
  {
    "version": "1.0.0.1+1",
    "date": "2026-08-03",
    "title": "Zawody przez kilka dni",
    "notes": [
      "Przy dodawaniu lub edycji zawodów możesz podać datę zakończenia — zawody wielodniowe widać w kalendarzu jako jeden ciągły termin.",
      "Domyślnie koniec to ten sam dzień co start (jak dotychczas przy jednodniowych)."
    ]
  }
];
