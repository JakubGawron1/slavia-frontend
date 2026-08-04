"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { useForgotPassword } from "@/lib/api/generated/auth/auth";

export function ForgotPasswordForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useForgotPassword();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Podaj e-mail.");
      return;
    }
    try {
      await mutation.mutateAsync({ data: { email: trimmed } });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się wysłać prośby.",
      );
    }
  }

  if (done) {
    return (
      <div className="animate-rise-delay-1 w-full max-w-md space-y-4">
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm leading-relaxed text-paper/90">
          Jeśli konto z tym adresem istnieje, wysłaliśmy link do resetu hasła.
          Sprawdź skrzynkę (i folder spam).
        </p>
        <Link
          href="/logowanie"
          className="inline-block text-sm text-paper/80 underline-offset-4 hover:underline"
        >
          Wróć do logowania
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="animate-rise-delay-1 w-full max-w-md"
      noValidate
    >
      <div>
        <label
          htmlFor={emailId}
          className="font-display text-xs tracking-[0.16em] text-paper/70 uppercase"
        >
          E-mail konta
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={mutation.isPending}
          className="mt-2 w-full border border-paper/20 bg-chrome/40 px-4 py-3.5 text-paper outline-none focus:border-brand disabled:opacity-60"
          placeholder="twoj@email.pl"
        />
      </div>
      {error ? (
        <p role="alert" className="mt-5 border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm text-paper/90">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-8 w-full bg-brand px-6 py-3.5 font-display text-sm tracking-[0.14em] text-paper uppercase hover:bg-brand-deep disabled:opacity-70"
      >
        {mutation.isPending ? "Wysyłanie…" : "Wyślij link resetu"}
      </button>
      <p className="mt-6 text-sm text-paper/55">
        <Link href="/logowanie" className="underline-offset-4 hover:underline">
          Wróć do logowania
        </Link>
      </p>
    </form>
  );
}
