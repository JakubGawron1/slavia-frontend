"use client";

import { useListPanelFlags } from "@/lib/api/generated/default/default";
import { PANEL_MODULES } from "@/lib/panel-nav";
import { resolvePanelTheme, type PanelThemeId } from "@/lib/panel-themes";
import { isFlagEnabled } from "@/lib/panel-flags";

export function useResolvedPanelTheme(raw?: string | null): PanelThemeId {
  return resolvePanelTheme(raw);
}

export function useVisiblePanelModules() {
  const flagsQuery = useListPanelFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  return PANEL_MODULES.filter(
    (mod) => !mod.flag || isFlagEnabled(flags, mod.flag),
  );
}
