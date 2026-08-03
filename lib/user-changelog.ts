import { GENERATED_USER_CHANGELOG } from "@/lib/changelog.user.generated";
import { SLAVIA_VERSION } from "@/lib/version";

export type UserChangelogEntry = {
  version: string;
  date: string;
  title: string;
  notes: string[];
};

/** Przyjazny changelog — źródło: CHANGELOG.user.md (`pnpm sync:changelog`). */
export const USER_CHANGELOG: UserChangelogEntry[] = GENERATED_USER_CHANGELOG;

export const USER_CHANGELOG_SEEN_KEY = "slavia_user_changelog_seen";

export function userChangelogForVersion(
  version: string = SLAVIA_VERSION,
): UserChangelogEntry[] {
  return USER_CHANGELOG.filter((e) => e.version === version).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

export function sortedUserChangelog(): UserChangelogEntry[] {
  return [...USER_CHANGELOG].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.version !== b.version) return a.version < b.version ? 1 : -1;
    return a.title.localeCompare(b.title, "pl");
  });
}

export function readSeenChangelogVersion(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(USER_CHANGELOG_SEEN_KEY);
  } catch {
    return null;
  }
}

export function writeSeenChangelogVersion(
  version: string = SLAVIA_VERSION,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_CHANGELOG_SEEN_KEY, version);
  } catch {
    /* ignore */
  }
}

/** Czy pokazać modal „Co nowego” (jednorazowo na wersję). */
export function shouldShowWhatsNewModal(opts: {
  /** Konta z rolą superadmin nie dostają user-friendly modala. */
  isSuperadmin: boolean;
}): boolean {
  if (opts.isSuperadmin) return false;
  if (userChangelogForVersion(SLAVIA_VERSION).length === 0) return false;
  return readSeenChangelogVersion() !== SLAVIA_VERSION;
}
