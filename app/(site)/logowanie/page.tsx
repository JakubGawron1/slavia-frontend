import type { Metadata } from "next";
import { ClubMark } from "@/components/ClubMark";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Logowanie",
  description:
    "Zaloguj się do strefy klubowej CKS Slavia Ruda Śląska — dostęp dla zawodników, trenerów i administratorów.",
};

export default function LoginPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-chrome text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(200,16,46,0.22)_0%,transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(74,85,96,0.35)_0%,transparent_50%),linear-gradient(160deg,#0e1014_0%,#1a1f26_55%,#12151a_100%)]"
        aria-hidden="true"
      />
      <div
        className="texture-noise pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl lg:grid-cols-2">
        <div className="flex flex-col justify-end px-5 pb-10 pt-28 md:px-8 lg:pb-24 lg:pt-32">
          <div className="animate-rise">
            <ClubMark className="h-12 w-12 text-brand" />
            <p className="mt-8 font-display text-sm tracking-[0.28em] text-brand uppercase">
              Strefa klubowa
            </p>
            <div className="animate-bar mt-4 h-1 w-20 bg-brand" />
            <h1 className="mt-6 max-w-md font-display text-4xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-5xl md:text-6xl">
              Logowanie
              <span className="mt-2 block text-paper/55">do systemu</span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-paper/70">
              Wejdź jako zawodnik, trener lub administrator — wyniki, treningi
              i zarządzanie klubem w jednym miejscu.
            </p>
          </div>

          <ul className="mt-10 hidden gap-8 border-t border-paper/10 pt-8 text-sm text-paper/50 lg:flex">
            <li>
              <span className="block font-display tracking-[0.12em] text-paper/80 uppercase">
                Zawodnik
              </span>
              Wyniki i rekordy
            </li>
            <li>
              <span className="block font-display tracking-[0.12em] text-paper/80 uppercase">
                Trener
              </span>
              Skład i starty
            </li>
            <li>
              <span className="block font-display tracking-[0.12em] text-paper/80 uppercase">
                Admin
              </span>
              Zarządzanie
            </li>
          </ul>
        </div>

        <div className="flex items-center border-t border-paper/10 px-5 py-12 md:px-8 lg:border-t-0 lg:border-l lg:border-paper/10 lg:px-12 lg:py-24">
          <div className="w-full">
            <p className="animate-rise font-display text-sm tracking-[0.18em] text-paper/60 uppercase">
              Zaloguj się
            </p>
            <h2 className="animate-rise mt-2 font-display text-2xl tracking-wide text-paper uppercase md:text-3xl">
              Twoje konto klubowe
            </h2>
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
