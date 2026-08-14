import Link from "next/link";
import { PANEL_SETTINGS } from "@/lib/panel-nav";
import type { PanelShellLayoutProps } from "./panelShellTypes";

export function PanelLayoutStandard({
  theme,
  contentMax,
  displayName,
  navItems,
  isActive,
  actions,
  children,
  capsule,
}: PanelShellLayoutProps & { capsule: boolean }) {
  const tabClass = (active: boolean) =>
    capsule
      ? active
        ? "shrink-0 rounded-[var(--panel-radius-pill)] bg-brand px-3.5 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
        : "shrink-0 rounded-[var(--panel-radius-pill)] px-3.5 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase transition-colors hover:bg-paper/10 hover:text-paper"
      : active
        ? "shrink-0 border-b-2 border-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
        : "shrink-0 border-b-2 border-transparent px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase hover:text-paper";

  return (
    <div
      data-panel-theme={theme}
      data-panel-layout={capsule ? "capsule" : "standard"}
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
              <p className="mt-1 text-sm text-paper/55">{displayName}</p>
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
