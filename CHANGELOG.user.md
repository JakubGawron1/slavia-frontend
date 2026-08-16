# Co nowego — dla użytkowników

Przyjazny opis zmian w platformie CKS Slavia (zawodnicy, trenerzy, admini).
Superadmin korzysta z technicznego changelogu w DevTools.

Format:

```
## [X.Y.Z] - YYYY-MM-DD
### Krótki tytuł
- zdanie zrozumiałe dla zwykłego użytkownika
```

## [2.0.0.1+3] - 2026-08-16
### Obecność QR w czasie polskim
- Godzina i dzień skanu kodu QR są liczone według Warszawy, nawet gdy serwer działa w UTC.

## [2.0.0.0+2] - 2026-08-16
### Panel zawodnika tylko w przeglądarce
- Aplikacja mobilna Flutter nie jest już rozwijana — logowanie, kalendarz i wyniki zostają na stronie.

## [2.0.0.0+1] - 2026-08-16
### Koniec planów treningowych w panelu
- Moduł planów (kadra i zawodnik) został wyłączony — nie ma już listy programów, biblioteki ćwiczeń ani szkiców AI planu.
- W ustawieniach zostają maile o składzie zawodów i formularzu kontaktowym.
- Wszystkie motywy paneli (w tym układy Kapsuła, Studio, Dok) są dostępne od razu, bez osobnej flagi.

## [1.2.0.0+1] - 2026-08-14
### Gotowe plany w katalogu
- Trener może skopiować gotowy program 12 tygodni (poniedziałek, środa, piątek): rwanie, podrzut, przysiady albo kulturystyka — osobno dla początkujących i średniozaawansowanych.
- Obciążenie rośnie z tygodnia na tydzień, a co czwarty tydzień jest lżejszy (zrzut).

## [1.1.3.2+3] - 2026-08-14
### Plany: szkic AI, archiwum i postęp
- Trener opisuje program, wybiera dni i opcjonalnie zawodnika albo grupę — szkic trafia do edytora, zapisujesz gdy jest OK.
- Aktywne plany można zarchiwizować i przywrócić; nad listą jest wyszukiwarka.
- Na chipie planu widać, ile procent ćwiczeń jest odhaczone; trener widzi postęp wszystkich przypisanych.

## [1.1.3.1+2] - 2026-08-14
### Czytelniejsze panele
- Puste listy mówią, co zrobić dalej — nie wyglądają już jak błąd ładowania.
- Jeśli coś się nie wczyta (obecność, wyniki, plany), zobaczysz komunikat zamiast ciszy.
- Na telefonie konta i profile kadry są kartami, nie szeroką tabelą.
- Kalendarz pokazuje „Zawody” / „Trening” zamiast surowych nazw.

## [1.1.3.0+1] - 2026-08-14
### Lepsze szkice planu z AI
- Długie programy (np. 10–16 tygodni) mają te same dni treningowe w każdym tygodniu — nie zostaje sam poniedziałek na końcu.
- Szkic może zawierać rozpis serii na rwanie, podrzut i przysiad oraz zamienniki ćwiczeń.

## [1.1.2.12+13] - 2026-08-14
### Czyszczenie skrzynki powiadomień
- Przy dzwonku można usunąć wszystkie powiadomienia naraz.
- Wpisy starsze niż 2 tygodnie znikają same.

## [1.1.2.11+12] - 2026-08-14
### Skanowanie obecności w godzinach treningu
- Kod QR działa w czasie polskim — obecność zapisze się też między 14 a 19.
- Po zeskanowaniu kodu obecność zapisuje się sama, bez dodatkowego przycisku.

## [1.1.2.10+11] - 2026-08-12
### Nazwa miasta w nagłówku
- Obok herbu znowu widać „Ruda Śląska” pod nazwą klubu.

## [1.1.2.9+10] - 2026-08-12
### Naturalniejsze proporcje herbu
- Herb w nawigacji nie wygląda już na ściśnięty — wróciły oryginalne proporcje.

## [1.1.2.8+9] - 2026-08-12
### Wyraźniejszy herb
- Herb klubu ma przezroczyste tło i lepiej widać go na ciemnym pasku nawigacji.

## [1.1.2.4+5] - 2026-08-12
### Oficjalny herb klubu
- Na stronie i w panelu widać herb CKS „Slavia” Ruda Śląska zamiast dotychczasowego znaku.

## [1.1.2.3+4] - 2026-08-12
### Reset hasła z listy kont
- Admin może wysłać użytkownikowi mail z linkiem do resetu hasła z listy kont.
- Przy kontach testowych (.dev / .local) po utworzeniu widać hasło do skopiowania.

