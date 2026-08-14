import Link from "next/link";
import type { PanelShellLayoutProps } from "./panelShellTypes";

export function PanelLayoutStudio({
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
      data-panel-layout="studio"
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
          {displayName}
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
            {displayName}
          </p>
          <div className="ml-auto min-w-0 max-w-full md:hidden">{actions()}</div>
          <p className="hidden text-sm text-paper/45 md:block">
            Układ Studio · eksperymentalny
          </p>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div
            className={`settings-surface mx-auto ${contentMax} rounded-[var(--panel-radius)] border border-paper/10 bg-chrome/40 p-4 shadow-[var(--panel-elev)] md:p-6`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
