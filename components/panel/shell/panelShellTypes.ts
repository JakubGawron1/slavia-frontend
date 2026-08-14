import type { ReactNode } from "react";
import type { PanelNavItem } from "./panelNav";

export type PanelShellLayoutProps = {
  theme: string;
  contentMax: string;
  displayName: string;
  navItems: PanelNavItem[];
  isActive: (href: string, exact: boolean) => boolean;
  actions: (bellVariant?: "default" | "onBrand") => ReactNode;
  children: ReactNode;
};
