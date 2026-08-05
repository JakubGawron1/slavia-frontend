import type { PublicFlag } from "@/lib/api/generated/models";

/** Kalendarz publiczny `/kalendarz` */
export const PUBLIC_CALENDAR_FLAG = "public_calendar";
/** Kalendarz kadrowy `/klub/kalendarz` */
export const CLUB_CALENDAR_FLAG = "club_calendar";
/** Kalendarz zawodnika `/panel/kalendarz` */
export const ATHLETE_CALENDAR_FLAG = "athlete_calendar";
/** Globalne powiadomienia toast (panele + witryna) */
export const UI_TOASTS_FLAG = "ui_toasts";
/** E-maile powiadomień (skład / plany / kontakt) — experimental */
export const EXPERIMENTAL_NOTIFICATION_EMAILS_FLAG =
  "experimental_notification_emails";

/**
 * Egzekwuje flagi funkcji na podstawie listy publicznej (`/api/flags/public`).
 *
 * Dopóki flagi się nie załadowały (`undefined`) — zwraca `true`, żeby uniknąć
 * migotania linków/CTA. Gdy flagi są już załadowane, brakujący klucz oznacza
 * `false` (bezpieczny domyślny stan — funkcja ukryta, dopóki nie potwierdzimy,
 * że jest włączona).
 *
 * Dla flag stable z domyślnym ON (np. `ui_toasts`) użyj `defaultWhenMissing: true`.
 */
export function isFlagEnabled(
  flags: PublicFlag[] | undefined,
  key: string,
  defaultWhenMissing = false,
): boolean {
  if (flags === undefined) return true;
  const flag = flags.find((f) => f.key === key);
  if (!flag) return defaultWhenMissing;
  return flag.enabled;
}
