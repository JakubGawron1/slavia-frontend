"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import {
  EXPERIMENTAL_PANEL_THEMES_FLAG,
  getPanelTheme,
  resolvePanelTheme,
} from "@/lib/panel-themes";
import { isFlagEnabled } from "@/lib/public-flags";
import { LoadingScene } from "@/components/loading/LoadingScene";
import { NotificationBell } from "@/components/notifications/NotificationBell";
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

  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const allowExperimental = isFlagEnabled(
    flagsQuery.data?.data ?? [],
    EXPERIMENTAL_PANEL_THEMES_FLAG,
  );
  const theme = resolvePanelTheme(user?.ui_theme, { allowExperimental });
  const layout = getPanelTheme(theme).layout;
  const experimentalLayout = layout !== "standard";

  if (loading && !user) {
    return (
      <LoadingScene
        label="Panel klubowy"
        hint="Sprawdzamy sesję i przygotowujemy pomost…"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-chrome text-paper/60">
        {error ?? "Brak sesji."}
      </div>
    );
  }

  return (
    <div
      data-panel-theme={theme}
      data-panel-layout={layout}
      className="relative isolate flex h-[100svh] overflow-hidden bg-chrome text-paper"
    >
      <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
        className={
          experimentalLayout
            ? "klub-shell-frame relative flex h-full min-h-0 w-full"
            : "relative flex h-full min-h-0 w-full"
        }
      >
        <KlubNav />

        <div
          className={
            experimentalLayout
              ? "klub-main-well flex min-h-0 min-w-0 flex-1 flex-col"
              : "flex min-h-0 min-w-0 flex-1 flex-col"
          }
        >
          {viewAs ? (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-sm">
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
                className="panel-control border border-paper/30 px-3 py-1 font-display text-[11px] tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
              >
                Zakończ podgląd
              </button>
            </div>
          ) : null}

          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-paper/10 px-4 py-3 lg:px-6">
            <button
              type="button"
              className="panel-control border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              Menu
            </button>
            <div className="hidden text-sm text-paper/50 lg:block">
              Panel klubowy
              {experimentalLayout ? (
                <span className="ml-2 text-paper/35">· eksperymentalny</span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              {user.roles.includes("superadmin") ? (
                <Link
                  href="/panel"
                  className="panel-control border border-brand/40 bg-brand/10 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/20"
                >
                  Panel zawodnika
                </Link>
              ) : null}
              <Link
                href="/"
                className="panel-control border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase transition-colors hover:border-paper/40 hover:text-paper"
              >
                Witryna
              </Link>
              <button
                type="button"
                onClick={logout}
                className="panel-control border border-paper/15 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] text-paper/70 uppercase transition-colors hover:border-brand hover:text-paper"
              >
                Wyloguj
              </button>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
