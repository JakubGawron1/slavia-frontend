import { FormEvent, useState } from "react";
import type { AuthUser, Role } from "@/lib/auth";
import { isDevEmail } from "@/lib/email";
import type { PublicUser } from "@/lib/api/generated/models";
import {
  createUser as createUserApi,
  updateUser,
} from "@/lib/api/generated/default/default";
import { sendUserPasswordReset } from "@/lib/api/send-user-password-reset";
import type { useToast } from "@/components/toast/ToastProvider";
import type { DevCredentials } from "./DevCredentialsModal";
import {
  createUserFormSchema,
  updateUserFormSchema,
} from "@/lib/validation/konta";
import { parseOrMessage } from "@/lib/validation/parse";
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
  const [resetBusyId, setResetBusyId] = useState<string | null>(null);
  const [devCredentials, setDevCredentials] = useState<DevCredentials | null>(
    null,
  );

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
    const parsed = parseOrMessage(createUserFormSchema, createUserForm);
    if (!parsed.ok) {
      setError(parsed.message);
      toast.error("Tworzenie konta", parsed.message);
      return;
    }
    const { email, password, name, roles, photoUrl } = parsed.data;
    try {
      await createUserApi({
        email,
        password: isDevEmail(email) ? password : null,
        display_name: name,
        roles: roles as Role[],
        photo_url: photoUrl.trim() || null,
      });
      toast.success(
        isDevEmail(email)
          ? "Utworzono konto"
          : "Utworzono konto — wysłano link do e-maila",
        name || email,
      );
      closeUserModal();
      if (isDevEmail(email)) {
        setDevCredentials({
          email,
          password,
          displayName: name || email,
        });
      }
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
    const parsed = parseOrMessage(updateUserFormSchema, {
      name: editName,
      email: editEmail,
      password: editPassword,
      roles: editRoles,
      photoUrl: editPhotoUrl,
    });
    if (!parsed.ok) {
      setError(parsed.message);
      toast.error("Zapis konta", parsed.message);
      return;
    }
    try {
      const body: Parameters<typeof updateUser>[1] = {
        display_name: parsed.data.name,
        email: parsed.data.email,
        roles: parsed.data.roles as Role[],
        photo_url: parsed.data.photoUrl.trim() || "",
      };
      if (parsed.data.password.trim()) {
        body.password = parsed.data.password;
      }
      await updateUser(editingUserId, body);
      toast.success("Zapisano konto", parsed.data.name || parsed.data.email);
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

  async function sendPasswordReset(u: PublicUser) {
    setResetBusyId(u.id);
    setError(null);
    try {
      await sendUserPasswordReset(u.id);
      toast.success("Wysłano reset hasła", u.email);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wysłać resetu";
      setError(msg);
      toast.error("Reset hasła", msg);
    } finally {
      setResetBusyId(null);
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
    resetBusyId,
    devCredentials,
    setDevCredentials,
    closeUserModal,
    openCreateUser,
    openEditUser,
    createUser,
    saveUser,
    toggleBan,
    sendPasswordReset,
    toggleCreateRole,
    toggleEditRole,
  };
}
