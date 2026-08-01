import type { Role } from "@/lib/auth";

export type PanelModule = {
  href: string;
  label: string;
  description: string;
  statKey?: keyof AthleteStatsLinks;
};

/** Klucze statystyk → docelowe ścieżki (klikalne kafelki). */
export type AthleteStatsLinks = {
  results_accepted: string;
  results_pending: string;
  attendance_month: string;
  plans_active: string;
};

export const ATHLETE_STAT_LINKS: AthleteStatsLinks = {
  results_accepted: "/panel/wyniki",
  results_pending: "/panel/wyniki",
  attendance_month: "/panel/obecnosc",
  plans_active: "/panel/plany",
};

export const PANEL_MODULES: PanelModule[] = [
  {
    href: "/panel/wyniki",
    label: "Wyniki i rekordy",
    description: "Zgłoś wyniki zawodów lub rekordy treningowe do weryfikacji.",
    statKey: "results_pending",
  },
  {
    href: "/panel/obecnosc",
    label: "Obecność (QR)",
    description: "Zeskanuj kod QR na treningu, aby zapisać obecność.",
    statKey: "attendance_month",
  },
  {
    href: "/panel/plany",
    label: "Plany treningowe",
    description: "Podgląd planów i oznaczanie wykonanych ćwiczeń.",
    statKey: "plans_active",
  },
];

export function canAccessAthletePanel(roles: Role[]): boolean {
  return (
    roles.includes("zawodnik") ||
    roles.includes("superadmin") ||
    roles.includes("trener") ||
    roles.includes("admin")
  );
}

export function isAthleteRole(roles: Role[]): boolean {
  return roles.includes("zawodnik") || roles.includes("superadmin");
}
