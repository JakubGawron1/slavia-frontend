"use client";

import { FormEvent, useState } from "react";
import { useRequestEmailVerification } from "@/lib/api/generated/auth/auth";
import type { AuthUser } from "@/lib/auth";
import { getStoredToken, storeSession } from "@/lib/auth";
import { useToast } from "@/components/toast/ToastProvider";

type Props = {
  user: AuthUser;
  onUpdated: (user: AuthUser) => void | Promise<void>;
};

export function needsEmailVerification(user: AuthUser): boolean {
  return user.email_verified !== true;
}

/**
 * Bramka po pierwszym logowaniu — potwierdź e-mail lub podaj inny adres.
 */
export function EmailVerificationGate({ user, onUpdated }: Props) {
  const toast = useToast();
  const mutation = useRequestEmailVerification();
  const [email, setEmail] = useState(user.pending_email ?? user.email);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      const sameAsCurrent = trimmed === user.email.toLowerCase();
      const result = await mutation.mutateAsync({
        data: sameAsCurrent ? { email: null } : { email: trimmed },
      });
      const updated = result.data as AuthUser;
      const token = getStoredToken();
      if (token) storeSession(token, updated);
      await onUpdated(updated);
      if (updated.email_verified) {
        toast.success("E-mail zweryfikowany.");
        return;
      }
      setSent(true);
      toast.success("Wysłaliśmy link weryfikacyjny.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wysłać weryfikacji.";
      setError(msg);
      toast.error("Weryfikacja e-mail", msg);
    }
  }

  const field =
    "w-full border border-paper/20 bg-chrome/40 px-4 py-3 text-sm text-paper outline-none focus:border-brand";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-chrome/90 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-verify-title"
        className="w-full max-w-md border border-paper/15 bg-chrome p-6 shadow-xl md:p-8"
      >
        <p className="font-display text-[10px] tracking-[0.16em] text-brand uppercase">
          Weryfikacja konta
        </p>
        <h2
          id="email-verify-title"
          className="mt-2 font-display text-2xl tracking-wide text-paper uppercase"
        >
          Potwierdź adres e-mail
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-paper/65">
          Aby otrzymywać powiadomienia klubowe, potwierdź adres nadany przez
          kadrę albo podaj swój prawdziwy e-mail.
        </p>

        {sent ? (
          <p className="mt-5 border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-paper">
            Sprawdź skrzynkę ({email.trim()}) i kliknij link w wiadomości. Możesz
            zamknąć tę kartę po potwierdzeniu — odśwież stronę.
          </p>
        ) : null}

        <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="verify-email"
              className="mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase"
            >
              Adres e-mail
            </label>
            <input
              id="verify-email"
              type="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={mutation.isPending}
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-brand">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-brand px-4 py-3 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep disabled:opacity-60"
          >
            {mutation.isPending
              ? "Wysyłanie…"
              : sent
                ? "Wyślij ponownie"
                : "Wyślij link weryfikacyjny"}
          </button>
        </form>
      </div>
    </div>
  );
}
