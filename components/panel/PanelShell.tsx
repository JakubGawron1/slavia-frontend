"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { hasAnyRole } from "@/lib/auth";
import { PANEL_MODULES, PANEL_SETTINGS } from "@/lib/panel-nav";
import {
  EXPERIMENTAL_PANEL_THEMES_FLAG,
  getPanelTheme,
  resolvePanelTheme,
  type PanelThemeId,
} from "@/lib/panel-themes";
import { isFlagEnabled } from "@/lib/public-flags";
import { LoadingScene } from "@/components/loading/LoadingScene";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { STAFF_ROLES } from "@/lib/klub-nav";
import { usePanel } from "./PanelProvider";

function useResolvedPanelTheme(raw?: string | null): PanelThemeId {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const allowExperimental = isFlagEnabled(
    flagsQuery.data?.data ?? [],
    EXPERIMENTAL_PANEL_THEMES_FLAG,
  );
  return resolvePanelTheme(raw, { allowExperimental });
}

function useVisiblePanelModules() {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  return PANEL_MODULES.filter(
    (mod) => !mod.flag || isFlagEnabled(flags, mod.flag),
  );
}

export function PanelShell({ children }: { children: ReactNode }) {
  const { user, actor, viewAs, loading, error, logout, clearViewAs } = usePanel();
  const pathname = usePathname();
  const theme = useResolvedPanelTheme(user?.ui_theme);
  const layout = getPanelTheme(theme).layout;
  const wideContent = pathname.startsWith("/panel/kalendarz");
  const contentMax = wideContent ? "max-w-[96rem]" : "max-w-6xl";
  const effectiveRoles = user?.roles ?? [];
  const isSuperadmin = effectiveRoles.includes("superadmin");
  const modules = useVisiblePanelModules().filter(
    (mod) => !(isSuperadmin && mod.href === "/panel/co-nowego"),
  );

  if (loading && !user) {
    return (
      <LoadingScene
        label="Panel zawodnika"
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

  const staffSource = actor ?? user;
  const isStaff = hasAnyRole(staffSource, STAFF_ROLES);

  const previewBanner = viewAs ? (
    <div className="relative z-50 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-sm">
      <p>
        Tryb podglądu:{" "}
        <span className="font-medium text-paper">{viewAs.displayName}</span>{" "}
        <span className="text-paper/55">({viewAs.email})</span>
        <span className="ml-2 text-paper/45">· tylko odczyt</span>
      </p>
      <button
        type="button"
        onClick={() => void clearViewAs()}
        className="panel-control border border-paper/30 px-3 py-1 font-display text-[11px] tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
      >
        Zakończ podgląd
      </button>
    </div>
  ) : null;

  const actions = (bellVariant: "default" | "onBrand" = "default") => (
    <div className="flex max-w-full flex-wrap items-center justify-end gap-1.5 sm:gap-2">
      <NotificationBell variant={bellVariant} />
      {isStaff ? (
        <Link
          href="/klub"
          className="panel-control border border-paper/20 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] uppercase transition-colors hover:border-brand sm:px-3 sm:text-[11px]"
        >
          <span className="sm:hidden">Klub</span>
          <span className="hidden sm:inline">Panel klubowy</span>
        </Link>
      ) : null}
      <Link
        href="/"
        className="panel-control border border-paper/15 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] text-paper/70 uppercase sm:px-3 sm:text-[11px]"
      >
        Witryna
      </Link>
      <button
        type="button"
        onClick={logout}
        className="panel-control border border-paper/15 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] text-paper/70 uppercase sm:px-3 sm:text-[11px]"
      >
        Wyloguj
      </button>
    </div>
  );

  const navItems = [
    { href: "/panel", label: "Pulpit", exact: true },
    ...modules.map((mod) => ({
      href: mod.href,
      label: mod.label,
      exact: false,
    })),
    {
      href: PANEL_SETTINGS.href,
      label: PANEL_SETTINGS.label,
      exact: false,
    },
  ];

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function wrap(node: ReactNode) {
    if (!previewBanner) return node;
    return (
      <div className="flex min-h-[100svh] flex-col">
        {previewBanner}
        <div className="min-h-0 flex-1">{node}</div>
      </div>
    );
  }

  if (layout === "studio") {
    return wrap(
      <div
        data-panel-theme={theme}
        data-panel-layout={layout}
        className="relative isolate flex min-h-[100svh] bg-chrome text-paper"
      >
        <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <aside className="relative z-10 flex w-[4.75rem] shrink-0 flex-col border-r border-paper/10 bg-chrome/70 py-4 md:w-52 md:px-3">
          <Link
            href="/panel"
            className="px-2 font-display text-[10px] tracking-[0.18em] text-brand uppercase md:px-3 md:text-sm md:tracking-[0.2em]"
          >
            <span className="md:hidden">CKS</span>
            <span className="hidden md:inline">Panel zawodnika</span>
          </Link>
          <p className="mt-2 hidden truncate px-3 text-xs text-paper/50 md:block">
            {user.display_name}
          </p>
          <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Moduły zawodnika">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={
                    active
                      ? "rounded-[var(--panel-radius-sm)] bg-brand/15 px-2 py-2.5 text-center font-display text-[10px] tracking-[0.1em] text-paper uppercase md:px-3 md:text-left md:text-[11px]"
                      : "rounded-[var(--panel-radius-sm)] px-2 py-2.5 text-center font-display text-[10px] tracking-[0.1em] text-paper/45 uppercase transition-colors hover:bg-paper/5 hover:text-paper md:px-3 md:text-left md:text-[11px]"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 hidden flex-col gap-2 px-1 md:flex">{actions()}</div>
        </aside>
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-paper/10 px-3 py-3 sm:px-4 md:px-6">
            <p className="min-w-0 truncate text-sm text-paper/55 md:hidden">
              {user.display_name}
            </p>
            <div className="ml-auto min-w-0 max-w-full md:hidden">{actions()}</div>
            <p className="hidden text-sm text-paper/45 md:block">
              Układ Studio · eksperymentalny
            </p>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className={`settings-surface mx-auto ${contentMax} rounded-[var(--panel-radius)] border border-paper/10 bg-chrome/40 p-4 shadow-[var(--panel-elev)] md:p-6`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (layout === "dock") {
    return wrap(
      <div
        data-panel-theme={theme}
        data-panel-layout={layout}
        className="relative isolate flex min-h-[100svh] flex-col bg-chrome text-paper"
      >
        <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className={`relative z-10 mx-auto flex w-full ${contentMax} flex-1 flex-col px-4 pb-28 pt-5 md:px-6`}>
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--panel-radius)] border border-paper/10 bg-chrome/55 px-4 py-3 shadow-[var(--panel-elev)]">
            <div>
              <Link
                href="/panel"
                className="font-display text-sm tracking-[0.2em] text-brand uppercase"
              >
                Panel zawodnika
              </Link>
              <p className="mt-1 text-sm text-paper/55">{user.display_name}</p>
            </div>
            {actions()}
          </header>
          <div className="mt-4 flex-1 rounded-[var(--panel-radius)] border border-paper/10 bg-chrome/45 p-4 shadow-[var(--panel-elev)] md:p-6">
            {children}
          </div>
        </div>
        <nav
          className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 pt-2"
          aria-label="Moduły zawodnika"
        >
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto rounded-[var(--panel-radius)] border border-paper/15 bg-chrome/90 p-1.5 shadow-[var(--panel-elev)] backdrop-blur-md">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "shrink-0 rounded-[var(--panel-radius-pill)] bg-brand px-3 py-2.5 font-display text-[10px] tracking-[0.1em] text-paper uppercase"
                      : "shrink-0 rounded-[var(--panel-radius-pill)] px-3 py-2.5 font-display text-[10px] tracking-[0.1em] text-paper/50 uppercase transition-colors hover:bg-paper/5 hover:text-paper"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  if (layout === "frame") {
    return wrap(
      <div
        data-panel-theme={theme}
        data-panel-layout={layout}
        className="relative isolate min-h-[100svh] bg-chrome text-paper"
      >
        <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className={`relative z-10 mx-auto ${contentMax} p-3 md:p-5`}>
          <div className="rounded-[var(--panel-radius)] border-2 border-paper/20 bg-chrome/60 p-3 shadow-[var(--panel-elev)] md:p-5">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-brand/40 pb-4">
              <div>
                <Link
                  href="/panel"
                  className="font-display text-sm tracking-[0.2em] text-brand uppercase"
                >
                  Panel zawodnika
                </Link>
                <p className="mt-1 text-sm text-paper/55">{user.display_name}</p>
              </div>
              {actions()}
            </header>
            <nav className="mt-4 flex flex-wrap gap-2" aria-label="Moduły zawodnika">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "rounded-[var(--panel-radius-sm)] border-2 border-brand bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.1em] text-paper uppercase"
                        : "rounded-[var(--panel-radius-sm)] border-2 border-paper/15 px-3 py-2 font-display text-[11px] tracking-[0.1em] text-paper/50 uppercase transition-colors hover:border-paper/35 hover:text-paper"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-5 rounded-[var(--panel-radius-sm)] border border-paper/10 bg-chrome/40 p-4 md:p-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "ribbon") {
    return wrap(
      <div
        data-panel-theme={theme}
        data-panel-layout={layout}
        className="relative isolate min-h-[100svh] bg-chrome text-paper"
      >
        <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10">
          <div className="border-b border-paper/10 bg-brand px-4 py-3 md:px-6">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
              <div>
                <Link
                  href="/panel"
                  className="font-display text-sm tracking-[0.2em] text-paper uppercase"
                >
                  Panel zawodnika
                </Link>
                <p className="mt-1 text-sm text-paper/80">{user.display_name}</p>
              </div>
              <div className="[&_a.panel-control]:border-paper/30 [&_a.panel-control]:text-paper [&_button.panel-control]:border-paper/30 [&_button.panel-control]:text-paper">
                {actions("onBrand")}
              </div>
            </div>
          </div>
          <nav
            className="border-b border-paper/10 bg-chrome/80 px-4 py-3 md:px-6"
            aria-label="Moduły zawodnika"
          >
            <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "shrink-0 rounded-[var(--panel-radius-pill)] bg-surface px-4 py-2 font-display text-[11px] tracking-[0.1em] text-ink uppercase"
                        : "shrink-0 rounded-[var(--panel-radius-pill)] bg-paper/10 px-4 py-2 font-display text-[11px] tracking-[0.1em] text-paper/60 uppercase transition-colors hover:bg-paper/15 hover:text-paper"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className={`mx-auto ${contentMax} px-4 py-6 md:px-6 md:py-8`}>{children}</div>
        </div>
      </div>
    );
  }

  const capsule = layout === "capsule";
  const tabClass = (active: boolean) =>
    capsule
      ? active
        ? "shrink-0 rounded-[var(--panel-radius-pill)] bg-brand px-3.5 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
        : "shrink-0 rounded-[var(--panel-radius-pill)] px-3.5 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase transition-colors hover:bg-paper/10 hover:text-paper"
      : active
        ? "shrink-0 border-b-2 border-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
        : "shrink-0 border-b-2 border-transparent px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase hover:text-paper";

  return wrap(
    <div
      data-panel-theme={theme}
      data-panel-layout={layout}
      className="relative isolate min-h-[100svh] bg-chrome text-paper"
    >
      <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
          className={
            capsule
              ? `relative mx-auto ${contentMax} px-3 py-4 md:px-5 md:py-6`
              : `relative mx-auto ${contentMax} px-4 py-6 md:px-6 md:py-8`
          }
      >
        <div
          className={
            capsule
              ? "rounded-[var(--panel-radius)] border border-paper/12 bg-chrome/50 p-4 shadow-[var(--panel-elev)] md:p-6"
              : undefined
          }
        >
          <header
            className={
              capsule
                ? "flex flex-wrap items-center justify-between gap-3 pb-4"
                : "flex flex-wrap items-center justify-between gap-3 border-b border-paper/10 pb-4"
            }
          >
            <div>
              <Link
                href="/panel"
                className="font-display text-sm tracking-[0.2em] text-brand uppercase"
              >
                Panel zawodnika
              </Link>
              <p className="mt-1 text-sm text-paper/55">{user.display_name}</p>
            </div>
            {actions()}
          </header>

          <nav
            className={
              capsule
                ? "mt-2 flex items-center gap-1 overflow-x-auto rounded-[var(--panel-radius-pill)] border border-paper/10 bg-chrome/35 p-1"
                : "mt-4 flex items-end gap-1 overflow-x-auto border-b border-paper/10 pb-px"
            }
            aria-label="Moduły zawodnika"
          >
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const isSettings = item.href === PANEL_SETTINGS.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${tabClass(active)}${isSettings && !capsule ? " ml-auto" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={capsule ? "mt-5 md:mt-6" : "mt-6 md:mt-8"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
