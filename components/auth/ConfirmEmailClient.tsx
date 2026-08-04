"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useConfirmEmail } from "@/lib/api/generated/auth/auth";
import { fetchMe, getStoredToken, storeSession } from "@/lib/auth";

export function ConfirmEmailClient() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token")?.trim() ?? "", [params]);
  const mutation = useConfirmEmail();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || status !== "idle") return;
    let cancelled = false;
    (async () => {
      try {
        await mutation.mutateAsync({ data: { token } });
        if (cancelled) return;
        const auth = getStoredToken();
        if (auth) {
          try {
            const me = await fetchMe(auth);
            storeSession(auth, me);
          } catch {
            /* ignore */
          }
        }
        setStatus("ok");
        setMessage("Adres e-mail został potwierdzony.");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Nie udało się potwierdzić e-maila.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per token
  }, [token]);

  return (
    <div className="animate-rise-delay-1 w-full max-w-md space-y-4">
      {!token ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm">
          Brak tokenu w linku.
        </p>
      ) : status === "idle" ? (
        <p className="text-sm text-paper/70">Potwierdzamy adres e-mail…</p>
      ) : (
        <p
          className={`border-l-2 px-4 py-3 text-sm ${
            status === "ok"
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-brand bg-brand/10"
          }`}
        >
          {message}
        </p>
      )}
      <Link
        href="/logowanie"
        className="inline-block text-sm text-paper/80 underline-offset-4 hover:underline"
      >
        Przejdź do logowania
      </Link>
    </div>
  );
}
