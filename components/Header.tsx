"use client";
"use no memo";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ClubMark } from "./ClubMark";

const navLinks = [
  { href: "/blog", label: "Aktualności" },
  { href: "/kalendarz", label: "Kalendarz" },
  { href: "/kalkulator-sinclair", label: "Kalkulatory" },
  { href: "/ogloszenia", label: "Ogłoszenia" },
] as const;

const overlayPaths = new Set([
  "/",
  "/logowanie",
  "/kalkulator-sinclair",
  "/kalendarz",
]);

function HeaderChrome({
  pathname,
  open,
  onToggle,
  onClose,
}: {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const isLogin = pathname === "/logowanie";
  const overlayHeader = overlayPaths.has(pathname);

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
          <Link
            href="/logowanie"
            aria-current={isLogin ? "page" : undefined}
            className={
              isLogin
                ? "border border-brand bg-brand px-4 py-2 text-sm tracking-wide text-paper transition-colors"
                : "border border-paper/35 px-4 py-2 text-sm tracking-wide text-paper transition-colors hover:border-paper hover:bg-paper/10"
            }
          >
            Zaloguj się
          </Link>
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
          <Link
            href="/logowanie"
            aria-current={isLogin ? "page" : undefined}
            className={
              isLogin
                ? "mt-2 border border-brand bg-brand py-3 text-center text-paper"
                : "mt-2 border border-paper/30 py-3 text-center text-paper"
            }
            onClick={onClose}
          >
            Zaloguj się
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <HeaderChrome
      pathname={pathname}
      open={open}
      onToggle={() => setOpen((v) => !v)}
      onClose={() => setOpen(false)}
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
