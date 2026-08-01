"use client";

import { useRouter } from "next/navigation";
import { ROLE_LABELS, viewableRolesFor } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "./KlubProvider";

export function RoleSwitcher() {
  const router = useRouter();
  const { user, activeRole, setActiveRole } = useKlub();
  if (!user) return null;

  const roles = viewableRolesFor(user.roles);
  if (roles.length <= 1) {
    return (
      <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
        {ROLE_LABELS[activeRole]}
      </p>
    );
  }

  function selectRole(role: Role) {
    if (role === "zawodnik") {
      router.push("/panel");
      return;
    }
    setActiveRole(role);
  }

  return (
    <div>
      <p className="font-display text-[10px] tracking-[0.16em] text-paper/40 uppercase">
        Widok roli
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {roles.map((role) => {
          const active = role === activeRole;
          return (
            <button
              key={role}
              type="button"
              onClick={() => selectRole(role)}
              className={
                active
                  ? "border border-brand bg-brand/20 px-2.5 py-1 font-display text-[11px] tracking-[0.1em] text-paper uppercase"
                  : "border border-paper/15 px-2.5 py-1 font-display text-[11px] tracking-[0.1em] text-paper/55 uppercase transition-colors hover:border-paper/40 hover:text-paper"
              }
            >
              {ROLE_LABELS[role]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
