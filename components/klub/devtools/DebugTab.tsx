import { useState, type FormEvent } from "react";
import { getApiBaseUrl, getStoredToken } from "@/lib/auth";
import { useToast } from "@/components/toast/ToastProvider";
import type { AuthUser, Role } from "@/lib/auth";
import type { ViewAsState } from "@/components/klub/KlubProvider";

function TestEmailPanel({
  defaultEmail,
  onError,
}: {
  defaultEmail: string;
  onError: (msg: string | null) => void;
}) {
  const toast = useToast();
  const [email, setEmail] = useState(defaultEmail);
  const [pending, setPending] = useState(false);
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
    setPending(true);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Brak sesji.");
      const response = await fetch(
        `${getApiBaseUrl()}/api/admin/debug/send-test-email`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: trimmed }),
        },
      );
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        delivered?: boolean;
        to?: string;
      };
      if (!response.ok) {
        throw new Error(body.error ?? `Błąd serwera (${response.status})`);
      }
      const msg = body.message ?? `Wysłano na ${body.to ?? trimmed}`;
      setResult(msg);
      toast.success("Test e-mail", msg);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wysłać testu.";
      onError(msg);
      toast.error("Test e-mail", msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Test e-mail (Brevo)
      </h2>
      <p className="mt-2 text-sm text-paper/55">
        Wysyła prostą wiadomość testową przez Brevo (flaga{" "}
        <span className="font-mono text-paper/70">email_test</span>).{" "}
        <span className="font-mono text-paper/70">EMAIL_FROM</span> musi być
        zweryfikowanym senderem w Brevo (bez domeny zwykle Twój Gmail z konta).
        Przy <span className="font-mono text-paper/70">EMAIL_ENABLED=false</span>{" "}
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

type DebugTabProps = {
  apiBaseUrl: string;
  health: string;
  activeRole: Role;
  viewAs: ViewAsState;
  user: AuthUser | null;
  storedUser: AuthUser | null;
  tokenPresent: boolean;
  platformVersion: string;
  onError: (msg: string | null) => void;
};

export function DebugTab({
  apiBaseUrl,
  health,
  activeRole,
  viewAs,
  user,
  storedUser,
  tokenPresent,
  platformVersion,
  onError,
}: DebugTabProps) {
  return (
    <div className="space-y-6">
      <pre className="overflow-x-auto border border-paper/10 bg-chrome/50 p-4 text-xs leading-relaxed text-paper/75">
        {JSON.stringify(
          {
            api: apiBaseUrl,
            health,
            activeRole,
            viewAs,
            user: user ?? storedUser,
            tokenPresent,
            platformVersion,
          },
          null,
          2,
        )}
      </pre>

      <TestEmailPanel
        defaultEmail={user?.email ?? storedUser?.email ?? ""}
        onError={onError}
      />
    </div>
  );
}
