"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorScene } from "@/components/error/ErrorScene";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScene
      code="ERR"
      eyebrow="Zerwanie techniczne"
      title="Aplikacja nie zablokowała łokci"
      joke="Przy ostatnim powtórzeniu coś strzeliło — nie pas, nie gryf, tylko ten ekran. Trener mówi krótko: reset i drugie podejście. Rwanie i podrzut poczekają."
      hint="Spróbuj ponowić, a jeśli błąd wraca jak kontuzja barku — daj znać adminowi sali."
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
            Drugie podejście
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
  );
}
