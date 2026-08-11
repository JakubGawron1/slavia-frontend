import { FormEvent, useState } from "react";
import type { AuthUser, Role } from "@/lib/auth";
import type { PublicUser } from "@/lib/api/generated/models";
import {
  createUser as createUserApi,
  updateUser,
} from "@/lib/api/generated/default/default";
import type { useToast } from "@/components/toast/ToastProvider";
import {
  ALL_ROLES,
  emptyUserCreateForm,
  type UserModalMode,
} from "./shared";

type UseKontaUsersArgs = {
  user: AuthUser | null;
  toast: ReturnType<typeof useToast>;
  setError: (msg: string | null) => void;
  load: () => Promise<void>;
};

export function useKontaUsers({ user, toast, setError, load }: UseKontaUsersArgs) {
  const [userModal, setUserModal] = useState<UserModalMode>("closed");
  const [createUserForm, setCreateUserForm] = useState(emptyUserCreateForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editRoles, setEditRoles] = useState<Role[]>([]);

  const roleOptions = ALL_ROLES.filter(
    (r) => r !== "superadmin" || user?.roles.includes("superadmin"),
  );

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

  return {
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
    roleOptions,
    closeUserModal,
    openCreateUser,
    openEditUser,
    createUser,
    saveUser,
    toggleBan,
    toggleCreateRole,
    toggleEditRole,
  };
}
