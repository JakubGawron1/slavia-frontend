"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AthleteProfile, PublicUser } from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { ImageHolder } from "@/components/settings/ImageHolder";
import { useToast } from "@/components/toast/ToastProvider";
import { Modal } from "@/components/ui/Modal";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";

const ALL_ROLES: Role[] = ["zawodnik", "trener", "admin", "superadmin"];

type AccountLinkMode = "existing" | "new" | "none";
type ProfileSex = "" | "male" | "female";
type UserModalMode = "closed" | "create" | "edit";
type ProfileModalMode = "closed" | "create" | "edit";

const inputClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";
const formGridClass = "grid gap-3 sm:grid-cols-2";

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

function emptyUserCreateForm() {
  return {
    email: "",
    password: "",
    name: "",
    photoUrl: "",
    roles: ["zawodnik"] as Role[],
  };
}

export default function KontaPage() {
  const toast = useToast();
  const { user, activeRole, viewAs } = useKlub();
  const showUsersSection =
    activeRole === "admin" || activeRole === "superadmin";
  const canManageUsers = showUsersSection && !viewAs;

  const [users, setUsers] = useState<PublicUser[]>([]);
  const [profiles, setProfiles] = useState<AthleteProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [userModal, setUserModal] = useState<UserModalMode>("closed");
  const [createUserForm, setCreateUserForm] = useState(emptyUserCreateForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editRoles, setEditRoles] = useState<Role[]>([]);

  const [profileModal, setProfileModal] = useState<ProfileModalMode>("closed");
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);

  const computedCategory = useMemo(() => {
    const bw = profileForm.weight ? Number(profileForm.weight) : NaN;
    if (!Number.isFinite(bw) || bw <= 0) return null;
    return resolveWeightCategory({
      birthDate: profileForm.birthDate || null,
      sex: profileForm.sex || null,
      bodyweightKg: bw,
    });
  }, [profileForm.weight, profileForm.birthDate, profileForm.sex]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, p] = await Promise.all([
        klubFetch<PublicUser[]>("/api/users"),
        klubFetch<AthleteProfile[]>("/api/profiles"),
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

  function closeUserModal() {
    setUserModal("closed");
    setEditingUserId(null);
    setCreateUserForm(emptyUserCreateForm());
    setEditName("");
    setEditEmail("");
    setEditPassword("");
    setEditPhotoUrl("");
    setEditRoles([]);
  }

  function closeProfileModal() {
    setProfileModal("closed");
    setEditingProfileId(null);
    setProfileForm(emptyProfileForm());
  }

  function openCreateUser() {
    setError(null);
    setCreateUserForm(emptyUserCreateForm());
    setUserModal("create");
  }

  function openEditUser(u: PublicUser) {
    setError(null);
    setEditingUserId(u.id);
    setEditName(u.display_name);
    setEditEmail(u.email);
    setEditPassword("");
    setEditPhotoUrl(u.photo_url ?? "");
    setEditRoles([...u.roles]);
    setUserModal("edit");
  }

  function openCreateProfile() {
    setError(null);
    setEditingProfileId(null);
    setProfileForm(emptyProfileForm());
    setProfileModal("create");
  }

  function openEditProfile(p: AthleteProfile) {
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
    setProfileModal("edit");
  }

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await klubFetch("/api/users", {
        method: "POST",
        body: {
          email: createUserForm.email,
          password: createUserForm.password,
          display_name: createUserForm.name,
          roles: createUserForm.roles,
          photo_url: createUserForm.photoUrl.trim() || null,
        },
      });
      toast.success(
        "Utworzono konto",
        createUserForm.name || createUserForm.email,
      );
      closeUserModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się utworzyć";
      setError(msg);
      toast.error("Tworzenie konta", msg);
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
      toast.success("Zapisano konto", editName.trim() || editEmail.trim());
      closeUserModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd zapisu konta";
      setError(msg);
      toast.error("Zapis konta", msg);
    }
  }

  async function toggleBan(u: PublicUser) {
    try {
      await klubFetch(`/api/users/${u.id}`, {
        method: "PATCH",
        body: { is_active: !u.is_active },
      });
      toast.success(
        u.is_active ? "Zablokowano konto" : "Odblokowano konto",
        u.display_name,
      );
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd banowania";
      setError(msg);
      toast.error("Status konta", msg);
    }
  }

  async function removeUser(id: string) {
    if (!confirm("Na pewno usunąć konto?")) return;
    try {
      await klubFetch(`/api/users/${id}`, { method: "DELETE" });
      toast.success("Usunięto konto");
      if (editingUserId === id) closeUserModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd usuwania";
      setError(msg);
      toast.error("Usuwanie konta", msg);
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
          toast.error("Profil", "Wybierz konto zawodnika z listy.");
          return;
        }
        userId = profileForm.userId;
      } else if (mode === "new") {
        if (!profileForm.accountEmail.trim() || !profileForm.accountPassword) {
          setError("Podaj e-mail i hasło dla nowego konta.");
          toast.error("Profil", "Podaj e-mail i hasło dla nowego konta.");
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
        category: computedCategory,
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
        toast.success("Zapisano profil", profileForm.name);
      } else {
        await klubFetch("/api/profiles", {
          method: "POST",
          body,
        });
        toast.success("Dodano profil", profileForm.name);
      }

      closeProfileModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd profilu";
      setError(msg);
      toast.error("Profil", msg);
    }
  }

  async function removeProfile(id: string) {
    if (!confirm("Usunąć profil zawodnika?")) return;
    try {
      await klubFetch(`/api/profiles/${id}`, { method: "DELETE" });
      toast.success("Usunięto profil");
      if (editingProfileId === id) closeProfileModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd usuwania profilu";
      setError(msg);
      toast.error("Usuwanie profilu", msg);
    }
  }

  function toggleCreateRole(role: Role) {
    setCreateUserForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }

  function toggleEditRole(role: Role) {
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

  const roleOptions = ALL_ROLES.filter(
    (r) => r !== "superadmin" || user?.roles.includes("superadmin"),
  );

  const sectionHeader =
    "flex flex-wrap items-end justify-between gap-3";
  const addButtonClass =
    "border border-brand/50 bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25";

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

      {error && userModal === "closed" && profileModal === "closed" ? (
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
          <div className={sectionHeader}>
            <h2 className="font-display text-sm tracking-[0.14em] uppercase">
              Konta
            </h2>
            {canManageUsers ? (
              <button
                type="button"
                className={addButtonClass}
                onClick={openCreateUser}
              >
                Dodaj konto
              </button>
            ) : null}
          </div>
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
                          onClick={() => openEditUser(u)}
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
                {users.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-paper/45">
                      Brak kont.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className={sectionHeader}>
          <h2 className="font-display text-sm tracking-[0.14em] uppercase">
            Profile zawodników
          </h2>
          <button
            type="button"
            className={addButtonClass}
            onClick={openCreateProfile}
          >
            Dodaj profil
          </button>
        </div>
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
                        onClick={() => openEditProfile(p)}
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
      </section>

      <Modal
        open={userModal === "create"}
        title="Nowe konto"
        onClose={closeUserModal}
        wide
      >
        {error ? (
          <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={(e) => void createUser(e)} className={formGridClass}>
          <input
            className={inputClass}
            placeholder="Nazwa"
            value={createUserForm.name}
            onChange={(e) =>
              setCreateUserForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            className={inputClass}
            placeholder="E-mail"
            type="email"
            value={createUserForm.email}
            onChange={(e) =>
              setCreateUserForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <input
            className={`${inputClass} sm:col-span-2`}
            placeholder="Hasło"
            type="password"
            value={createUserForm.password}
            onChange={(e) =>
              setCreateUserForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            minLength={6}
          />
          <PhotoUploadField
            className="sm:col-span-2"
            value={createUserForm.photoUrl}
            onChange={(url) =>
              setCreateUserForm((prev) => ({ ...prev, photoUrl: url }))
            }
            label="Zdjęcie konta"
            hint="Opcjonalnie — możesz też dodać później."
            inputClassName={inputClass}
          />
          <div className="flex flex-wrap gap-2 self-center sm:col-span-2">
            {roleOptions.map((role) => (
              <label key={role} className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={createUserForm.roles.includes(role)}
                  onChange={() => toggleCreateRole(role)}
                />
                {ROLE_LABELS[role]}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Dodaj konto
            </button>
            <button
              type="button"
              className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase text-paper/70"
              onClick={closeUserModal}
            >
              Anuluj
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={userModal === "edit"}
        title="Edycja konta"
        onClose={closeUserModal}
        wide
      >
        {error ? (
          <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={(e) => void saveUser(e)} className={formGridClass}>
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
            {roleOptions.map((role) => (
              <label key={role} className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={editRoles.includes(role)}
                  onChange={() => toggleEditRole(role)}
                />
                {ROLE_LABELS[role]}
              </label>
            ))}
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
              onClick={closeUserModal}
            >
              Anuluj
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={profileModal !== "closed"}
        title={profileModal === "edit" ? "Edycja profilu" : "Nowy profil zawodnika"}
        onClose={closeProfileModal}
        wide
      >
        {error ? (
          <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <form
          onSubmit={(e) => void submitProfile(e)}
          className={formGridClass}
        >
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
              {profileModal === "create" ? (
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

          {profileForm.accountMode === "new" && profileModal === "create" ? (
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
            placeholder="Masa ciała (kg)"
            type="number"
            step="0.1"
            value={profileForm.weight}
            onChange={(e) => setProfileField("weight", e.target.value)}
          />
          <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
            {computedCategory ? (
              <>
                Kategoria:{" "}
                <span className="font-medium text-paper">{computedCategory}</span>
              </>
            ) : profileForm.weight &&
              (!profileForm.birthDate.trim() || !profileForm.sex) ? (
              <span className="text-paper/50">
                Podaj płeć i datę urodzenia, by wyliczyć kategorię
              </span>
            ) : (
              <span className="text-paper/50">
                Kategoria po podaniu wagi, płci i daty urodzenia
              </span>
            )}
          </div>
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
              {profileModal === "edit" ? "Zapisz profil" : "Dodaj profil"}
            </button>
            <button
              type="button"
              className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase text-paper/70"
              onClick={closeProfileModal}
            >
              Anuluj
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
