import type { Metadata } from "next";
import Link from "next/link";
import { ErrorScene } from "@/components/error/ErrorScene";

export const metadata: Metadata = {
  title: "404 — nie ma na pomoście",
};

export default function NotFound() {
  return (
    <ErrorScene
      code="404"
      eyebrow="Nieudane podejście"
      title="Tej strony nie ma na pomoście"
      joke="Sędziowie pokazali trzy czerwone. Albo ktoś przestawił obciążenie i adres wyleciał poza protokół zawodów — nawet kalkulator Sinclair tego nie uratuje."
      hint="Sprawdź adres albo wróć do bazy treningowej. Następne podejście za chwilę."
      actions={
        <>
          <Link
            href="/"
            className="bg-brand px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep"
          >
            Wróć na pomost
          </Link>
          <Link
            href="/kalendarz"
            className="border border-paper/40 px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/10"
          >
            Kalendarz treningów
          </Link>
        </>
      }
    />
  );
}
