import Link from "next/link";
import { SLAVIA_VERSION } from "@/lib/version";
import { ClubMark } from "./ClubMark";
import { FooterCookieButton } from "./FooterCookieButton";
import { FooterNav } from "./FooterNav";

/** Server Component — wersja z `lib/version.ts` zawsze zgodna z SSR (bez stale client bundle). */
export function Footer() {
  return (
    <footer className="bg-chrome text-paper">
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
          <FooterNav />
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
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-paper/45 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8">
          <p>CKS Slavia Ruda Śląska © 2026</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/polityka-prywatnosci" className="hover:text-paper">
              Polityka prywatności
            </Link>
            <FooterCookieButton />
            <span
              className="font-mono text-paper/35"
              title="Wersja platformy (Slavia.toml)"
            >
              v{SLAVIA_VERSION}
            </span>
          </div>
          <p>Jakub Gawron © 2026</p>
        </div>
      </div>
    </footer>
  );
}
