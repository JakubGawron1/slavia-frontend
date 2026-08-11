import type { Role } from "@/lib/auth";

export type PanelModule = {
  href: string;
  label: string;
  description: string;
  statKey?: keyof AthleteStatsLinks;
  /** Opcjonalna flaga publiczna — moduł znika, gdy flaga jest wyłączona. */
  flag?: string;
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
    flag: "training_plans",
  },
  {
    href: "/panel/kalendarz",
    label: "Kalendarz",
    description: "Treningi, zawody, skład i rezygnacje.",
    flag: "athlete_calendar",
  },
  {
    href: "/panel/kalkulator-sinclair",
    label: "Kalkulator Sinclair",
    description: "Przelicz dwubój na punkty Sinclair (wzór 2025–2028).",
  },
  {
    href: "/panel/co-nowego",
    label: "Co nowego",
    description: "Nowości w panelu — krótko i zrozumiale.",
  },
];

/** Zakładka ustawień — osobno, wypychana do prawej krawędzi nav. */
export const PANEL_SETTINGS = {
  href: "/panel/ustawienia",
  label: "Ustawienia",
  description: "Nazwa wyświetlana i hasło konta.",
} as const;

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
