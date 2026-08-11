/** Adresy developerskie — domena kończy się na `.dev` lub `.local` (jak backend). */
export function isDevEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 0) return false;
  const host = trimmed.slice(at + 1).replace(/\.+$/, "");
  return host.endsWith(".dev") || host.endsWith(".local");
}