## [1.1.2.2+3] - 2026-08-12
### Własne ćwiczenia w planie
- Szkic AI może użyć ćwiczeń spoza biblioteki; w edytorze możesz jednym kliknięciem dodać takie ćwiczenie do biblioteki klubu.

## [1.1.2.1+2] - 2026-08-12
### Limity AI (Free Plan)
- W DevTools widać limity Groq Free Plan dla wybranego modelu oraz dzienny limit szkiców planu.

## [1.1.2.0+1] - 2026-08-12
### Ustawienia AI w DevTools
- Superadmin może wybrać model Groq, styl szkiców planu i kilka parametrów generowania (w zakładce AI).

## [1.1.1.19+20] - 2026-08-12
### Szkic planu z AI
- W planach kadry możesz wygenerować szkic programu (po włączeniu asystenta AI w DevTools) — wybierasz liczbę tygodni i opis.

## [1.1.1.18+19] - 2026-08-12
### Zawodnik sam ustala ciężar
- W planie możesz oznaczyć obciążenie jako „zawodnik sam ustala ciężar” (obok opcji „sama sztanga”).

## [1.1.1.17+18] - 2026-08-12
### Szybsze dokładanie ćwiczeń w planie
- W edytorze dnia przyciski z biblioteki i „+ Ćwiczenie” są pod listą ćwiczeń — bez przewijania w górę.

## [1.1.1.16+17] - 2026-08-12
### Sama sztanga w planie
- Przy obciążeniu możesz wybrać „Sztanga” zamiast kg lub % — w planie widać wtedy „sama sztanga”.

## [1.1.1.15+16] - 2026-08-12
### Serie rozgrzewkowe w planie
- Przy indywidualnym rozpisie serii możesz oznaczyć wybrane serie jako rozgrzewkowe — zawodnik widzi je w planie jako W1, W2…

## [1.1.1.13+14] - 2026-08-11
### Kopiowanie planu na wszystkie tygodnie
- W edytorze planu jednym kliknięciem skopiujesz ćwiczenia bieżącego tygodnia na wszystkie pozostałe tygodnie.

## [1.1.1.12+13] - 2026-08-11
### Fix: tylko własne plany w panelu
- W panelu zawodnika (także gdy masz role kadry) widać wyłącznie plany przypisane do Ciebie, Twojej grupy albo do wszystkich — nie cudze indywidualne.

## [1.1.1.11+12] - 2026-08-11
### Top 3 Sinclair na żywo
- Na stronie głównej podium Sinclair bierze się z aktualnych wyników zawodów klubu.

## [1.1.1.10+11] - 2026-08-11
### Strzałka wstecz w panelu web
- Na ustawieniach, Sinclairze, „Co nowego” i w wybranych narzędziach klubu jest strzałka wstecz (wraca do poprzedniej strony albo na pulpit).
- W edytorze planu wrócisz do listy jednym kliknięciem u góry.

## [1.1.1.9+10] - 2026-08-11
### Tagi ćwiczeń na wspólnej liście
- W bibliotece ćwiczeń możesz dodać i usuwać tagi klubu, a potem zaznaczać je przy każdym ćwiczeniu — bez wpisywania ręcznie po przecinku.

## [1.1.1.8+9] - 2026-08-11
### Aktualne liczby na stronie głównej
- Pasek pod banerem (zawodnicy, Sinclair, rekord PB, dni treningów) pokazuje dane z klubu na żywo.

## [1.1.1.7+8] - 2026-08-11
### Aktywacja konta z e-maila
- Po utworzeniu konta dostajesz mail z linkiem — potwierdzasz adres i ustawiasz własne hasło.
- Adresy testowe (.dev / .local) nadal bez weryfikacji; wtedy hasło ustawia admin przy tworzeniu.

## [1.1.1.6+7] - 2026-08-11
### Strzałka wstecz w aplikacji
- Na podstronach (Sinclair, analiza toru, Co nowego, ustawienia, powiadomienia) zawsze jest strzałka wstecz — także gdy wejdziesz z pulpitu.

## [1.1.1.5+6] - 2026-08-11
### Szybkie kopiowanie tygodnia w planie
- W wielotygodniowym planie możesz skopiować ćwiczenia z jednego tygodnia na następny jednym kliknięciem (poniedziałek → poniedziałek i tak dalej).

## [1.1.1.4+5] - 2026-08-11
### Wspólny albo indywidualny ciężar w planie
- Przy ćwiczeniu wybierasz: ten sam ciężar na wszystkie serie albo osobny ciężar na każdą serię.

