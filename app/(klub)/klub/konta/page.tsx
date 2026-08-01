"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { klubFetch } from "@/lib/klub-api";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";

type PublicUser = {
  id: string;
  email: string;
  display_name: string;
  roles: Role[];
  is_active: boolean;
};

type AthleteProfile = {
  id: string;
  user_id: string;
  display_name: string;
  bodyweight_kg: number | null;
  category: string | null;
  notes: string | null;
};

const ALL_ROLES: Role[] = ["zawodnik", "trener", "admin", "superadmin"];

export default function KontaPage() {
  const { user, activeRole, viewAs } = useKlub();
  const showUsersSection =
    activeRole === "admin" || activeRole === "superadmin";
  const canManageUsers = showUsersSection;

  const [users, setUsers] = useState<PublicUser[]>([]);
  const [profiles, setProfiles] = useState<AthleteProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRoles, setNewRoles] = useState<Role[]>(["zawodnik"]);

  const [profileName, setProfileName] = useState("");
  const [profileUserId, setProfileUserId] = useState("");
  const [profileCategory, setProfileCategory] = useState("");
  const [profileWeight, setProfileWeight] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const viewAsUserId = viewAs?.userId ?? null;
      if (showUsersSection) {
        const u = await klubFetch<PublicUser[]>("/api/users", { viewAsUserId });
        setUsers(u);
      } else {
        setUsers([]);
      }
      const p = await klubFetch<AthleteProfile[]>("/api/profiles", {
        viewAsUserId,
      });
      setProfiles(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }, [showUsersSection, viewAs]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    try {
      await klubFetch("/api/users", {
        method: "POST",
        body: {
          email: newEmail,
          password: newPassword,
          display_name: newName,
          roles: newRoles,
        },
      });
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewRoles(["zawodnik"]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się utworzyć");
    }
  }

  async function toggleBan(u: PublicUser) {
    try {
      await klubFetch(`/api/users/${u.id}`, {
        method: "PATCH",
        body: { is_active: !u.is_active },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd banowania");
    }
  }

  async function removeUser(id: string) {
    if (!confirm("Na pewno usunąć konto?")) return;
    try {
      await klubFetch(`/api/users/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd usuwania");
    }
  }

  async function createProfile(e: FormEvent) {
    e.preventDefault();
    try {
      await klubFetch("/api/profiles", {
        method: "POST",
        body: {
          user_id: profileUserId || "manual",
          display_name: profileName,
          bodyweight_kg: profileWeight ? Number(profileWeight) : null,
          category: profileCategory || null,
          notes: null,
        },
      });
      setProfileName("");
      setProfileUserId("");
      setProfileCategory("");
      setProfileWeight("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd profilu");
    }
  }

  async function removeProfile(id: string) {
    if (!confirm("Usunąć profil zawodnika?")) return;
    try {
      await klubFetch(`/api/profiles/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd usuwania profilu");
    }
  }

  function toggleRole(role: Role) {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  return (
    <div className="animate-rise max-w-5xl space-y-10">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Ludzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Konta i profile
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          {showUsersSection
            ? "Zarządzanie kontami użytkowników oraz profilami zawodników."
            : "Zarządzanie profilami zawodników (bez tworzenia kont staff)."}
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      {showUsersSection ? (
        <section className="space-y-4">
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">
            Konta
          </h2>
          <div className="overflow-x-auto border border-paper/10">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-paper/5 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                <tr>
                  <th className="px-3 py-2">Nazwa</th>
                  <th className="px-3 py-2">E-mail</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-paper/10">
                    <td className="px-3 py-2">{u.display_name}</td>
                    <td className="px-3 py-2 text-paper/70">{u.email}</td>
                    <td className="px-3 py-2 text-paper/70">
                      {u.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                    </td>
                    <td className="px-3 py-2">
                      {u.is_active ? "Aktywne" : "Zbanowane"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="text-xs text-paper/70 underline-offset-2 hover:underline"
                          onClick={() => void toggleBan(u)}
                        >
                          {u.is_active ? "Banuj" : "Odbanuj"}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-brand underline-offset-2 hover:underline"
                          onClick={() => void removeUser(u.id)}
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canManageUsers ? (
            <form
              onSubmit={createUser}
              className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
            >
              <h3 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
                Nowe konto
              </h3>
              <input
                className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="Nazwa"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <input
                className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="E-mail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <input
                className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="Hasło"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="flex flex-wrap gap-2 self-center">
                {ALL_ROLES.filter(
                  (r) =>
                    r !== "superadmin" || user?.roles.includes("superadmin"),
                ).map((role) => (
                  <label key={role} className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={newRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                    />
                    {ROLE_LABELS[role]}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase sm:col-span-2 sm:justify-self-start"
              >
                Dodaj konto
              </button>
            </form>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">
          Profile zawodników
        </h2>
        <div className="overflow-x-auto border border-paper/10">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-paper/5 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              <tr>
                <th className="px-3 py-2">Imię</th>
                <th className="px-3 py-2">Kategoria</th>
                <th className="px-3 py-2">Masa</th>
                <th className="px-3 py-2">User ID</th>
                <th className="px-3 py-2">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-paper/10">
                  <td className="px-3 py-2">{p.display_name}</td>
                  <td className="px-3 py-2 text-paper/70">
                    {p.category ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-paper/70">
                    {p.bodyweight_kg != null ? `${p.bodyweight_kg} kg` : "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-paper/50">
                    {p.user_id}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="text-xs text-brand underline-offset-2 hover:underline"
                      onClick={() => void removeProfile(p.id)}
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-paper/45">
                    Brak profili.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={createProfile}
          className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
        >
          <h3 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
            Nowy profil zawodnika
          </h3>
          <input
            className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Imię i nazwisko"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />
          <input
            className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="ID konta (opcjonalnie)"
            value={profileUserId}
            onChange={(e) => setProfileUserId(e.target.value)}
          />
          <input
            className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Kategoria (np. −73 kg)"
            value={profileCategory}
            onChange={(e) => setProfileCategory(e.target.value)}
          />
          <input
            className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Masa ciała (kg)"
            type="number"
            step="0.1"
            value={profileWeight}
            onChange={(e) => setProfileWeight(e.target.value)}
          />
          <button
            type="submit"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase sm:col-span-2 sm:justify-self-start"
          >
            Dodaj profil
          </button>
        </form>
      </section>
    </div>
  );
}
