"use client";

import Link from "next/link";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";
import { ClubMark } from "./ClubMark";

export function Footer() {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  const blogEnabled = isFlagEnabled(flags, "public_blog");
  const announcementsEnabled = isFlagEnabled(flags, "announcements_board");

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <ClubMark className="h-9 w-9 text-brand" />
            <div>
              <p className="font-display text-xl tracking-[0.06em] uppercase">
                CKS Slavia
              </p>
              <p className="text-xs tracking-wide text-paper/50">Ruda Śląska</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            Ciężarowy Klub Sportowy Slavia — dwubój olimpijski, młodzież i
            seniorzy na śląskiej sali.
          </p>
          <p className="mt-4 text-sm text-paper/55">
            Treningi: Pn, Śr, Pt · 15:00 – 18:00
          </p>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.14em] text-brand uppercase">
            Nawigacja
          </p>
          <ul className="mt-4 space-y-2 text-sm text-paper/75">
            {blogEnabled ? (
              <li>
                <Link href="/blog" className="hover:text-paper">
                  Aktualności
                </Link>
              </li>
            ) : null}
            <li>
              <Link href="/zawodnicy" className="hover:text-paper">
                Zawodnicy
              </Link>
            </li>
            <li>
              <Link href="/kalendarz" className="hover:text-paper">
                Kalendarz
              </Link>
            </li>
            <li>
              <Link href="/kalkulator-sinclair" className="hover:text-paper">
                Kalkulator Sinclair
              </Link>
            </li>
            {announcementsEnabled ? (
              <li>
                <Link href="/ogloszenia" className="hover:text-paper">
                  Tablica ogłoszeń
                </Link>
              </li>
            ) : null}
            <li>
              <Link href="/kontakt" className="hover:text-paper">
                Kontakt
              </Link>
            </li>
            <li>
              <Link href="/logowanie" className="hover:text-paper">
                Zaloguj się
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.14em] text-brand uppercase">
            Kontakt
          </p>
          <address className="mt-4 space-y-2 text-sm leading-relaxed text-paper/75 not-italic">
            <p>ul. Konopnickiej 13</p>
            <p>41-700 Ruda Śląska</p>
          </address>
          <p className="mt-4">
            <Link href="/kontakt" className="text-sm text-paper/75 hover:text-paper">
              Formularz kontaktowy →
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-paper/45 md:flex-row md:items-center md:justify-between md:px-8">
          <p>CKS Slavia Ruda Śląska © 2026</p>
          <p>Jakub Gawron © 2026 </p>
          <p>Dwubój olimpijski · Śląsk</p>
        </div>
      </div>
    </footer>
  );
}
