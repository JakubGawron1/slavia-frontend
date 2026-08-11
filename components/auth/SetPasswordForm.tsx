"use client";

import Link from "next/link";
import { FormEvent, useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompleteInvite } from "@/lib/api/generated/auth/auth";

export function SetPasswordForm() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token")?.trim() ?? "", [params]);
  const passwordId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useCompleteInvite();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Brak tokenu w linku. Poproś admina o ponowne utworzenie konta lub nowy link.");
      return;
    }
    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (password !== confirm) {
      setError("Hasła nie są zgodne.");
      return;
    }
    try {
      await mutation.mutateAsync({
        data: { token, new_password: password },
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się aktywować konta.",
      );
    }
  }

  if (done) {
    return (
      <div className="animate-rise-delay-1 w-full max-w-md space-y-4">
        <p className="border-l-2 border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-paper/90">
          E-mail potwierdzony, hasło ustawione. Możesz się zalogować.
        </p>
        <Link
          href="/logowanie"
          className="inline-block bg-brand px-6 py-3 font-display text-sm tracking-[0.14em] text-paper uppercase"
        >
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="animate-rise-delay-1 w-full max-w-md space-y-5"
      noValidate
    >
      {!token ? (
        <p role="alert" className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm">
          Link jest niekompletny. Użyj odnośnika z e-maila zaproszenia.
        </p>
      ) : null}
      <div>
        <label
          htmlFor={passwordId}
          className="font-display text-xs tracking-[0.16em] text-paper/70 uppercase"
        >
          Hasło
        </label>
        <input
          id={passwordId}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={mutation.isPending || !token}
          minLength={6}
          className="mt-2 w-full border border-paper/20 bg-chrome/40 px-4 py-3.5 text-paper outline-none focus:border-brand disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor={confirmId}
          className="font-display text-xs tracking-[0.16em] text-paper/70 uppercase"
        >
          Potwierdź hasło
        </label>
        <input
          id={confirmId}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={mutation.isPending || !token}
          minLength={6}
          className="mt-2 w-full border border-paper/20 bg-chrome/40 px-4 py-3.5 text-paper outline-none focus:border-brand disabled:opacity-60"
        />
      </div>
      {error ? (
        <p role="alert" className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending || !token}
        className="w-full bg-brand px-6 py-3.5 font-display text-sm tracking-[0.14em] text-paper uppercase hover:bg-brand-deep disabled:opacity-70"
      >
        {mutation.isPending ? "Zapisywanie…" : "Potwierdź i ustaw hasło"}
      </button>
    </form>
  );
}