## [1.1.1.3+4] - 2026-08-11
### Czytelniejsze formularze
- Pola w formularzach mają teraz podpisane etykiety — nie trzeba domyślać się znaczenia z samego placeholdera.

## [1.1.1.2+3] - 2026-08-11
### Poprawka: kasowanie % w planie
- Usuwanie ostatniej cyfry w polu procentu nie przełącza już automatycznie na kilogramy.

## [1.1.0.26+27] - 2026-08-11
### Obciążenie: kg albo procent
- W planie treningowym wybierasz albo stałe kg, albo % 1RM — nie trzeba wypełniać obu.

## [1.1.0.25+26] - 2026-08-11
### Czytelniejsze plany treningowe
- Edycja planu w klubie jest jaśniej podzielona (przypisanie, tygodnie, ćwiczenia).
- Biblioteka i grupy wyglądają spójniej z resztą panelu.
- W panelu zawodnika wybór planu i widok sesji są czytelniejsze.

## [1.1.0.24+25] - 2026-08-11
### Checkboxy w kolorach motywu
- Zaznaczenia w ustawieniach i panelach dopasowują się do wybranego motywu kolorystycznego.

## [1.1.0.23+24] - 2026-08-11
### Spójniejsze potwierdzenia usuwania
- Usuwanie w panelu klubu (plany, konta, CMS, wiadomości) pyta w stylu aplikacji, nie w okienku przeglądarki.

## [1.1.0.22+23] - 2026-08-11
### % obciążenia z PR ćwiczenia
- Trener może ustawić np. 80% PR tego samego ruchu co w planie (deadlift itd.).
- System nie wylicza kg z profilu — dobierasz ciężar według własnego PR.

## [1.1.0.21+22] - 2026-08-11
### Plan sezonu i odpowiedź trenera
- Na pulpicie widać aktywny plan sezonu — jednym kliknięciem otwierasz ćwiczenia.
- Gdy trener odpowie na Twój komentarz przy planie, zobaczysz tę odpowiedź w panelu (i w aplikacji).

## [1.1.0.20+21] - 2026-08-11
### Plany treningowe — serie i plan osobisty
- Widać pełną rozpiskę ćwiczeń (serie i procent obciążenia).
- Trener może przypisać plan tylko do Ciebie albo do grupy.
- Filtr „tylko dziś” w panelu planów.

## [1.1.0.19+20] - 2026-08-11
### Lepsze plany treningowe
- Trener układa plany na tygodnie i dni, korzysta z katalogu programów i biblioteki ćwiczeń.
- Możesz odhaczać ćwiczenia, wybrać zamiennik przy kontuzji, dodać komentarz do trenera i zobaczyć odznakę ukończenia planu.
- Obciążenia mogą być podane jako procent Twojego najlepszego wyniku (rwanie / podrzut).

## [1.1.0.5+4] - 2026-08-07

### Agenda kalendarza

- W widoku listy widać wszystkie dni miesiąca.
- W kalendarzu kadry przy dacie jest plus do dodania wydarzenia, a kliknięcie wydarzenia otwiera menu (edycja, szczegóły, usuwanie).
- W publicznym kalendarzu kliknięcie wydarzenia pokazuje szczegóły.

## [1.1.0.5+3] - 2026-08-07

### Czytelniejsza lista obecności

- Na stronie Obecność widać teraz zwykłą datę i godzinę oraz czy byłeś obecny, czy nie — bez technicznego znacznika czasu.

## [1.0.0.3+24] - 2026-08-05

### Poprawka już zaakceptowanego wyniku

- Jeśli zauważysz błąd w zaakceptowanym wyniku, możesz go poprawić — wtedy znowu trafia do trenera do weryfikacji.

## [1.0.0.3+23] - 2026-08-05

### Poprawianie wyników

- Trener może poprawić wynik (także już zaakceptowany, gdy wkradł się błąd).
- Zawodnik może poprawić wynik oczekujący albo odesłany do edycji — wraca wtedy do weryfikacji.

## [1.0.0.3+22] - 2026-08-05

### Kategoria w profilu sama się ustawia

- Przy dodawaniu lub edycji profilu zawodnika kategoria wagowa wylicza się z wagi, płci i daty urodzenia.

## [1.0.0.3+21] - 2026-08-05

### Kategoria po zawodach w profilu

- Gdy trener zaakceptuje wynik z zawodów (albo sam go wpisze), Twoja kategoria wagowa i masa w profilu aktualizują się według tego ważenia.

## [1.0.0.3+20] - 2026-08-05

### Data zawodów i treningu

