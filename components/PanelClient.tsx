"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  hasAnyRole,
  storeSession,
  type AuthUser,
  type Role,
} from "@/lib/auth";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { ROLE_LABELS, STAFF_ROLES } from "@/lib/klub-nav";
import { isFlagEnabled, PUBLIC_CALENDAR_FLAG } from "@/lib/public-flags";

export function PanelClient() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getStoredToken();
      if (!token) {
        router.replace("/logowanie");
        return;
      }

      const cached = getStoredUser();
      if (cached && !cancelled) {
        setUser(cached);
      }

      try {
        const me = await fetchMe(token);
        if (cancelled) return;
        storeSession(token, me);
        setUser(me);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        clearSession();
        setError(err instanceof Error ? err.message : "Sesja wygasła.");
        router.replace("/logowanie");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  function logout() {
    clearSession();
    router.push("/logowanie");
  }

  if (loading && !user) {
    return (
      <p className="text-paper/60" aria-live="polite">
        Ładowanie panelu…
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-paper/60" role="alert">
        {error ?? "Brak sesji."}
      </p>
    );
  }

  const isStaff = hasAnyRole(user, STAFF_ROLES);
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const calendarEnabled = isFlagEnabled(
    flagsQuery.data?.data,
    PUBLIC_CALENDAR_FLAG,
  );

  return (
    <div className="w-full max-w-2xl">
      <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
        Strefa klubowa
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight uppercase md:text-5xl">
        Cześć, {user.display_name}
      </h1>
      <p className="mt-3 text-paper/70">{user.email}</p>

      <div className="mt-8">
        <p className="font-display text-xs tracking-[0.16em] text-paper/50 uppercase">
          Twoje role
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {user.roles.map((role: Role) => (
            <li
              key={role}
              className="border border-brand/40 bg-brand/15 px-3 py-1.5 font-display text-sm tracking-[0.1em] text-paper uppercase"
            >
              {ROLE_LABELS[role] ?? role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {isStaff ? (
          <Link
            href="/klub"
            className="bg-brand px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:bg-brand-deep"
          >
            Panel klubowy
          </Link>
        ) : null}
        {user.roles.includes("zawodnik") || user.roles.includes("superadmin") ? (
          <Link
            href="/panel"
            className="border border-brand/50 bg-brand/15 px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:bg-brand/25"
          >
            Panel zawodnika
          </Link>
        ) : null}
        {calendarEnabled ? (
          <Link
            href="/kalendarz"
            className="border border-paper/30 px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
          >
            Kalendarz
          </Link>
        ) : null}
        <button
          type="button"
          onClick={logout}
          className="border border-paper/30 px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
        >
          Wyloguj
        </button>
      </div>
    </div>
  );
}
