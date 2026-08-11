export const stats = [
  { label: "Aktywni zawodnicy", value: "8", note: "w tym 1 K · 7 M" },
  { label: "Najlepszy Sinclair", value: "278.5", note: "w klubie (2025–2028)" },
  { label: "Najwyższa suma", value: "182 kg", note: "klubowy rekord PB" },
  { label: "Treningi", value: "3×", note: "Pn · Śr · Pt" },
];

export const pillars = [
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

export const history = [
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

export const groups = [
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

export const ranking = [
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

export const BASE_TOOLS = [
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
