import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności i informacje o plikach cookies CKS Slavia Ruda Śląska.",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-chrome text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(200,16,46,0.18)_0%,transparent_48%),linear-gradient(160deg,#0e1014_0%,#1a1f26_55%,#12151a_100%)]"
        aria-hidden="true"
      />
      <div
        className="texture-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-20">
        <header className="animate-rise">
          <p className="font-display text-sm tracking-[0.28em] text-brand uppercase">
            RODO · Cookies
          </p>
          <div className="animate-bar mt-3 h-1 w-14 bg-brand" />
          <h1 className="mt-5 font-display text-4xl leading-none font-semibold tracking-tight uppercase sm:text-5xl">
            Polityka prywatności
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            Informacje o przetwarzaniu danych osobowych i plikach cookies na
            stronie CKS Slavia Ruda Śląska.
          </p>
        </header>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-paper/75">
          <section className="space-y-3">
            <h2 className="font-display text-lg tracking-wide text-paper uppercase">
              1. Administrator
            </h2>
            <p>
              Administratorem danych jest Ciężarowy Klub Sportowy Slavia z
              siedzibą przy ul. Konopnickiej 13, 41-700 Ruda Śląska. W sprawach
              prywatności możesz skorzystać z{" "}
              <Link
                href="/kontakt"
                className="text-paper underline decoration-paper/30 underline-offset-2 hover:text-brand hover:decoration-brand"
              >
                formularza kontaktowego
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg tracking-wide text-paper uppercase">
              2. Jakie dane zbieramy
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Dane z formularza kontaktowego: imię i nazwisko, e-mail,
                telefon, treść wiadomości — w celu odpowiedzi na zapytanie.
              </li>
              <li>
                Dane konta (logowanie do panelu zawodnika / klubu): identyfikator
                i dane niezbędne do autoryzacji oraz obsługi konta.
              </li>
              <li>
                Dane techniczne związane z działaniem strony (np. pliki cookies
                sesji).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg tracking-wide text-paper uppercase">
              3. Pliki cookies
            </h2>
            <p>Na stronie stosujemy następujące kategorie:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="text-paper">Niezbędne</span> — wymagane do
                działania witryny, w tym utrzymania sesji po zalogowaniu.
                Podstawa: prawnie uzasadniony interes / wykonanie umowy (dostęp
                do konta).
              </li>
              <li>
                <span className="text-paper">Funkcjonalne</span> — zapamiętanie
                preferencji (np. motyw jasny/ciemny). Wymagają Twojej zgody.
              </li>
              <li>
                <span className="text-paper">Analityczne</span> —{" "}
                <span className="text-paper">Vercel Analytics</span> i{" "}
                <span className="text-paper">Speed Insights</span>: anonimowe
                pomiary odwiedzin oraz wydajności stron publicznych (bez cookies
                reklamowych). Skrypty ładują się dopiero po Twojej zgodzie;
                panele zawodnika/klubu nie są śledzone w Analytics. Wymagają
                Twojej zgody.
              </li>
            </ul>
            <p>
              Zgodę na cookies możesz wyrazić, ograniczyć lub wycofać w banerze,
              w stopce witryny („Ustawienia cookies”) albo w{" "}
              <span className="text-paper">Ustawieniach konta</span> po
              zalogowaniu do panelu. Po wycofaniu zgody analitycznej skrypt
              przestaje zbierać dane.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg tracking-wide text-paper uppercase">
              4. Twoje prawa
            </h2>
            <p>
              Masz prawo dostępu do danych, ich sprostowania, usunięcia,
              ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu
              — w zakresie przewidzianym przez RODO. Masz też prawo wnieść
              skargę do Prezesa Urzędu Ochrony Danych Osobowych.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg tracking-wide text-paper uppercase">
              5. Okres przechowywania
            </h2>
            <p>
              Wiadomości z formularza kontaktowego przechowujemy przez czas
              potrzebny do obsługi zapytania i ewentualnej korespondencji.
              Dane konta — przez okres posiadania konta w systemie klubu.
              Preferencje cookies — do czasu ich zmiany lub wyczyszczenia
              danych przeglądarki.
            </p>
          </section>

          <p className="border-t border-paper/10 pt-8 text-xs text-paper/45">
            Ostatnia aktualizacja: sierpień 2026
          </p>
        </div>
      </div>
    </section>
  );
}
