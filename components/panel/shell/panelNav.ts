import { PANEL_SETTINGS, type PanelModule } from "@/lib/panel-nav";

export type PanelNavItem = { href: string; label: string; exact: boolean };

export function buildPanelNavItems(modules: PanelModule[]): PanelNavItem[] {
  return [
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
}

export function isPanelNavActive(
  pathname: string,
  href: string,
  exact: boolean,
) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
