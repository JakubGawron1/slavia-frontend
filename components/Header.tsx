"use client";
"use no memo";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  getStoredToken,
  getStoredUser,
  hasAnyRole,
  type AuthUser,
} from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/klub-nav";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";
import type { PublicFlag } from "@/lib/api/generated/models";
import { ClubMark } from "./ClubMark";

const NAV_LINKS = [
  { href: "/blog", label: "Aktualności", flag: "public_blog" },
  { href: "/zawodnicy", label: "Zawodnicy", flag: null },
  { href: "/kalendarz", label: "Kalendarz", flag: null },
  { href: "/kalkulator-sinclair", label: "Kalkulatory", flag: null },
  { href: "/ogloszenia", label: "Ogłoszenia", flag: "announcements_board" },
  { href: "/kontakt", label: "Kontakt", flag: null },
] as const;

type NavLink = { href: string; label: string };

function visibleNavLinks(flags: PublicFlag[] | undefined): NavLink[] {
  return NAV_LINKS.filter(
    (link) => !link.flag || isFlagEnabled(flags, link.flag),
  );
}

const overlayPaths = new Set([
  "/",
  "/logowanie",
  "/kalkulator-sinclair",
  "/kalendarz",
  "/zawodnicy",
  "/kontakt",
]);

function panelHrefFor(user: AuthUser): string {
  return hasAnyRole(user, STAFF_ROLES) ? "/klub" : "/panel";
}

function AuthCta({
  user,
  pathname,
  onNavigate,
  className,
}: {
  user: AuthUser | null;
  pathname: string;
  onNavigate?: () => void;
  className: string;
}) {
  if (user) {
    const href = panelHrefFor(user);
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={className}
        onClick={onNavigate}
      >
        Panel
      </Link>
    );
  }

  const isLogin = pathname === "/logowanie";
  return (
    <Link
      href="/logowanie"
      aria-current={isLogin ? "page" : undefined}
      className={className}
      onClick={onNavigate}
    >
      Zaloguj się
    </Link>
  );
}

function HeaderChrome({
  pathname,
  open,
  onToggle,
  onClose,
  user,
  navLinks,
}: {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  user: AuthUser | null;
  navLinks: NavLink[];
}) {
  const overlayHeader = overlayPaths.has(pathname);
  const isAuthActive = user
    ? pathname.startsWith(panelHrefFor(user))
    : pathname === "/logowanie";

  const desktopCtaClass = isAuthActive
    ? "border border-brand bg-brand px-4 py-2 text-sm tracking-wide text-paper transition-colors"
    : "border border-paper/35 px-4 py-2 text-sm tracking-wide text-paper transition-colors hover:border-paper hover:bg-paper/10";

  const mobileCtaClass = isAuthActive
    ? "mt-2 border border-brand bg-brand py-3 text-center text-paper"
    : "mt-2 border border-paper/30 py-3 text-center text-paper";

  return (
    <header
      className={
        overlayHeader
          ? "absolute inset-x-0 top-0 z-50"
          : "sticky top-0 z-50 border-b border-paper/10 bg-ink/95 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-paper"
          aria-label="CKS Slavia Ruda Śląska — strona główna"
        >
          <ClubMark className="h-10 w-10 text-brand transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-lg font-semibold tracking-[0.08em] uppercase md:text-xl">
            CKS Slavia
            <span className="mt-0.5 block text-[0.65rem] font-medium tracking-[0.14em] text-paper/55 normal-case md:text-xs">
              Ruda Śląska
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Główne">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-sm tracking-wide text-brand transition-colors"
                    : "text-sm tracking-wide text-paper/80 transition-colors hover:text-paper"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <AuthCta
            user={user}
            pathname={pathname}
            className={desktopCtaClass}
          />
        </nav>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          onClick={onToggle}
        >
          <span className="sr-only">Menu</span>
          <span
            className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${
              open ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${
              open ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-paper/10 bg-ink/95 backdrop-blur-md lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4"
          aria-label="Mobilne"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "py-3 text-base text-brand"
                    : "py-3 text-base text-paper/90"
                }
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
          <AuthCta
            user={user}
            pathname={pathname}
            className={mobileCtaClass}
            onNavigate={onClose}
          />
        </nav>
      </div>
    </header>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function sync() {
      const token = getStoredToken();
      const stored = getStoredUser();
      setUser(token && stored ? stored : null);
    }
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [pathname]);

  return (
    <HeaderChrome
      pathname={pathname}
      open={open}
      onToggle={() => setOpen((v) => !v)}
      onClose={() => setOpen(false)}
      user={user}
      navLinks={visibleNavLinks(flagsQuery.data?.data)}
    />
  );
}

function HeaderFallback() {
  return (
    <HeaderChrome
      pathname="/"
      open={false}
      onToggle={() => {}}
      onClose={() => {}}
      user={null}
      navLinks={visibleNavLinks(undefined)}
    />
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderInner />
    </Suspense>
  );
}
