"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AthleteProfile, PublicUser } from "@/lib/api/generated/models";
import {
  deleteProfile,
  deleteUser,
  listProfiles,
  listUsers,
} from "@/lib/api/generated/default/default";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { type ConfirmDeleteTarget } from "./shared";
import { useKontaProfiles } from "./useKontaProfiles";
import { useKontaUsers } from "./useKontaUsers";

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
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteTarget | null>(
    null,
  );
  const [confirmBusy, setConfirmBusy] = useState(false);

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

  const usersById = useMemo(() => {
    const map = new Map<string, PublicUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const usersSection = useKontaUsers({ user, toast, setError, load });
  const profilesSection = useKontaProfiles({
    toast,
    setError,
    load,
    athleteUsers,
    profiles,
    usersById,
    onDevCredentials: usersSection.setDevCredentials,
  });

  function removeUser(id: string, name: string) {
    setConfirmDelete({ kind: "user", id, name });
  }

  function removeProfile(id: string, name: string) {
    setConfirmDelete({ kind: "profile", id, name });
  }

  async function runConfirmDelete() {
    if (!confirmDelete) return;
    setConfirmBusy(true);
    try {
      if (confirmDelete.kind === "user") {
        await deleteUser(confirmDelete.id);
        toast.success("Usunięto konto");
        if (usersSection.editingUserId === confirmDelete.id) {
          usersSection.closeUserModal();
        }
      } else {
        await deleteProfile(confirmDelete.id);
        toast.success("Usunięto profil");
        if (profilesSection.editingProfileId === confirmDelete.id) {
          profilesSection.closeProfileModal();
        }
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

  return {
    showUsersSection,
    canManageUsers,
    users,
    profiles,
    error,
    loading,
    ...usersSection,
    ...profilesSection,
    confirmDelete,
    confirmBusy,
    runConfirmDelete,
    removeUser,
    removeProfile,
    setConfirmDelete,
  };
}
