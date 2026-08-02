export const EXPERIMENTAL_PANEL_THEMES_FLAG = "experimental_panel_themes";

/** Max. motywów w każdej kategorii (stable / experimental). */
export const PANEL_THEMES_PER_CATEGORY_MAX = 10;

export const PANEL_THEMES = [
  // —— Stable (10) ——
  {
    id: "classic",
    label: "Klasyczny",
    description: "Ciemne tło z czerwienią klubową",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#0e1014", paper: "#f7f5f2", brand: "#c8102e", accent: "#161b22" },
  },
  {
    id: "dawn",
    label: "Świt",
    description: "Jasny panel, ciepły papier i karmazyn",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#f3efe8", paper: "#1a1814", brand: "#b91c2c", accent: "#e8e2d6" },
  },
  {
    id: "graphite",
    label: "Grafit",
    description: "Chłodny antracyt ze stalowym akcentem",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#0c0e12", paper: "#e8eaed", brand: "#3d7ea6", accent: "#151a22" },
  },
  {
    id: "forest",
    label: "Las",
    description: "Głęboka zieleń z mchem",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#0c1210", paper: "#e6ede8", brand: "#2d8a5e", accent: "#121a16" },
  },
  {
    id: "arena",
    label: "Arena",
    description: "Ciemna baza ze złotym akcentem zawodów",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#12100c", paper: "#f2ebe0", brand: "#c9a227", accent: "#1a1610" },
  },
  {
    id: "mist",
    label: "Mgła",
    description: "Jasny chłodny szary i granat",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#eef1f4", paper: "#151a20", brand: "#1e3a5f", accent: "#dfe5eb" },
  },
  {
    id: "ember",
    label: "Żar",
    description: "Ciepły węgiel z miedzianym akcentem",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#140e0c", paper: "#f3ebe4", brand: "#d2693c", accent: "#1c1410" },
  },
  {
    id: "slate",
    label: "Łupek",
    description: "Jasny niebieskoszary z indygo",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#e8edf2", paper: "#141820", brand: "#3b5bdb", accent: "#d5dde6" },
  },
  {
    id: "sand",
    label: "Piasek",
    description: "Ciepły piaskowy panel z terakotą",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#f0e6d8", paper: "#1f1812", brand: "#b85c38", accent: "#e4d5c2" },
  },
  {
    id: "night",
    label: "Noc",
    description: "Głęboki granat ze srebrnym akcentem",
    experimental: false,
    layout: "standard",
    swatch: { ink: "#070b14", paper: "#e6ebf4", brand: "#8aa0c2", accent: "#0e1420" },
  },

  // —— Experimental (10) ——
  {
    id: "capsule",
    label: "Kapsuła",
    description: "Pływający panel, pastylki i miękkie rogi",
    experimental: true,
    layout: "capsule",
    swatch: { ink: "#ebe6df", paper: "#1c1916", brand: "#d64545", accent: "#f7f3ee" },
  },
  {
    id: "studio",
    label: "Studio",
    description: "Pionowy tor nawigacji i karty robocze",
    experimental: true,
    layout: "studio",
    swatch: { ink: "#10141a", paper: "#e9eef3", brand: "#2bb3a0", accent: "#171d26" },
  },
  {
    id: "dock",
    label: "Dok",
    description: "Dolny dock i zaokrąglona studnia treści",
    experimental: true,
    layout: "dock",
    swatch: { ink: "#0a0b10", paper: "#f0f1f5", brand: "#ff5a3d", accent: "#14161f" },
  },
  {
    id: "bloom",
    label: "Kwiat",
    description: "Miękka kapsuła w tonacji różu i kremu",
    experimental: true,
    layout: "capsule",
    swatch: { ink: "#f6ecef", paper: "#2a1820", brand: "#c45a7a", accent: "#efe0e6" },
  },
  {
    id: "chalk",
    label: "Kreda",
    description: "Jasna kapsuła z kredowym papierem",
    experimental: true,
    layout: "capsule",
    swatch: { ink: "#f4f2ea", paper: "#1a1c18", brand: "#4a7c59", accent: "#e8e5db" },
  },
  {
    id: "forge",
    label: "Kuźnia",
    description: "Gruba ramka, industrialny kontrast",
    experimental: true,
    layout: "frame",
    swatch: { ink: "#121210", paper: "#ece8e0", brand: "#e08a2e", accent: "#1c1b18" },
  },
  {
    id: "ribbon",
    label: "Wstęga",
    description: "Górna wstęga nawigacji i duże chipy",
    experimental: true,
    layout: "ribbon",
    swatch: { ink: "#0f1218", paper: "#edf0f5", brand: "#4f7cac", accent: "#171b24" },
  },
  {
    id: "pulse",
    label: "Puls",
    description: "Dok z elektrycznym cyjanem",
    experimental: true,
    layout: "dock",
    swatch: { ink: "#070d12", paper: "#e6f4f8", brand: "#2ec4e0", accent: "#0e161c" },
  },
  {
    id: "neon",
    label: "Neon",
    description: "Studio z limonkowym akcentem",
    experimental: true,
    layout: "studio",
    swatch: { ink: "#0b0f0c", paper: "#eaf4ea", brand: "#7dff6b", accent: "#121812" },
  },
  {
    id: "vapor",
    label: "Opary",
    description: "Ramka w chłodnej pastelowej mgiełce",
    experimental: true,
    layout: "frame",
    swatch: { ink: "#e8eef8", paper: "#1a2030", brand: "#6b7fd7", accent: "#d9e2f2" },
  },
] as const;

export type PanelThemeId = (typeof PANEL_THEMES)[number]["id"];
export type PanelThemeLayout = (typeof PANEL_THEMES)[number]["layout"];

export const DEFAULT_PANEL_THEME: PanelThemeId = "classic";

const THEME_BY_ID = new Map(PANEL_THEMES.map((t) => [t.id, t]));

export function getPanelTheme(id: PanelThemeId) {
  return THEME_BY_ID.get(id) ?? THEME_BY_ID.get(DEFAULT_PANEL_THEME)!;
}

export function isExperimentalTheme(id: string): boolean {
  return THEME_BY_ID.get(id as PanelThemeId)?.experimental === true;
}

export function resolvePanelTheme(
  value?: string | null,
  opts?: { allowExperimental?: boolean },
): PanelThemeId {
  const allowExperimental = opts?.allowExperimental ?? false;
  if (value && THEME_BY_ID.has(value as PanelThemeId)) {
    const id = value as PanelThemeId;
    if (isExperimentalTheme(id) && !allowExperimental) {
      return DEFAULT_PANEL_THEME;
    }
    return id;
  }
  return DEFAULT_PANEL_THEME;
}

export function visiblePanelThemes(allowExperimental: boolean) {
  return PANEL_THEMES.filter((t) => !t.experimental || allowExperimental);
}

export function stablePanelThemes() {
  return PANEL_THEMES.filter((t) => !t.experimental);
}

export function experimentalPanelThemes() {
  return PANEL_THEMES.filter((t) => t.experimental);
}
