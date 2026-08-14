import Link from "next/link";
import type { PanelShellLayoutProps } from "./panelShellTypes";

export function PanelLayoutFrame({
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
      data-panel-layout="frame"
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
              <p className="mt-1 text-sm text-paper/55">{displayName}</p>
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
