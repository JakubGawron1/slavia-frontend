"use client";

import { useEffect, useState } from "react";

/** `null` do hydratacji — unikaj rozjazdu SSR/client. */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Zgodne z `lg:` w Tailwind / shellach (nav mobile poniżej 1024px). */
export function useIsDesktop(): boolean | null {
  return useMediaQuery("(min-width: 1024px)");
}
