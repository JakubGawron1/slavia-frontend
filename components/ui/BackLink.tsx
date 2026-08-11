"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

function ArrowIcon({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

type BackLinkProps = {
  /** Cel gdy brak sensownej historii (deep link / odświeżenie). */
  fallbackHref: string;
  children?: ReactNode;
  className?: string;
  /** Zamiast nawigacji URL — np. zamknięcie edytora w tej samej stronie. */
  onBack?: () => void;
};

/**
 * Strzałka wstecz: `history.back()` gdy jest historia, inaczej `fallbackHref`
 * (albo `onBack` dla widoków bez zmiany URL).
 */
export function BackLink({
  fallbackHref,
  children = "Wstecz",
  className,
  onBack,
}: BackLinkProps) {
  const router = useRouter();

  const baseClass =
    className ??
    "inline-flex items-center gap-1 font-display text-xs tracking-[0.14em] text-paper/50 uppercase transition-colors hover:text-paper";

  function goBack() {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  if (onBack) {
    return (
      <button type="button" onClick={goBack} className={baseClass}>
        <ArrowIcon className="h-4 w-4 shrink-0" />
        {children}
      </button>
    );
  }

  return (
    <Link
      href={fallbackHref}
      className={baseClass}
      onClick={(e) => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      <ArrowIcon className="h-4 w-4 shrink-0" />
      {children}
    </Link>
  );
}
