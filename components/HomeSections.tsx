import Link from "next/link";
import { HomeFaq } from "./HomeFaq";

const stats = [
  { label: "Aktywni zawodnicy", value: "8", note: "w tym 1 K · 7 M" },
  { label: "Najlepszy Sinclair", value: "278.5", note: "w klubie (2025–2028)" },
  { label: "Najwyższa suma", value: "182 kg", note: "klubowy rekord PB" },
  { label: "Treningi", value: "3×", note: "Pn · Śr · Pt" },
];

const pillars = [
  {
    title: "Społeczność",
    text: "Trenerzy, zawodnicy i rodzice tworzą przyjazną atmosferę. Tu każdy zaczyna od solidnych podstaw — a po roku potrafi wstać po pierwszy medal.",
  },
  {
    title: "Sport i rozwój",
    text: "Starty w zawodach klubowych, lidze śląskiej i mistrzostwach Polski. Cele dopasowane do wieku i poziomu — bez przeskakiwania etapów.",
  },
  {
    title: "Zdrowy trening",
    text: "Nacisk na technikę, regenerację i długofalowe bezpieczeństwo. Siła ma służyć przez lata — także po karierze startowej.",
  },
];

const history = [
  {
    year: "2014",
    tag: "Klub",
    title: "Struktura CKS i PZPC",
    text: "Formalizacja klubu, przynależność do PZPC i uporządkowany system grup wiekowych.",
  },
  {
    year: "2019",
    tag: "Sport",
    title: "Rozwój sekcji kobiecej",
    text: "Wzrost liczby zawodniczek, starty w mistrzostwach Polski i wspólna sala dla wszystkich kategorii.",
  },
  {
    year: "2022",
    tag: "Sport",
    title: "Medale na MP",
    text: "Wyróżnienia na mistrzostwach Polski juniorów i seniorów — efekt pracy sztabu trenerskiego.",
  },
  {
    year: "2025",
    tag: "Cyfrowo",
    title: "Platforma Slavia",
    text: "Ranking Sinclair, kalendarz, strefa zawodnika i narzędzia łączące kadrę z zawodnikami.",
  },
];

const groups = [
  {
    age: "11–14 lat",
    title: "Młodzicy / Młodziczki",
    text: "Pierwszy kontakt ze sztangą — technika, koordynacja i ogólnorozwojówka. Bez ścigania się z ciężarem.",
    points: [
      "Bezpieczna nauka rwania i podrzutu",
      "Mobilność i stabilizacja",
      "Aktywne wzmacnianie ogółu",
    ],
  },
  {
    age: "15–20 lat",
    title: "Juniorzy / Juniorki",
    text: "Pełnoprawne treningi dwuboju — progres techniczny, plan startowy i pierwsze poważne zawody.",
    points: [
      "Indywidualne plany treningowe",
      "Liga śląska i mistrzostwa Polski",
      "Obozy i zgrupowania",
    ],
  },
  {
    age: "20+ lat",
    title: "Senior / Open",
    text: "Trening dla dorosłych — od „chcę spróbować” po starty masters. Plan pod cele i tryb życia.",
    points: [
      "Plan dopasowany do pracy",
      "Konsultacje techniczne",
      "Starty klubowe i regionalne",
    ],
  },
];

const ranking = [
  {
    place: "1",
    name: "Jakub Gawron",
    meta: "U20 M — 60 kg",
    total: "182 kg",
    sinclair: "278.51",
  },
  {
    place: "2",
    name: "Samuel Smutek",
    meta: "U20 M — 70 kg",
    total: "138 kg",
    sinclair: "198.43",
  },
  {
    place: "3",
    name: "Dawid Węgrzyn",
    meta: "Open",
    total: "115 kg",
    sinclair: "164.55",
  },
];

const BASE_TOOLS = [
  {
    href: "/kalendarz",
    title: "Kalendarz",
    text: "Treningi, zawody i terminy klubowe w jednym miejscu.",
    flag: "calendar" as const,
  },
  {
    href: "/blog",
    title: "Aktualności",
    text: "Relacje z zawodów, nowinki organizacyjne i życie sekcji.",
    flag: "blog" as const,
  },
  {
    href: "/ogloszenia",
    title: "Tablica ogłoszeń",
    text: "Komunikaty dla zawodników, rodziców i kadry.",
    flag: "ogloszenia" as const,
  },
  {
    href: "/logowanie",
    title: "Strefa klubowa",
    text: "Logowanie dla zawodników, trenerów i administratorów — m.in. kalkulator Sinclair.",
    flag: null,
  },
];

type HomeSectionsProps = {
  blogEnabled?: boolean;
  ogloszeniaEnabled?: boolean;
  calendarEnabled?: boolean;
};

