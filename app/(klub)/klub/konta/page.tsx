"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AthleteProfile, PublicUser } from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { ImageHolder } from "@/components/settings/ImageHolder";

const ALL_ROLES: Role[] = ["zawodnik", "trener", "admin", "superadmin"];

type AccountLinkMode = "existing" | "new" | "none";
type ProfileSex = "" | "male" | "female";

const inputClass =
  "border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand";
const formClass =
  "grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2";

function emptyProfileForm() {
  return {
    name: "",
    accountMode: "existing" as AccountLinkMode,
    userId: "",
    accountEmail: "",
    accountPassword: "",
    category: "",
    weight: "",
    sex: "" as ProfileSex,
    birthDate: "",
    photoUrl: "",
    notes: "",
  };
}

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
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newRoles, setNewRoles] = useState<Role[]>(["zawodnik"]);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editRoles, setEditRoles] = useState<Role[]>([]);

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const viewAsUserId = viewAs?.userId ?? null;
      const [u, p] = await Promise.all([
        klubFetch<PublicUser[]>("/api/users", { viewAsUserId }),
        klubFetch<AthleteProfile[]>("/api/profiles", { viewAsUserId }),
      ]);
      setUsers(u);
      setProfiles(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }, [viewAs]);

  useEffect(() => {
    void load();
  }, [load]);

  const athleteUsers = useMemo(
    () => users.filter((u) => u.roles.includes("zawodnik") && u.is_active),
    [users],
  );

  const availableAthletes = useMemo(() => {
    const linked = new Set(
      profiles
        .filter((p) => p.id !== editingProfileId)
        .map((p) => p.user_id)
        .filter((id) => id && id !== "manual"),
    );
    return athleteUsers.filter((u) => !linked.has(u.id));
  }, [athleteUsers, profiles, editingProfileId]);

  const usersById = useMemo(() => {
    const map = new Map<string, PublicUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  function setProfileField<K extends keyof ReturnType<typeof emptyProfileForm>>(
    key: K,
    value: ReturnType<typeof emptyProfileForm>[K],
  ) {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetProfileForm() {
    setEditingProfileId(null);
    setProfileForm(emptyProfileForm());
  }

  function startEditUser(u: PublicUser) {
    setError(null);
    setEditingUserId(u.id);
    setEditName(u.display_name);
    setEditEmail(u.email);
    setEditPassword("");
    setEditPhotoUrl(u.photo_url ?? "");
    setEditRoles([...u.roles]);
  }

  function cancelEditUser() {
    setEditingUserId(null);
    setEditName("");
    setEditEmail("");
    setEditPassword("");
    setEditPhotoUrl("");
    setEditRoles([]);
  }

  function startEditProfile(p: AthleteProfile) {
    setError(null);
    setEditingProfileId(p.id);
    const linked =
      p.user_id && p.user_id !== "manual" ? ("existing" as const) : ("none" as const);
    setProfileForm({
      name: p.display_name,
      accountMode: linked,
      userId: linked === "existing" ? p.user_id : "",
      accountEmail: "",
      accountPassword: "",
      category: p.category ?? "",
      weight: p.bodyweight_kg != null ? String(p.bodyweight_kg) : "",
      sex: (p.sex === "male" || p.sex === "female" ? p.sex : "") as ProfileSex,
      birthDate: p.birth_date ?? "",
      photoUrl: p.photo_url ?? "",
      notes: p.notes ?? "",
    });
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await klubFetch("/api/users", {
        method: "POST",
        body: {
          email: newEmail,
          password: newPassword,
          display_name: newName,
          roles: newRoles,
          photo_url: newPhotoUrl.trim() || null,
        },
      });
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewPhotoUrl("");
      setNewRoles(["zawodnik"]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się utworzyć");
    }
  }

  async function saveUser(e: FormEvent) {
    e.preventDefault();
    if (!editingUserId) return;
    setError(null);
    try {
      const body: Record<string, unknown> = {
        display_name: editName.trim(),
        email: editEmail.trim(),
        roles: editRoles,
        photo_url: editPhotoUrl.trim() || "",
      };
      if (editPassword.trim()) {
        body.password = editPassword;
      }
      await klubFetch(`/api/users/${editingUserId}`, {
        method: "PATCH",
        body,
      });
      cancelEditUser();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisu konta");
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
      if (editingUserId === id) cancelEditUser();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd usuwania");
    }
  }

  async function submitProfile(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      let userId = "manual";
      const mode = profileForm.accountMode;

      if (mode === "existing") {
        if (!profileForm.userId) {
          setError("Wybierz konto zawodnika z listy.");
          return;
        }
        userId = profileForm.userId;
      } else if (mode === "new") {
        if (!profileForm.accountEmail.trim() || !profileForm.accountPassword) {
          setError("Podaj e-mail i hasło dla nowego konta.");
          return;
        }
        const created = await klubFetch<PublicUser>("/api/users", {
          method: "POST",
          body: {
            email: profileForm.accountEmail.trim(),
            password: profileForm.accountPassword,
            display_name: profileForm.name,
            roles: ["zawodnik"],
            photo_url: profileForm.photoUrl.trim() || null,
          },
        });
        userId = created.id;
      }

      const body = {
        user_id: userId,
        display_name: profileForm.name,
        bodyweight_kg: profileForm.weight ? Number(profileForm.weight) : null,
        category: profileForm.category || null,
        notes: profileForm.notes.trim() || null,
        photo_url: profileForm.photoUrl.trim() || null,
        birth_date: profileForm.birthDate || null,
        sex: profileForm.sex || null,
      };

      if (editingProfileId) {
        await klubFetch(`/api/profiles/${editingProfileId}`, {
          method: "PATCH",
          body,
        });
      } else {
        await klubFetch("/api/profiles", {
          method: "POST",
          body,
        });
      }

      resetProfileForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd profilu");
    }
  }

  async function removeProfile(id: string) {
    if (!confirm("Usunąć profil zawodnika?")) return;
    try {
      await klubFetch(`/api/profiles/${id}`, { method: "DELETE" });
      if (editingProfileId === id) resetProfileForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd usuwania profilu");
    }
  }

  function toggleRole(role: Role, target: "new" | "edit") {
    if (target === "new") {
      setNewRoles((prev) =>
        prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
      );
      return;
    }
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  function accountLabel(userId: string) {
    if (!userId || userId === "manual") return "Bez konta";
    const linked = usersById.get(userId);
    if (linked) return `${linked.display_name} (${linked.email})`;
    return userId;
  }

  const roleCheckboxes = (selected: Role[], target: "new" | "edit") =>
    ALL_ROLES.filter(
      (r) => r !== "superadmin" || user?.roles.includes("superadmin"),
    ).map((role) => (
      <label key={role} className="flex items-center gap-1.5 text-xs">
        <input
          type="checkbox"
          checked={selected.includes(role)}
          onChange={() => toggleRole(role, target)}
        />
        {ROLE_LABELS[role]}
      </label>
    ));

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
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
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
                  <th className="px-3 py-2">Zdjęcie</th>
                  <th className="px-3 py-2">Nazwa</th>
                  <th className="px-3 py-2">E-mail</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-t border-paper/10 ${
                      editingUserId === u.id ? "bg-brand/5" : ""
                    }`}
                  >
                    <td className="px-3 py-2">
                      <div className="h-8 w-8 overflow-hidden border border-paper/15">
                        {u.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.photo_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageHolder />
                        )}
                      </div>
                    </td>
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
                          onClick={() => startEditUser(u)}
                        >
                          Edytuj
                        </button>
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

          {editingUserId ? (
            <form onSubmit={(e) => void saveUser(e)} className={formClass}>
              <h3 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
                Edycja konta
              </h3>
              <input
                className={inputClass}
                placeholder="Nazwa"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <input
                className={inputClass}
                placeholder="E-mail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
              <input
                className={`${inputClass} sm:col-span-2`}
                placeholder="Nowe hasło (opcjonalnie)"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                minLength={6}
              />
              <PhotoUploadField
                className="sm:col-span-2"
                value={editPhotoUrl}
                onChange={setEditPhotoUrl}
                label="Zdjęcie konta"
                hint="Dla zawodnika synchronizowane z profilem publicznym."
                inputClassName={inputClass}
              />
              <div className="flex flex-wrap gap-2 self-center sm:col-span-2">
                {roleCheckboxes(editRoles, "edit")}
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="submit"
                  className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
                >
                  Zapisz konto
                </button>
                <button
                  type="button"
                  className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase text-paper/70"
                  onClick={cancelEditUser}
                >
                  Anuluj
                </button>
              </div>
            </form>
          ) : null}

          {canManageUsers && !editingUserId ? (
            <form onSubmit={createUser} className={formClass}>
              <h3 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
                Nowe konto
              </h3>
              <input
                className={inputClass}
                placeholder="Nazwa"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <input
                className={inputClass}
                placeholder="E-mail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <input
                className={inputClass}
                placeholder="Hasło"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <PhotoUploadField
                className="sm:col-span-2"
                value={newPhotoUrl}
                onChange={setNewPhotoUrl}
                label="Zdjęcie konta"
                hint="Opcjonalnie — możesz też dodać później."
                inputClassName={inputClass}
              />
              <div className="flex flex-wrap gap-2 self-center sm:col-span-2">
                {roleCheckboxes(newRoles, "new")}
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
                <th className="px-3 py-2">Konto</th>
                <th className="px-3 py-2">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t border-paper/10 ${
                    editingProfileId === p.id ? "bg-brand/5" : ""
                  }`}
                >
                  <td className="px-3 py-2">{p.display_name}</td>
                  <td className="px-3 py-2 text-paper/70">
                    {p.category ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-paper/70">
                    {p.bodyweight_kg != null ? `${p.bodyweight_kg} kg` : "—"}
                  </td>
                  <td className="px-3 py-2 text-paper/70">
                    {accountLabel(p.user_id)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="text-xs text-paper/70 underline-offset-2 hover:underline"
                        onClick={() => startEditProfile(p)}
                      >
                        Edytuj
                      </button>
                      <button
                        type="button"
                        className="text-xs text-brand underline-offset-2 hover:underline"
                        onClick={() => void removeProfile(p.id)}
                      >
                        Usuń
                      </button>
                    </div>
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
          onSubmit={(e) => void submitProfile(e)}
          className={formClass}
        >
          <h3 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
            {editingProfileId ? "Edycja profilu" : "Nowy profil zawodnika"}
          </h3>
          <input
            className={`${inputClass} sm:col-span-2`}
            placeholder="Imię i nazwisko"
            value={profileForm.name}
            onChange={(e) => setProfileField("name", e.target.value)}
            required
          />

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              Powiązanie z kontem
            </span>
            <select
              className={inputClass}
              value={profileForm.accountMode}
              onChange={(e) => {
                const mode = e.target.value as AccountLinkMode;
                setProfileForm((prev) => ({
                  ...prev,
                  accountMode: mode,
                  userId: "",
                  accountEmail: "",
                  accountPassword: "",
                }));
              }}
            >
              <option value="existing">Połącz z istniejącym kontem</option>
              {!editingProfileId ? (
                <option value="new">Utwórz nowe konto zawodnika</option>
              ) : null}
              <option value="none">Bez konta</option>
            </select>
          </label>

          {profileForm.accountMode === "existing" ? (
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                Konto zawodnika
              </span>
              <select
                className={inputClass}
                value={profileForm.userId}
                onChange={(e) => {
                  const id = e.target.value;
                  const linked = usersById.get(id);
                  setProfileForm((prev) => ({
                    ...prev,
                    userId: id,
                    photoUrl:
                      prev.photoUrl.trim() ||
                      linked?.photo_url?.trim() ||
                      prev.photoUrl,
                  }));
                }}
                required
              >
                <option value="">— Wybierz konto —</option>
                {availableAthletes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.display_name} ({u.email})
                  </option>
                ))}
              </select>
              {availableAthletes.length === 0 ? (
                <span className="text-xs text-paper/45">
                  Brak wolnych kont z rolą zawodnik. Utwórz nowe konto albo wybierz
                  „Bez konta”.
                </span>
              ) : null}
            </label>
          ) : null}

          {profileForm.accountMode === "new" && !editingProfileId ? (
            <>
              <input
                className={inputClass}
                placeholder="E-mail konta"
                type="email"
                value={profileForm.accountEmail}
                onChange={(e) => setProfileField("accountEmail", e.target.value)}
                required
              />
              <input
                className={inputClass}
                placeholder="Hasło konta"
                type="password"
                value={profileForm.accountPassword}
                onChange={(e) =>
                  setProfileField("accountPassword", e.target.value)
                }
                required
                minLength={6}
              />
              <p className="text-xs text-paper/45 sm:col-span-2">
                Zostanie utworzone konto z rolą zawodnik i powiązane z tym
                profilem.
              </p>
            </>
          ) : null}

          <input
            className={inputClass}
            placeholder="Kategoria (np. −73 kg)"
            value={profileForm.category}
            onChange={(e) => setProfileField("category", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Masa ciała (kg)"
            type="number"
            step="0.1"
            value={profileForm.weight}
            onChange={(e) => setProfileField("weight", e.target.value)}
          />
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              Płeć (Sinclair)
            </span>
            <select
              className={inputClass}
              value={profileForm.sex}
              onChange={(e) =>
                setProfileField("sex", e.target.value as ProfileSex)
              }
            >
              <option value="">—</option>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              Data urodzenia
            </span>
            <input
              className={inputClass}
              type="date"
              value={profileForm.birthDate}
              onChange={(e) => setProfileField("birthDate", e.target.value)}
            />
          </label>
          <PhotoUploadField
            className="sm:col-span-2"
            value={profileForm.photoUrl}
            onChange={(url) => setProfileField("photoUrl", url)}
            label="Zdjęcie profilowe"
            hint="Przy powiązanym koncie zawodnika synchronizowane ze zdjęciem konta."
            inputClassName={inputClass}
          />
          <textarea
            className={`min-h-[4.5rem] ${inputClass} sm:col-span-2`}
            placeholder="Krótki opis (widoczny na stronie Zawodnicy)"
            value={profileForm.notes}
            onChange={(e) => setProfileField("notes", e.target.value)}
          />
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              {editingProfileId ? "Zapisz profil" : "Dodaj profil"}
            </button>
            {editingProfileId ? (
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase text-paper/70"
                onClick={resetProfileForm}
              >
                Anuluj
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
