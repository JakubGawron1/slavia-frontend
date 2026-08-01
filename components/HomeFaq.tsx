"use client";

import { useId, useState } from "react";

const faqs = [
  {
    q: "Czy muszę mieć doświadczenie, żeby zacząć trenować?",
    a: "Nie. Zaczynamy od podstaw techniki i bezpiecznego ruchu. Trenerzy dobierają obciążenie do Twojego poziomu — od pierwszego kontaktu ze sztangą po starty zawodnicze.",
  },
  {
    q: "Czy potrzebuję własnego sprzętu na początek?",
    a: "Na start wystarczy wygodny strój sportowy i buty z płaską podeszwą. Sprzęt treningowy jest na sali. Własne buty ciężarowe i pas możesz dokupić później.",
  },
  {
    q: "Od jakiego wieku można dołączyć?",
    a: "Przyjmujemy młodzież od ok. 11 lat oraz dorosłych. Grupy są podzielone wiekowo: młodzicy, juniorzy i senior/open.",
  },
  {
    q: "Jak wygląda pierwszy trening?",
    a: "Poznajesz salę i trenera, robisz rozgrzewkę i uczysz się podstawowych pozycji. Pierwszy trening jest bez zobowiązań — sprawdzasz, czy ciężary są dla Ciebie.",
  },
  {
    q: "Czy w klubie startują też dziewczyny i kobiety?",
    a: "Tak. Sekcja kobieca jest aktywna — wspólna sala, osobne ścieżki rozwoju i starty w mistrzostwach na poziomie regionu i kraju.",
  },
];

export function HomeFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-mist border-y border-mist">
      {faqs.map((item, index) => {
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        const isOpen = open === index;

        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg tracking-wide text-ink uppercase transition-colors hover:text-brand md:text-xl"
                onClick={() => setOpen(isOpen ? null : index)}
              >
                {item.q}
                <span
                  className={`font-display text-2xl text-brand transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 text-base leading-relaxed text-steel-soft"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
