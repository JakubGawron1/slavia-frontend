import Link from "next/link";
import type { PanelShellLayoutProps } from "./panelShellTypes";

export function PanelLayoutRibbon({
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
      data-panel-layout="ribbon"
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
              <p className="mt-1 text-sm text-paper/80">{displayName}</p>
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
        <div className={`mx-auto ${contentMax} px-4 py-6 md:px-6 md:py-8`}>
          {children}
        </div>
      </div>
    </div>
  );
}
