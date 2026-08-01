import type { Role } from "@/lib/auth";

export type KlubNavItem = {
  href: string;
  label: string;
  /** Role, które widzą pozycję w nawigacji (superadmin omija przy prawdziwych uprawnieniach). */
  roles: Role[];
  /** Wymaga prawdziwej roli superadmin (nawet przy podglądzie roli). */
  requireSuperadmin?: boolean;
};

export type KlubNavCategory = {
  id: string;
  label: string;
  items: KlubNavItem[];
};

/** Źródło prawdy nawigacji panelu klubowego — bez duplikacji stron. */
export const KLUB_NAV: KlubNavCategory[] = [
  {
    id: "ludzie",
    label: "Ludzie",
    items: [
      {
        href: "/klub/konta",
        label: "Konta i profile",
        roles: ["trener", "admin", "superadmin"],
      },
      {
        href: "/klub/weryfikacja-wynikow",
        label: "Weryfikacja wyników",
        roles: ["trener", "admin", "superadmin"],
      },
      {
        href: "/klub/obecnosc",
        label: "Obecność (QR)",
        roles: ["trener", "admin", "superadmin"],
      },
    ],
  },
  {
    id: "trening",
    label: "Trening",
    items: [
      {
        href: "/klub/plany",
        label: "Plany treningowe",
        roles: ["trener", "superadmin"],
      },
    ],
  },
  {
    id: "tresc",
    label: "Treść",
    items: [
      {
        href: "/klub/cms",
        label: "CMS",
        roles: ["admin", "superadmin"],
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        href: "/klub/logi",
        label: "Logi systemowe",
        roles: ["admin", "superadmin"],
      },
    ],
  },
  {
    id: "narzedzia",
    label: "Narzędzia",
    items: [
      {
        href: "/klub/devtools",
        label: "DevTools",
        roles: ["superadmin"],
        requireSuperadmin: true,
      },
      {
        href: "/klub/baza-danych",
        label: "Baza danych",
        roles: ["superadmin"],
        requireSuperadmin: true,
      },
      {
        href: "/klub/podglad",
        label: "Podgląd kont / ról",
        roles: ["superadmin"],
        requireSuperadmin: true,
      },
    ],
  },
];

export const PUBLIC_ROUTE_MAP = [
  { path: "/", label: "Strona główna" },
  { path: "/blog", label: "Blog / aktualności" },
  { path: "/kalendarz", label: "Kalendarz" },
  { path: "/kalkulator-sinclair", label: "Kalkulator Sinclair" },
  { path: "/ogloszenia", label: "Ogłoszenia" },
  { path: "/logowanie", label: "Logowanie" },
  { path: "/panel", label: "Panel zawodnika" },
  { path: "/panel/wyniki", label: "Zgłaszanie wyników" },
  { path: "/panel/obecnosc", label: "Skaner obecności" },
  { path: "/panel/plany", label: "Plany (zawodnik)" },
] as const;

export const STAFF_ROLES: Role[] = ["trener", "admin", "superadmin"];

export const ROLE_LABELS: Record<Role, string> = {
  zawodnik: "Zawodnik",
  trener: "Trener",
  admin: "Admin",
  superadmin: "Superadmin",
};

/** Role dostępne w przełączniku widoku (superadmin może podglądać nav innych ról + panel zawodnika). */
export function viewableRolesFor(userRoles: Role[]): Role[] {
  const staff = userRoles.filter((r) => STAFF_ROLES.includes(r));
  if (userRoles.includes("superadmin")) {
    return ["superadmin", "admin", "trener", "zawodnik"];
  }
  return staff.length > 0 ? staff : userRoles;
}

/**
 * Filtr nawigacji wg aktywnego widoku roli.
 * `realRoles` — prawdziwe role konta (do requireSuperadmin).
 * `activeRole` — wybrany widok w switcherze.
 */
export function filterNavForRole(
  activeRole: Role,
  realRoles: Role[],
): KlubNavCategory[] {
  const isRealSuperadmin = realRoles.includes("superadmin");

  return KLUB_NAV.map((category) => ({
    ...category,
    items: category.items.filter((item) => {
      if (item.requireSuperadmin && !isRealSuperadmin) return false;
      if (item.requireSuperadmin && activeRole !== "superadmin") return false;
      if (isRealSuperadmin && activeRole === "superadmin") return true;
      return item.roles.includes(activeRole);
    }),
  })).filter((category) => category.items.length > 0);
}

export function canAccessPath(
  href: string,
  realRoles: Role[],
): boolean {
  if (href === "/klub") {
    return realRoles.some((r) => STAFF_ROLES.includes(r));
  }
  const item = KLUB_NAV.flatMap((c) => c.items).find((i) => i.href === href);
  if (!item) return realRoles.some((r) => STAFF_ROLES.includes(r));
  if (item.requireSuperadmin) return realRoles.includes("superadmin");
  if (realRoles.includes("superadmin")) return true;
  return item.roles.some((r) => realRoles.includes(r));
}

export function defaultActiveRole(roles: Role[]): Role {
  if (roles.includes("superadmin")) return "superadmin";
  if (roles.includes("admin")) return "admin";
  if (roles.includes("trener")) return "trener";
  return roles[0] ?? "zawodnik";
}
