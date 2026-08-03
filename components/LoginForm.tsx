"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { hasAnyRole, loginRequest, establishSession } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/klub-nav";

type FormState = "idle" | "submitting" | "error";

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const mountedRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setState("error");
      setError("Podaj e-mail i hasło.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState("error");
      setError("Podaj poprawny adres e-mail.");
      return;
    }

    setState("submitting");

    try {
      const result = await loginRequest(trimmedEmail, password);
      if (!mountedRef.current) return;
      await establishSession(
        result.token,
        result.user,
        result.expires_in_hours,
      );
      if (!mountedRef.current) return;
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      const dest =
        safeNext ??
        (hasAnyRole(result.user, STAFF_ROLES) ? "/klub" : "/panel");
      router.push(dest);
      router.refresh();
    } catch (err) {
      if (!mountedRef.current) return;
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się zalogować. Sprawdź dane i czy backend działa.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-rise-delay-1 w-full max-w-md"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor={emailId}
            className="font-display text-xs tracking-[0.16em] text-paper/70 uppercase"
          >
            E-mail
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "submitting"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="mt-2 w-full border border-paper/20 bg-chrome/40 px-4 py-3.5 text-paper outline-none transition-[border-color,background-color] placeholder:text-paper/35 focus:border-brand focus:bg-chrome/60 disabled:opacity-60"
            placeholder="superadmin@cks-slavia.local"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor={passwordId}
              className="font-display text-xs tracking-[0.16em] text-paper/70 uppercase"
            >
              Hasło
            </label>
            <button
              type="button"
              className="text-xs text-paper/55 transition-colors hover:text-paper"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Ukryj" : "Pokaż"}
            </button>
          </div>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={state === "submitting"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="mt-2 w-full border border-paper/20 bg-chrome/40 px-4 py-3.5 text-paper outline-none transition-[border-color,background-color] placeholder:text-paper/35 focus:border-brand focus:bg-chrome/60 disabled:opacity-60"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-5 border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm leading-relaxed text-paper/90"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-8 w-full bg-brand px-6 py-3.5 font-display text-sm tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
      >
        {state === "submitting" ? "Logowanie…" : "Zaloguj się"}
      </button>

      <p className="mt-6 text-sm leading-relaxed text-paper/55">
        Nie masz konta? Dostęp nadaje trener lub administrator klubu.{" "}
        <Link
          href="/"
          className="text-paper/80 underline-offset-4 hover:text-paper hover:underline"
        >
          Wróć na stronę główną
        </Link>
      </p>
    </form>
  );
}
