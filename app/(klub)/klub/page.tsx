"use client";

import Link from "next/link";
import { filterNavForRole, ROLE_LABELS } from "@/lib/klub-nav";
import { useKlub } from "@/components/klub/KlubProvider";

export default function KlubHomePage() {
  const { user, activeRole } = useKlub();
  if (!user) return null;

  const categories = filterNavForRole(activeRole, user.roles);
  const links = categories.flatMap((c) => c.items);

  return (
    <div className="animate-rise max-w-4xl">
      <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
        Pulpit
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl">
        Cześć, {user.display_name}
      </h1>
      <p className="mt-3 text-paper/60">
        Widok: {ROLE_LABELS[activeRole]} · {user.email}
      </p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {user.roles.includes("superadmin") ? (
          <li>
            <Link
              href="/panel"
              className="block border border-brand/40 bg-brand/10 px-5 py-4 transition-colors hover:border-brand hover:bg-brand/20"
            >
              <span className="font-display text-sm tracking-[0.12em] uppercase">
                Panel zawodnika
              </span>
              <span className="mt-1 block text-xs text-paper/55">
                Wejdź w widok i moduły zawodnika
              </span>
            </Link>
          </li>
        ) : null}
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block border border-paper/10 bg-paper/[0.03] px-5 py-4 transition-colors hover:border-brand/40 hover:bg-brand/10"
            >
              <span className="font-display text-sm tracking-[0.12em] uppercase">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
