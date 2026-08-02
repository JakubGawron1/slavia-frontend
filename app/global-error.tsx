"use client";

import { Outfit, Public_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import { ErrorScene } from "@/components/error/ErrorScene";
import "./globals.css";

const display = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const body = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pl" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ErrorScene
          code="HALA"
          eyebrow="Awaria całej sali"
          title="Platforma padła jak przy zbyt ciężkim rwaniu"
          joke="Krytyczny błąd — jak pęknięty gryf w środku serii. Cała hala poszła w dół, a sędziowie nawet nie zdążyli podnieść flag. Resetujemy platformę i wracamy do treningu."
          hint="To błąd na poziomie root layoutu. Po resecie wrócisz na salę; jeśli nie — trzeba wezwać ekipę techniczną."
          technical={{
            message: error.message,
            digest: error.digest,
          }}
          actions={
            <>
              <button
                type="button"
                onClick={reset}
                className="bg-brand px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep"
              >
                Reset platformy
              </button>
              <Link
                href="/"
                className="border border-paper/40 px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/10"
              >
                Wróć na pomost
              </Link>
            </>
          }
        />
      </body>
    </html>
  );
}
