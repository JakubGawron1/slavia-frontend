"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useKlub } from "./KlubProvider";
import { KlubNav } from "./KlubNav";

export function KlubShell({ children }: { children: ReactNode }) {
  const {
    user,
    loading,
    error,
    viewAs,
    clearViewAs,
    logout,
    setMobileNavOpen,
  } = useKlub();

  if (loading && !user) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink text-paper/60">
        Ładowanie panelu…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink text-paper/60">
        {error ?? "Brak sesji."}
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-[100svh] bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(200,16,46,0.14)_0%,transparent_40%),linear-gradient(160deg,#0e1014_0%,#151a21_100%)]"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[100svh] w-full">
        <KlubNav />

        <div className="flex min-w-0 flex-1 flex-col">
          {viewAs ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-sm">
              <p>
                Tryb podglądu:{" "}
                <span className="font-medium text-paper">
                  {viewAs.displayName}
                </span>{" "}
                <span className="text-paper/55">({viewAs.email})</span>
              </p>
              <button
                type="button"
                onClick={clearViewAs}
                className="border border-paper/30 px-3 py-1 font-display text-[11px] tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
              >
                Zakończ podgląd
              </button>
            </div>
          ) : null}

          <header className="flex items-center justify-between gap-3 border-b border-paper/10 px-4 py-3 lg:px-6">
            <button
              type="button"
              className="border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              Menu
            </button>
            <div className="hidden text-sm text-paper/50 lg:block">
              Panel klubowy
            </div>
            <div className="flex items-center gap-2">
              {user.roles.includes("superadmin") ? (
                <Link
                  href="/panel"
                  className="border border-brand/40 bg-brand/10 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/20"
                >
                  Panel zawodnika
                </Link>
              ) : null}
              <Link
                href="/"
                className="border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase transition-colors hover:border-paper/40 hover:text-paper"
              >
                Witryna
              </Link>
              <button
                type="button"
                onClick={logout}
                className="border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase transition-colors hover:border-brand hover:text-paper"
              >
                Wyloguj
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-x-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
