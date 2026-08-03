"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicUser } from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";

export default function PodgladPage() {
  const toast = useToast();
  const { viewAs, setViewAs, clearViewAs, setActiveRole } = useKlub();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await klubFetch<PublicUser[]>("/api/users"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd listy kont");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function startPreview(u: PublicUser, roleHint?: Role) {
    try {
      const target = await klubFetch<PublicUser>("/api/admin/preview/start", {
        method: "POST",
        body: { user_id: u.id },
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
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wejść w podgląd";
      setError(msg);
      toast.error("Podgląd", msg);
    }
  }

  async function stopPreview() {
    try {
      await klubFetch("/api/admin/preview/stop", { method: "POST", body: {} });
      toast.info("Zakończono podgląd");
    } catch {
      /* ignore */
    }
    clearViewAs();
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
          Wejdź w perspektywę innego konta bez logowania — navbar i kontekst UI
          przełączają się na podglądany widok.
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

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium">{u.display_name}</p>
              <p className="text-xs text-paper/50">
                {u.email} · {u.roles.map((r) => ROLE_LABELS[r]).join(", ")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {u.roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => void startPreview(u, role)}
                  className="border border-paper/20 px-2.5 py-1 font-display text-[10px] tracking-[0.1em] uppercase transition-colors hover:border-brand"
                >
                  Jako {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
