"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/toast/ToastProvider";
import { useSendTestEmail } from "@/lib/api/generated/admin/admin";

export function TestEmailPanel({
  defaultEmail,
  onError,
}: {
  defaultEmail: string;
  onError: (msg: string | null) => void;
}) {
  const toast = useToast();
  const sendMutation = useSendTestEmail();
  const [email, setEmail] = useState(defaultEmail);
  const [result, setResult] = useState<string | null>(null);

  async function sendTest(e: FormEvent) {
    e.preventDefault();
    onError(null);
    setResult(null);
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      onError("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      const response = await sendMutation.mutateAsync({
        data: { email: trimmed },
      });
      if (response.status < 200 || response.status >= 300) {
        const errBody = response.data as { error?: string };
        throw new Error(errBody.error ?? `Błąd serwera (${response.status})`);
      }
      const body = response.data as {
        message?: string;
        to?: string;
        delivered?: boolean;
      };
      const msg = body.message ?? `Wysłano na ${body.to ?? trimmed}`;
      setResult(msg);
      toast.success("Test e-mail", msg);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wysłać testu.";
      onError(msg);
      toast.error("Test e-mail", msg);
    }
  }

  const pending = sendMutation.isPending;

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Test e-mail (Brevo)
      </h2>
      <p className="mt-2 text-sm text-paper/55">
        Wysyła prostą wiadomość testową przez Brevo (flaga{" "}
        <span className="font-mono text-paper/70">email_test</span>).{" "}
        <span className="font-mono text-paper/70">EMAIL_FROM</span> musi być
        zweryfikowanym senderem w Brevo. Przy{" "}
        <span className="font-mono text-paper/70">EMAIL_ENABLED=false</span>{" "}
        backend tylko loguje treść.
      </p>
      <form
        onSubmit={(ev) => void sendTest(ev)}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="debug-test-email"
            className="mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase"
          >
            Adres odbiorcy
          </label>
          <input
            id="debug-test-email"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            disabled={pending}
            required
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm text-paper outline-none focus:border-brand disabled:opacity-60"
            placeholder="twoj@email.pl"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:opacity-50"
        >
          {pending ? "Wysyłanie…" : "Wyślij test"}
        </button>
      </form>
      {result ? (
        <p className="mt-3 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-paper">
          {result}
        </p>
      ) : null}
    </section>
  );
}
