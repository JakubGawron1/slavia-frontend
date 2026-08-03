export const SITE_THEME_KEY = "slavia_site_theme";

export const SITE_THEMES = ["light", "dark"] as const;

export type SiteTheme = (typeof SITE_THEMES)[number];

/** Domyślny motyw witryny publicznej. */
export const DEFAULT_SITE_THEME: SiteTheme = "dark";

export function isSiteTheme(value: unknown): value is SiteTheme {
  return value === "light" || value === "dark";
}

/** Preferencja z localStorage; bez zapisu → domyślnie ciemny. */
export function resolveSiteTheme(): SiteTheme {
  if (typeof window === "undefined") return DEFAULT_SITE_THEME;
  try {
    const stored = localStorage.getItem(SITE_THEME_KEY);
    if (isSiteTheme(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_SITE_THEME;
}

export function applySiteTheme(theme: SiteTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-site-theme", theme);
  try {
    localStorage.setItem(SITE_THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function toggleSiteTheme(current: SiteTheme): SiteTheme {
  return current === "dark" ? "light" : "dark";
}

/** Inline script — anty-FOUC w <head> (przed paint). */
export const SITE_THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(SITE_THEME_KEY)};var d=${JSON.stringify(DEFAULT_SITE_THEME)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=d;}document.documentElement.setAttribute("data-site-theme",t);}catch(e){document.documentElement.setAttribute("data-site-theme",${JSON.stringify(DEFAULT_SITE_THEME)});}})();`;
