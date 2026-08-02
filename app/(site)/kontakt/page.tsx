import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z CKS Slavia Ruda Śląska — formularz dla nowych zawodników i zainteresowanych.",
};

export default function KontaktPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(200,16,46,0.22)_0%,transparent_48%),radial-gradient(ellipse_at_80%_75%,rgba(74,85,96,0.3)_0%,transparent_50%),linear-gradient(160deg,#0e1014_0%,#1a1f26_55%,#12151a_100%)]"
        aria-hidden="true"
      />
      <div
        className="texture-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-5 pt-28 pb-14 md:px-8 md:pt-32 md:pb-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-14">
          <header className="animate-rise lg:pt-1">
            <p className="font-display text-sm tracking-[0.28em] text-brand uppercase">
              Napisz do nas
            </p>
            <div className="animate-bar mt-3 h-1 w-14 bg-brand" />
            <h1 className="mt-5 font-display text-4xl leading-none font-semibold tracking-tight uppercase sm:text-5xl">
              Kontakt
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-paper/70">
              Zostaw dane i wiadomość — odpowie trener lub administracja.
            </p>

            <aside className="mt-8 space-y-5 border-t border-paper/10 pt-8 text-sm leading-relaxed text-paper/65">
              <div>
                <p className="font-display text-[0.65rem] tracking-[0.16em] text-brand uppercase">
                  Adres
                </p>
                <p className="mt-1.5 text-paper/85">
                  ul. Konopnickiej 13
                  <br />
                  41-700 Ruda Śląska
                </p>
              </div>
              <div>
                <p className="font-display text-[0.65rem] tracking-[0.16em] text-brand uppercase">
                  Treningi
                </p>
                <p className="mt-1.5 text-paper/85">Pn, Śr, Pt · 15:00 – 18:00</p>
              </div>
              <p className="text-paper/50">
                Wiadomość trafia do skrzynki kadry. Danych nie publikujemy.
              </p>
            </aside>
          </header>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
