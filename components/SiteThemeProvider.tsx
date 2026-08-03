"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applySiteTheme,
  DEFAULT_SITE_THEME,
  resolveSiteTheme,
  toggleSiteTheme,
  type SiteTheme,
} from "@/lib/site-theme";

type SiteThemeContextValue = {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggle: () => void;
};

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(DEFAULT_SITE_THEME);

  useEffect(() => {
    const initial = resolveSiteTheme();
    setThemeState(initial);
    applySiteTheme(initial);

    function onStorage(event: StorageEvent) {
      if (event.key !== "slavia_site_theme") return;
      const next = resolveSiteTheme();
      setThemeState(next);
      applySiteTheme(next);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(next);
    applySiteTheme(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const next = toggleSiteTheme(current);
      applySiteTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) {
    throw new Error("useSiteTheme musi być użyty wewnątrz SiteThemeProvider");
  }
  return ctx;
}
