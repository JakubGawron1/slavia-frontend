import { GENERATED_CHANGELOG } from "@/lib/changelog.generated";

export type ChangelogCategory = "frontend" | "backend";

export type ChangelogEntry = {
  /** Wspólna wersja platformy (Slavia.toml) — bez breaking API. */
  version: string;
  date: string;
  category: ChangelogCategory;
  title: string;
  /** Notatki developerskie — co się zmieniło w kodzie / API / UI. */
  notes: string[];
  /** true tylko przy breaking change API (wtedy wersje mogą się rozjechać). */
  breakingApi?: boolean;
};

export const CHANGELOG_CATEGORIES: {
  id: ChangelogCategory;
  label: string;
  hint: string;
  source: string;
}[] = [
  {
    id: "frontend",
    label: "Frontend",
    hint: "Next.js — panel /klub, strona publiczna, Orval.",
    source: "slavia-frontend/CHANGELOG.md",
  },
  {
    id: "backend",
    label: "Backend",
    hint: "Rust/Axum — API, DB, flagi, OpenAPI.",
    source: "slavia-backend/CHANGELOG.md",
  },
];

/** Dane z CHANGELOG.md projektów — regeneruj: `pnpm sync:changelog`. */
export const CHANGELOG: ChangelogEntry[] = GENERATED_CHANGELOG;

export function changelogByCategory(
  category: ChangelogCategory,
): ChangelogEntry[] {
  return CHANGELOG.filter((e) => e.category === category).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}
