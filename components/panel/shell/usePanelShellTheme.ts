"use client";

import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { PANEL_MODULES } from "@/lib/panel-nav";
import {
  EXPERIMENTAL_PANEL_THEMES_FLAG,
  resolvePanelTheme,
  type PanelThemeId,
} from "@/lib/panel-themes";
import { isFlagEnabled } from "@/lib/public-flags";

export function useResolvedPanelTheme(raw?: string | null): PanelThemeId {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const allowExperimental = isFlagEnabled(
    flagsQuery.data?.data ?? [],
    EXPERIMENTAL_PANEL_THEMES_FLAG,
  );
  return resolvePanelTheme(raw, { allowExperimental });
}

export function useVisiblePanelModules() {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  return PANEL_MODULES.filter(
    (mod) => !mod.flag || isFlagEnabled(flags, mod.flag),
  );
}
