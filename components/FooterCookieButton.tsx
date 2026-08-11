"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

export function FooterCookieButton() {
  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className="hover:text-paper"
    >
      Ustawienia cookies
    </button>
  );
}
