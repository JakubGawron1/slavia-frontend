"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { hasAnyRole } from "@/lib/auth";
import { PANEL_MODULES } from "@/lib/panel-nav";
import { STAFF_ROLES } from "@/lib/klub-nav";
import { usePanel } from "./PanelProvider";

export function PanelShell({ children }: { children: ReactNode }) {
  const { user, loading, error, logout } = usePanel();
  const pathname = usePathname();

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

  const isStaff = hasAnyRole(user, STAFF_ROLES);

  return (
    <div className="relative isolate min-h-[100svh] bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(200,16,46,0.16)_0%,transparent_42%),linear-gradient(165deg,#0e1014_0%,#161b22_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/10 pb-4">
          <div>
            <Link
              href="/panel"
              className="font-display text-sm tracking-[0.2em] text-brand uppercase"
            >
              Panel zawodnika
            </Link>
            <p className="mt-1 text-sm text-paper/55">{user.display_name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isStaff ? (
              <Link
                href="/klub"
                className="border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase transition-colors hover:border-brand"
              >
                Panel klubowy
              </Link>
            ) : null}
            <Link
              href="/"
              className="border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase"
            >
              Witryna
            </Link>
            <button
              type="button"
              onClick={logout}
              className="border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase"
            >
              Wyloguj
            </button>
          </div>
        </header>

        <nav
          className="mt-4 flex gap-1 overflow-x-auto border-b border-paper/10 pb-px"
          aria-label="Moduły zawodnika"
        >
          <Link
            href="/panel"
            className={
              pathname === "/panel"
                ? "shrink-0 border-b-2 border-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
                : "shrink-0 border-b-2 border-transparent px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase hover:text-paper"
            }
          >
            Pulpit
          </Link>
          {PANEL_MODULES.map((mod) => {
            const active =
              pathname === mod.href || pathname.startsWith(`${mod.href}/`);
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={
                  active
                    ? "shrink-0 border-b-2 border-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
                    : "shrink-0 border-b-2 border-transparent px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase hover:text-paper"
                }
              >
                {mod.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 md:mt-8">{children}</div>
      </div>
    </div>
  );
}
