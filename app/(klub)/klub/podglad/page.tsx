"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";

const FILTER_ROLES: Array<Role | "all"> = [
  "all",
  "zawodnik",
  "trener",
  "admin",
  "superadmin",
];

export default function PodgladPage() {
  const toast = useToast();
  const router = useRouter();
  const { viewAs, setViewAs, clearViewAs, setActiveRole } = useKlub();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [startingId, setStartingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await klubFetch<PublicUser[]>("/api/users", { viewAsUserId: null }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd listy kont");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && !u.roles.includes(roleFilter)) return false;
      if (!q) return true;
      return (
        u.display_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter]);

  async function startPreview(u: PublicUser, roleHint?: Role) {
    setStartingId(`${u.id}:${roleHint ?? ""}`);
    setError(null);
    try {
      const target = await klubFetch<PublicUser>("/api/admin/preview/start", {
        method: "POST",
        body: { user_id: u.id },
        viewAsUserId: null,
      });
      setViewAs({
        userId: target.id,
        displayName: target.display_name,
        email: target.email,
        roles: target.roles,
      });
      const pick =
        roleHint ??
        target.roles.find((r) => r !== "superadmin") ??
        target.roles[0];
      if (pick) setActiveRole(pick);
      toast.success("Włączono podgląd", target.display_name);
      if (pick === "zawodnik") {
        router.push("/panel");
      } else {
        router.push("/klub");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wejść w podgląd";
      setError(msg);
      toast.error("Podgląd", msg);
    } finally {
      setStartingId(null);
    }
  }

  async function stopPreview() {
    await clearViewAs();
    toast.info("Zakończono podgląd");
  }

  return (
    <div className="animate-rise max-w-4xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Podgląd kont / ról
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Wejdź w perspektywę innego konta bez logowania — navbar, panel i dane
          „moje” przełączają się na podglądany widok (tylko odczyt).
        </p>
      </div>

      {viewAs ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <p>
            Aktywny podgląd: <strong>{viewAs.displayName}</strong> ({viewAs.email})
          </p>
          <button
            type="button"
            onClick={() => void stopPreview()}
            className="border border-paper/30 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
          >
            Zakończ
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 space-y-1.5 text-sm">
          <span className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Szukaj
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Imię lub e-mail…"
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="space-y-1.5 text-sm sm:w-48">
          <span className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Rola
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {FILTER_ROLES.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "Wszystkie" : ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      {!loading && filtered.length === 0 ? (
        <p className="text-sm text-paper/50">Brak kont pasujących do filtra.</p>
      ) : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {filtered.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium">{u.display_name}</p>
              <p className="text-xs text-paper/50">
                {u.email} · {u.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                {!u.is_active ? " · nieaktywne" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {u.roles.map((role) => {
                const busy = startingId === `${u.id}:${role}`;
                return (
                  <button
                    key={role}
                    type="button"
                    disabled={!u.is_active || Boolean(startingId)}
                    onClick={() => void startPreview(u, role)}
                    className="border border-paper/20 px-2.5 py-1 font-display text-[10px] tracking-[0.1em] uppercase transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busy ? "…" : `Jako ${ROLE_LABELS[role]}`}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