export function HomeSections({
  blogEnabled = true,
  ogloszeniaEnabled = true,
  calendarEnabled = true,
}: HomeSectionsProps) {
  const tools = BASE_TOOLS.filter((tool) => {
    if (tool.flag === "blog") return blogEnabled;
    if (tool.flag === "ogloszenia") return ogloszeniaEnabled;
    if (tool.flag === "calendar") return calendarEnabled;
    return true;
  });

  return (
    <>
      <section className="border-b border-mist bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-mist px-5 py-8 odd:border-r lg:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <p className="font-display text-xs tracking-[0.18em] text-brand uppercase">
                {stat.label}
              </p>
              <p className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-steel-soft">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Kim jesteśmy
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-ink md:text-5xl">
            Sport, ludzie i zdrowy progres
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
            Slavia to nie tylko medalowe nazwiska — to codzienna praca i
            bezpieczna nauka techniki, która ma służyć zdrowiu na lata.
          </p>

          <div className="mt-12 grid gap-10 border-t border-mist pt-10 md:grid-cols-3 md:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <div className="h-1 w-10 bg-brand" />
                <h3 className="mt-4 font-display text-2xl tracking-wide text-ink uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-steel-soft">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-chrome py-16 text-paper md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            O nas
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight uppercase md:text-5xl">
            Historia klubu
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70 md:text-lg">
            Od pierwszych treningów na śląskiej sali po kadrę startującą w całej
            Polsce — kamienie milowe CKS Slavia.
          </p>

          <ol className="mt-12 space-y-0 border-l border-paper/15">
            {history.map((item) => (
              <li key={item.year} className="relative pl-8 pb-10 last:pb-0">
                <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 bg-brand" />
                <p className="font-display text-sm tracking-[0.16em] text-brand uppercase">
                  {item.year} · {item.tag}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-wide uppercase">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/65 md:text-base">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Co Cię czeka na sali
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Trzy grupy, jeden klub
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
            Niezależnie czy masz 11 czy 41 lat — znajdziemy miejsce. Trenujemy
            razem, ale plan zawsze jest dopasowany do możliwości i celów.
          </p>

          <div className="mt-12 grid gap-0 border border-mist md:grid-cols-3">
            {groups.map((group) => (
              <div
                key={group.title}
                className="border-b border-mist px-5 py-8 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0 md:px-6 md:py-10"
              >
                <p className="font-display text-sm tracking-[0.16em] text-brand uppercase">
                  {group.age}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-wide text-ink uppercase">
                  {group.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-steel-soft md:text-base">
                  {group.text}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-steel">
                  {group.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-brand" aria-hidden="true">
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Mistrzowie klubu
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Top 3 Sinclair
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
            Podium klubowe według punktów Sinclair (IWF 2025–2028) — niezależnie
            od kategorii wagowej i płci.
          </p>

          <ol className="mt-12 divide-y divide-mist border-y border-mist">
            {ranking.map((row) => (
              <li
                key={row.name}
                className="grid gap-3 py-6 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-6"
              >
                <span className="font-display text-3xl text-brand md:text-4xl">
                  {row.place}
                </span>
                <div>
                  <p className="font-display text-xl tracking-wide text-ink uppercase md:text-2xl">
                    {row.name}
                  </p>
                  <p className="mt-1 text-sm text-steel-soft">{row.meta}</p>
                </div>
                <p className="text-steel-soft">
                  Dwubój{" "}
                  <span className="font-display text-ink uppercase">
                    {row.total}
                  </span>
                </p>
                <p className="font-display text-2xl tracking-tight text-brand md:text-right md:text-3xl">
                  {row.sinclair}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Link
              href="/zawodnicy"
              className="inline-flex items-center gap-2 font-display text-sm tracking-[0.14em] text-ink uppercase transition-colors hover:text-brand"
            >
              Zobacz zawodników
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-steel-panel py-16 text-paper md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Narzędzia
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight uppercase md:text-5xl">
            Wszystko w jednym miejscu
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70 md:text-lg">
            Ranking Sinclair, blog i kalendarz — trenuj mądrzej i bądź na
            bieżąco z życiem klubu.
          </p>

          <div className="mt-12 grid gap-px bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-steel-panel px-5 py-8 transition-colors hover:bg-chrome md:px-6"
              >
                <h3 className="font-display text-xl tracking-wide uppercase transition-colors group-hover:text-brand">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  {tool.text}
                </p>
                <span className="mt-6 inline-block font-display text-xs tracking-[0.14em] text-brand uppercase">
                  Otwórz →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
          <div>
            <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
              Gdzie nas znaleźć
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Slavia. Ruda Śląska.
              <span className="mt-2 block text-steel-soft">
                Poniedziałek 15:00.
              </span>
            </h2>

            <div className="mt-10 space-y-8">
              <div>
                <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
                  Adres sali
                </p>
                <address className="mt-3 text-base leading-relaxed text-steel not-italic">
                  CKS Slavia Ruda Śląska
                  <br />
                  ul. Konopnickiej 13
                  <br />
                  41-700 Ruda Śląska
                </address>
              </div>

              <div>
                <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
                  Godziny treningów
                </p>
                <ul className="mt-3 space-y-2 text-base text-steel">
                  <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                    <span>Poniedziałek</span>
                    <span className="font-display tracking-wide">15:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                    <span>Środa</span>
                    <span className="font-display tracking-wide">15:00 – 18:00</span>
                  </li>
                  <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                    <span>Piątek</span>
                    <span className="font-display tracking-wide">15:00 – 18:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end bg-chrome px-6 py-10 text-paper md:px-8 md:py-12">
            <p className="font-display text-sm tracking-[0.2em] text-brand uppercase">
              Sprawdź, jak smakuje sztanga
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/75">
              Pierwszy trening jest bez zobowiązań. Wpadnij na salę, poznaj
              trenerów i drużynę — pokażemy, że ciężary są dla każdego, kto chce
              trochę popracować.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ogloszeniaEnabled ? (
                <Link
                  href="/ogloszenia"
                  className="bg-brand px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:bg-brand-deep"
                >
                  Umów pierwszy trening
                </Link>
              ) : null}
              {calendarEnabled ? (
                <Link
                  href="/kalendarz"
                  className="border border-paper/30 px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
                >
                  Zobacz kalendarz
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Najczęstsze pytania
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Zanim przyjdziesz po raz pierwszy
          </h2>
          <div className="mt-10">
            <HomeFaq />
          </div>
        </div>
      </section>
    </>
  );
}
