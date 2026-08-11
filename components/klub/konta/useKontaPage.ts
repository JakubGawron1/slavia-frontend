"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AthleteProfile, PublicUser } from "@/lib/api/generated/models";
import {
  createProfile,
  createUser as createUserApi,
  deleteProfile,
  deleteUser,
  listProfiles,
  listUsers,
  updateProfile,
  updateUser,
} from "@/lib/api/generated/default/default";
import type { Role } from "@/lib/auth";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";
import {
  ALL_ROLES,
  type AccountLinkMode,
  type ConfirmDeleteTarget,
  emptyProfileForm,
  emptyUserCreateForm,
  type ProfileModalMode,
  type ProfileSex,
  type UserModalMode,
} from "./shared";

export function useKontaPage() {
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
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteTarget | null>(
    null,
  );
  const [confirmBusy, setConfirmBusy] = useState(false);

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
      const [uRes, pRes] = await Promise.all([listUsers(), listProfiles()]);
      setUsers((uRes.data as PublicUser[]) ?? []);
      setProfiles((pRes.data as AthleteProfile[]) ?? []);
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
      await createUserApi({
        email: createUserForm.email,
        password: createUserForm.password,
        display_name: createUserForm.name,
        roles: createUserForm.roles,
        photo_url: createUserForm.photoUrl.trim() || null,
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
      const body: Parameters<typeof updateUser>[1] = {
        display_name: editName.trim(),
        email: editEmail.trim(),
        roles: editRoles,
        photo_url: editPhotoUrl.trim() || "",
      };
      if (editPassword.trim()) {
        body.password = editPassword;
      }
      await updateUser(editingUserId, body);
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
      await updateUser(u.id, { is_active: !u.is_active });
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

  function removeUser(id: string, name: string) {
    setConfirmDelete({ kind: "user", id, name });
  }

  async function runConfirmDelete() {
    if (!confirmDelete) return;
    setConfirmBusy(true);
    try {
      if (confirmDelete.kind === "user") {
        await deleteUser(confirmDelete.id);
        toast.success("Usunięto konto");
        if (editingUserId === confirmDelete.id) closeUserModal();
      } else {
        await deleteProfile(confirmDelete.id);
        toast.success("Usunięto profil");
        if (editingProfileId === confirmDelete.id) closeProfileModal();
      }
      setConfirmDelete(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd usuwania";
      setError(msg);
      toast.error(
        confirmDelete.kind === "user" ? "Usuwanie konta" : "Usuwanie profilu",
        msg,
      );
    } finally {
      setConfirmBusy(false);
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
        const created = (
          await createUserApi({
            email: profileForm.accountEmail.trim(),
            password: profileForm.accountPassword,
            display_name: profileForm.name,
            roles: ["zawodnik"],
            photo_url: profileForm.photoUrl.trim() || null,
          })
        ).data as PublicUser;
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
        await updateProfile(editingProfileId, body);
        toast.success("Zapisano profil", profileForm.name);
      } else {
        await createProfile(body);
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

  function removeProfile(id: string, name: string) {
    setConfirmDelete({ kind: "profile", id, name });
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

  function setProfileAccountMode(mode: AccountLinkMode) {
    setProfileForm((prev) => ({
      ...prev,
      accountMode: mode,
      userId: "",
      accountEmail: "",
      accountPassword: "",
    }));
  }

  function setProfileUserId(id: string) {
    const linked = usersById.get(id);
    setProfileForm((prev) => ({
      ...prev,
      userId: id,
      photoUrl:
        prev.photoUrl.trim() || linked?.photo_url?.trim() || prev.photoUrl,
    }));
  }

  return {
    showUsersSection,
    canManageUsers,
    users,
    profiles,
    error,
    loading,
    userModal,
    createUserForm,
    setCreateUserForm,
    editingUserId,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editPassword,
    setEditPassword,
    editPhotoUrl,
    setEditPhotoUrl,
    editRoles,
    profileModal,
    editingProfileId,
    profileForm,
    confirmDelete,
    confirmBusy,
    computedCategory,
    availableAthletes,
    roleOptions,
    setProfileField,
    setProfileAccountMode,
    setProfileUserId,
    closeUserModal,
    closeProfileModal,
    openCreateUser,
    openEditUser,
    openCreateProfile,
    openEditProfile,
    createUser,
    saveUser,
    toggleBan,
    removeUser,
    runConfirmDelete,
    submitProfile,
    removeProfile,
    toggleCreateRole,
    toggleEditRole,
    accountLabel,
    setConfirmDelete,
  };
}
