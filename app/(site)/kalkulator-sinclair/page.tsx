import type { Metadata } from "next";
import { SinclairCalculator } from "@/components/SinclairCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Sinclair (2025–2028)",
  description:
    "Przelicznik Sinclair na okres 2025–2028 — porównuj wyniki dwuboju zawodników o różnej masie ciała. CKS Slavia Ruda Śląska.",
};

export default function SinclairPage() {
  return (
    <section className="relative isolate bg-background">
      <div className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(200,16,46,0.2)_0%,transparent_50%),linear-gradient(160deg,#0e1014_0%,#1a1f26_100%)]"
          aria-hidden="true"
        />
        <div
          className="texture-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 md:px-8 md:pt-32 md:pb-16">
          <p className="animate-rise font-display text-sm tracking-[0.28em] text-brand uppercase">
            Narzędzie
          </p>
          <div className="animate-bar mt-4 h-1 w-20 bg-brand" />
          <h1 className="animate-rise-delay-1 mt-6 max-w-3xl font-display text-4xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-5xl md:text-6xl">
            Kalkulator Sinclair
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-paper/75 md:text-lg">
            Przelicznik na okres 2025–2028 — porównywanie wyników zawodników o
            różnej masie ciała (dwubój: rwanie + podrzut).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <SinclairCalculator />

        <aside className="mt-10 max-w-3xl border-l-2 border-brand bg-paper px-5 py-4 text-sm leading-relaxed text-steel-soft md:px-6">
          <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
            Informacja
          </p>
          <p className="mt-2">
            Przelicznik jak na{" "}
            <a
              href="https://podnoszenieciezarow.pl/kalkulator/sinclair"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline-offset-2 hover:underline"
            >
              PodnoszenieCiężarów.pl
            </a>{" "}
            (okres 2025–2028): mężczyźni b = 201 kg, kobiety b = 164 kg; stała A
            dopasowana do ich tabeli. Ewentualne różnice w ostatnich miejscach
            wynikają z zaokrągleń.
          </p>
        </aside>
      </div>
    </section>
  );
}