- Przy zgłaszaniu wyniku podajesz też datę zawodów albo treningu.

## [1.0.0.3+19] - 2026-08-05

### Kategoria wagowa sama się ustawia

- Przy zgłaszaniu wyniku z zawodów podajesz tylko aktualną wagę — kategorię dobieramy z Twojego wieku i płci w profilu.

## [1.0.0.3+17] - 2026-08-05

### Kalendarz czytelniejszy na telefonie

- Na wąskim ekranie kalendarz otwiera się jako lista (agenda); na komputerze domyślnie siatka miesiąca, z przełącznikiem Agenda / Kalendarz.

## [1.0.0.3+16] - 2026-08-05

### Prostsze zgłaszanie rekordu treningowego

- Przy rekordzie z treningu nie trzeba już podawać nazwy — wystarczy rwanie i podrzut.

## [1.0.0.3+15] - 2026-08-05

### Powiadomienia na telefonie

- Lista po kliknięciu dzwonka mieści się na ekranie — nie ucieka poza krawędź.
- Przyciski w nagłówku paneli są czytelniejsze na wąskim ekranie.

## [1.0.0.2+11] - 2026-08-04

### Kalendarz czytelniejszy

- Na paskach wydarzeń w siatce miesiąca widać tylko tytuł — bez godziny (godzina jest w szczegółach dnia).

## [1.0.0.2+10] - 2026-08-04

### Nawigacja wstecz w aplikacji zawodnika

- Możesz wrócić wstecz przyciskiem w pasku, gestem/przyciskiem systemowym albo przyciskiem Back na myszy (Windows).

## [1.0.0.2+8] - 2026-08-04

### Konta i profile

- W panelu klubu dodawanie i edycja kont oraz profili zawodników odbywa się w oknach dialogowych — lista pozostaje czytelna.

## [1.0.0.2+7] - 2026-08-04

### Ustawienia konta

- Ustawienia są podzielone na kategorie (profil, e-mail, hasło, powiadomienia, wygląd, prywatność) — możesz je zwijać i rozwijać.

## [1.0.0.2+6] - 2026-08-04

### Powiadomienia

- W dzwonku możesz usunąć pojedyncze powiadomienie (ikona × przy wpisie).

## [1.0.0.2+5] - 2026-08-04

### E-mail i powiadomienia

- Po pierwszym logowaniu możesz potwierdzić adres e-mail albo podać swój prawdziwy — potem maile klubowe trafią właśnie tam.
- Jeśli zapomnisz hasła, na stronie logowania jest link do resetu przez e-mail.
- W ustawieniach konta włączysz lub wyłączysz maile o składzie zawodów, planach treningowych (oraz — dla kadry — o wiadomościach z formularza kontaktowego).
- Po wysłaniu wiadomości przez formularz kontaktowy dostaniesz potwierdzenie na podany e-mail; kadra dostaje mail o nowej wiadomości.

## [1.0.0.2+3] - 2026-08-03

### Aplikacja mobilna dla zawodników

- Jest aplikacja CKS Slavia na Androida i Windows — logowanie, pulpit, wyniki, obecność QR, kalendarz, plany treningowe i ustawienia.
- Możesz zgłaszać wyniki, skanować obecność, liczyć punkty Sinclair i czytać „Co nowego” także w aplikacji.
- Powiadomienia docierają do telefonu (push), a w aplikacji masz skrzynkę z historią.

## [1.0.0.1+1] - 2026-08-03

### Zawody przez kilka dni

- Przy dodawaniu lub edycji zawodów możesz podać datę zakończenia — zawody wielodniowe widać w kalendarzu jako jeden ciągły termin.
- Domyślnie koniec to ten sam dzień co start (jak dotychczas przy jednodniowych).

### Szybszy kalendarz zawodnika

- Treningi i zawody w panelu zawodnika ładują się wyraźnie szybciej i znów są widoczne na siatce.

## [1.0.0] - 2026-08-03

### Łatwiej śledzić obecność na treningach

- W kalendarzu treningi mają kolory zależne od Twojej obecności — od razu widać, czy byłeś na sali.
- Po kliknięciu w trening zobaczysz czytelny status obecności.

### Panel klubowy dla kadry

- Trenerzy i admini mają przejrzyście ułożony panel: konta, obecność QR, plany i kalendarz.
- Wyniki zgłoszone przez zawodników łatwiej zweryfikować w jednym miejscu.

### Bezpieczeństwo i ustawienia konta

- W ustawieniach zmienisz motyw paneli, nazwę wyświetlaną, hasło oraz zgody na cookies.
