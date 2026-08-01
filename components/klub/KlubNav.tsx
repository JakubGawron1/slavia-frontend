"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterNavForRole } from "@/lib/klub-nav";
import { useKlub } from "./KlubProvider";
import { RoleSwitcher } from "./RoleSwitcher";

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, activeRole, collapsedCategories, toggleCategory } = useKlub();
  if (!user) return null;

  const categories = filterNavForRole(activeRole, user.roles);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-paper/10 px-4 py-5">
        <Link
          href="/klub"
          onClick={onNavigate}
          className="font-display text-sm tracking-[0.2em] text-brand uppercase"
        >
          CKS Slavia
        </Link>
        <p className="mt-1 truncate text-xs text-paper/50">{user.display_name}</p>
        <div className="mt-4">
          <RoleSwitcher />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Panel klubowy">
        <Link
          href="/klub"
          onClick={onNavigate}
          className={
            pathname === "/klub"
              ? "mb-3 block border-l-2 border-brand bg-brand/10 px-3 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase"
              : "mb-3 block border-l-2 border-transparent px-3 py-2 font-display text-xs tracking-[0.12em] text-paper/55 uppercase transition-colors hover:text-paper"
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
                              ? "block border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-paper"
                              : "block border-l-2 border-transparent px-3 py-2 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
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
      <aside className="hidden w-64 shrink-0 border-r border-paper/10 bg-ink/80 lg:block">
        <NavBody />
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/70"
            aria-label="Zamknij menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative h-full w-[min(100%,18rem)] border-r border-paper/10 bg-ink shadow-2xl">
            <NavBody onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
