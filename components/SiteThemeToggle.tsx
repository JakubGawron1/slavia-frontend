"use client";

import { useSiteTheme } from "@/components/SiteThemeProvider";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" />
    </svg>
  );
}

export function SiteThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useSiteTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Włącz tryb jasny" : "Włącz tryb ciemny"}
      title={isDark ? "Tryb jasny" : "Tryb ciemny"}
      className={`inline-flex h-10 w-10 items-center justify-center border border-paper/30 text-paper transition-colors hover:border-paper hover:bg-paper/10 ${className}`}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
