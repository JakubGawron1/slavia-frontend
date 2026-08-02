import type { PublicFlag } from "@/lib/api/generated/models";

/**
 * Egzekwuje flagi funkcji na podstawie listy publicznej (`/api/flags/public`).
 *
 * Dopóki flagi się nie załadowały (`undefined`) — zwraca `true`, żeby uniknąć
 * migotania linków/CTA. Gdy flagi są już załadowane, brakujący klucz oznacza
 * `false` (bezpieczny domyślny stan — funkcja ukryta, dopóki nie potwierdzimy,
 * że jest włączona).
 */
export function isFlagEnabled(
  flags: PublicFlag[] | undefined,
  key: string,
): boolean {
  if (flags === undefined) return true;
  const flag = flags.find((f) => f.key === key);
  return flag?.enabled ?? false;
}
