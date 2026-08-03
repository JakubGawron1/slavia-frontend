/** Zgoda na pliki cookies — przechowywana lokalnie (jak Cookiebot / OneTrust w uproszczeniu). */

export const COOKIE_CONSENT_KEY = "slavia_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_SETTINGS_EVENT = "slavia:open-cookie-settings";
export const COOKIE_CONSENT_CHANGED_EVENT = "slavia:cookie-consent-changed";

export type CookieConsentPreferences = {
  version: typeof COOKIE_CONSENT_VERSION;
  /** Zawsze wymagane — sesja logowania, bezpieczeństwo. */
  necessary: true;
  /** Preferencje UI (np. motyw jasny/ciemny). */
  functional: boolean;
  /** Vercel Analytics + Speed Insights — pomiary stron publicznych. */
  analytics: boolean;
  decidedAt: string;
};

export function defaultConsent(
  overrides: Pick<CookieConsentPreferences, "functional" | "analytics">,
): CookieConsentPreferences {
  return {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    functional: overrides.functional,
    analytics: overrides.analytics,
    decidedAt: new Date().toISOString(),
  };
}

export function acceptAllConsent(): CookieConsentPreferences {
  return defaultConsent({ functional: true, analytics: true });
}

export function necessaryOnlyConsent(): CookieConsentPreferences {
  return defaultConsent({ functional: false, analytics: false });
}

export function isCookieConsent(
  value: unknown,
): value is CookieConsentPreferences {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === COOKIE_CONSENT_VERSION &&
    v.necessary === true &&
    typeof v.functional === "boolean" &&
    typeof v.analytics === "boolean" &&
    typeof v.decidedAt === "string"
  );
}

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: CookieConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: consent }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.analytics === true;
}

export function hasFunctionalConsent(): boolean {
  return readCookieConsent()?.functional === true;
}

/** Otwiera panel ustawień cookies (baner musi być zamontowany na stronie). */
export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
