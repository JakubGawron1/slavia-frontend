"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getPanelTheme } from "@/lib/panel-themes";
import { hasAnyRole } from "@/lib/auth";
import { LoadingScene } from "@/components/loading/LoadingScene";
import { SessionMissing } from "@/components/ui/SessionMissing";
import { STAFF_ROLES } from "@/lib/klub-nav";
import { usePanel } from "./PanelProvider";
import { PanelHeaderActions } from "./shell/PanelHeaderActions";
import { buildPanelNavItems, isPanelNavActive } from "./shell/panelNav";
import { PanelPreviewBanner } from "./shell/PanelPreviewBanner";
import { useResolvedPanelTheme, useVisiblePanelModules } from "./shell/usePanelShellTheme";
import { PanelLayoutStudio } from "./shell/PanelLayoutStudio";
import { PanelLayoutDock } from "./shell/PanelLayoutDock";
import { PanelLayoutFrame } from "./shell/PanelLayoutFrame";
import { PanelLayoutRibbon } from "./shell/PanelLayoutRibbon";
import { PanelLayoutStandard } from "./shell/PanelLayoutStandard";
import type { PanelShellLayoutProps } from "./shell/panelShellTypes";

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
      <SessionMissing message={error ?? "Zaloguj się, aby otworzyć panel zawodnika."} />
    );
  }

  const staffSource = actor ?? user;
  const isStaff = hasAnyRole(staffSource, STAFF_ROLES);

  const previewBanner = viewAs ? (
    <PanelPreviewBanner
      displayName={viewAs.displayName}
      email={viewAs.email}
      onClear={() => void clearViewAs()}
    />
  ) : null;

  const actions = (bellVariant: "default" | "onBrand" = "default") => (
    <PanelHeaderActions isStaff={isStaff} onLogout={logout} bellVariant={bellVariant} />
  );

  const navItems = buildPanelNavItems(modules);

  function isActive(href: string, exact: boolean) {
    return isPanelNavActive(pathname, href, exact);
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

  const layoutProps: PanelShellLayoutProps = {
    theme,
    contentMax,
    displayName: user.display_name,
    navItems,
    isActive,
    actions,
    children,
  };

  if (layout === "studio") {
    return wrap(<PanelLayoutStudio {...layoutProps} />);
  }
  if (layout === "dock") {
    return wrap(<PanelLayoutDock {...layoutProps} />);
  }
  if (layout === "frame") {
    return wrap(<PanelLayoutFrame {...layoutProps} />);
  }
  if (layout === "ribbon") {
    return wrap(<PanelLayoutRibbon {...layoutProps} />);
  }

  return wrap(
    <PanelLayoutStandard {...layoutProps} capsule={layout === "capsule"} />,
  );
}
