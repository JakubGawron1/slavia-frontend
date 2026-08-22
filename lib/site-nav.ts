import { isFlagEnabled } from "@/lib/public-flags";
import type { PublicFlag } from "@/lib/api/generated/models";

export const SITE_NAV: readonly {
  href: string;
  label: string;
  footerLabel?: string;
  flag: string | null;
}[] = [
  { href: "/blog", label: "Aktualności", flag: "public_blog" },
  { href: "/zawodnicy", label: "Zawodnicy", flag: null },
  { href: "/kalendarz", label: "Kalendarz", flag: "public_calendar" },
  {
    href: "/ogloszenia",
    label: "Ogłoszenia",
    footerLabel: "Tablica ogłoszeń",
    flag: "announcements_board",
  },
  { href: "/kontakt", label: "Kontakt", flag: null },
] as const;

export type SiteNavLink = { href: string; label: string };

export function visibleSiteNav(
  flags: PublicFlag[] | undefined,
  variant: "header" | "footer" = "header",
): SiteNavLink[] {
  return SITE_NAV.filter(
    (link) => !link.flag || isFlagEnabled(flags, link.flag),
  ).map((link) => ({
    href: link.href,
    label:
      variant === "footer" && link.footerLabel
        ? link.footerLabel
        : link.label,
  }));
}
