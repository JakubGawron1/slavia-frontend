import Link from "next/link";
import type { PanelShellLayoutProps } from "./panelShellTypes";

export function PanelLayoutDock({
  theme,
  contentMax,
  displayName,
  navItems,
  isActive,
  actions,
  children,
}: PanelShellLayoutProps) {
  return (
    <div
      data-panel-theme={theme}
      data-panel-layout="dock"
      className="relative isolate flex min-h-[100svh] flex-col bg-chrome text-paper"
    >
      <div className="panel-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className={`relative z-10 mx-auto flex w-full ${contentMax} flex-1 flex-col px-4 pb-28 pt-5 md:px-6`}
      >
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--panel-radius)] border border-paper/10 bg-chrome/55 px-4 py-3 shadow-[var(--panel-elev)]">
          <div>
            <Link
              href="/panel"
              className="font-display text-sm tracking-[0.2em] text-brand uppercase"
            >
              Panel zawodnika
            </Link>
            <p className="mt-1 text-sm text-paper/55">{displayName}</p>
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
