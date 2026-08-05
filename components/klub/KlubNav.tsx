"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { filterNavForRole, ROLE_LABELS } from "@/lib/klub-nav";
import { isFlagEnabled } from "@/lib/public-flags";
import { useKlub } from "./KlubProvider";
import { RoleSwitcher } from "./RoleSwitcher";

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.31.82.47 1.51.51H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, activeRole, collapsedCategories, toggleCategory, viewAs } =
    useKlub();
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;
  if (!user) return null;

  const categories = filterNavForRole(activeRole, user.roles)
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) => !item.flag || isFlagEnabled(flags, item.flag),
      ),
    }))
    .filter((category) => category.items.length > 0);
  const settingsActive =
    pathname === "/klub/ustawienia" ||
    pathname.startsWith("/klub/ustawienia/");

  const displayName = viewAs?.displayName ?? user.display_name;
  const roleLabel = ROLE_LABELS[activeRole];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-paper/10 px-4 py-5">
        <Link
          href="/klub"
          onClick={onNavigate}
          className="font-display text-sm tracking-[0.2em] text-brand uppercase"
        >
          CKS Slavia
        </Link>

        <div className="mt-3 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-paper">{displayName}</p>
            <p className="mt-0.5 truncate font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
              {viewAs ? `Podgląd · ${roleLabel}` : roleLabel}
            </p>
            {viewAs ? (
              <p className="mt-0.5 truncate text-[11px] text-amber-200/70">
                {viewAs.email}
              </p>
            ) : null}
          </div>
          <Link
            href="/klub/ustawienia"
            onClick={onNavigate}
            aria-label="Ustawienia"
            title="Ustawienia"
            className={
              settingsActive
                ? "inline-flex h-9 w-9 shrink-0 items-center justify-center border border-brand bg-brand/20 text-paper"
                : "inline-flex h-9 w-9 shrink-0 items-center justify-center border border-paper/15 text-paper/55 transition-colors hover:border-paper/40 hover:text-paper"
            }
          >
            <GearIcon className="h-4 w-4" />
          </Link>
        </div>

        <RoleSwitcher />
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-4"
        aria-label="Panel klubowy"
      >
        <Link
          href="/klub"
          onClick={onNavigate}
          className={
            pathname === "/klub"
              ? "klub-nav-link-active mb-3 block border-l-2 border-brand bg-brand/10 px-3 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase"
              : "klub-nav-link mb-3 block border-l-2 border-transparent px-3 py-2 font-display text-xs tracking-[0.12em] text-paper/55 uppercase transition-colors hover:text-paper"
          }
        >
          Pulpit
        </Link>

        {categories.map((category) => {
          const collapsed = Boolean(collapsedCategories[category.id]);
          return (
            <div key={category.id} className="mb-3">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between px-3 py-2 font-display text-[10px] tracking-[0.16em] text-paper/40 uppercase transition-colors hover:text-paper/70"
                aria-expanded={!collapsed}
              >
                <span>{category.label}</span>
                <span aria-hidden="true">{collapsed ? "+" : "−"}</span>
              </button>
              {!collapsed ? (
                <ul className="space-y-0.5">
                  {category.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={
                            active
                              ? "klub-nav-link-active block border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-paper"
                              : "klub-nav-link block border-l-2 border-transparent px-3 py-2 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function KlubNav() {
  const { mobileNavOpen, setMobileNavOpen } = useKlub();

  return (
    <>
      <aside className="klub-nav-desktop hidden h-full min-h-0 w-64 shrink-0 overflow-hidden border-r border-paper/10 bg-chrome/80 lg:block">
        <NavBody />
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-chrome/70"
            aria-label="Zamknij menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative h-full min-h-0 w-[min(100%,18rem)] overflow-hidden border-r border-paper/10 bg-chrome shadow-2xl">
            <NavBody onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
