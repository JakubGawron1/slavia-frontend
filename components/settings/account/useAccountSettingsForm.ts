"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  useRequestEmailVerification,
  useUpdateMe,
} from "@/lib/api/generated/auth/auth";
import { STAFF_ROLES } from "@/lib/klub-nav";
import type { AuthUser } from "@/lib/auth";
import { getStoredToken, hasAnyRole, storeSession } from "@/lib/auth";
import {
  colorPanelThemes,
  layoutPanelThemes,
  resolvePanelTheme,
  type PanelThemeId,
} from "@/lib/panel-themes";
import { useToast } from "@/components/toast/ToastProvider";
import type { NotificationPrefs } from "@/lib/api/generated/models";

export type AccountSettingsFormProps = {
  user: AuthUser;
  onUpdated: (user: AuthUser) => void | Promise<void>;
};

export function useAccountSettingsForm({ user, onUpdated }: AccountSettingsFormProps) {
  const toast = useToast();
  const colorThemes = colorPanelThemes();
  const layoutThemes = layoutPanelThemes();

  const [displayName, setDisplayName] = useState(user.display_name);
  const [photoUrl, setPhotoUrl] = useState(user.photo_url ?? "");
  const [uiTheme, setUiTheme] = useState<PanelThemeId>(
    resolvePanelTheme(user.ui_theme),
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const updateMeMutation = useUpdateMe();
  const verifyMutation = useRequestEmailVerification();
  const saving = updateMeMutation.isPending || verifyMutation.isPending;

  const [prefs, setPrefs] = useState<NotificationPrefs>(() => ({
    email_squad: user.notification_prefs?.email_squad ?? true,
    email_contact: user.notification_prefs?.email_contact ?? true,
  }));
  const [changeEmail, setChangeEmail] = useState(
    user.pending_email ?? user.email,
  );

  useEffect(() => {
    setDisplayName(user.display_name);
    setPhotoUrl(user.photo_url ?? "");
    setUiTheme(resolvePanelTheme(user.ui_theme));
    setPrefs({
      email_squad: user.notification_prefs?.email_squad ?? true,
      email_contact: user.notification_prefs?.email_contact ?? true,
    });
    setChangeEmail(user.pending_email ?? user.email);
  }, [
    user.display_name,
    user.photo_url,
    user.ui_theme,
    user.notification_prefs,
    user.pending_email,
    user.email,
  ]);

  async function applyUserUpdate(updated: AuthUser, message: string) {
    const token = getStoredToken();
    if (token) storeSession(token, updated);
    await onUpdated(updated);
    setOk(message);
    toast.success(message);
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      const result = await updateMeMutation.mutateAsync({
        data: {
          display_name: displayName,
          photo_url: photoUrl.trim() || "",
        },
      });
      await applyUserUpdate(result.data as AuthUser, "Zapisano profil konta.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się zapisać.";
      setError(msg);
      toast.error("Profil konta", msg);
    }
  }

  async function saveTheme(themeId: PanelThemeId) {
    if (themeId === resolvePanelTheme(user.ui_theme) || saving) {
      return;
    }
    setError(null);
    setOk(null);
    setUiTheme(themeId);
    try {
      const result = await updateMeMutation.mutateAsync({
        data: { ui_theme: themeId },
      });
      await applyUserUpdate(
        result.data as AuthUser,
        "Zapisano motyw paneli — działa na wszystkich urządzeniach.",
      );
    } catch (err) {
      setUiTheme(resolvePanelTheme(user.ui_theme));
      const msg =
        err instanceof Error ? err.message : "Nie udało się zapisać motywu.";
      setError(msg);
      toast.error("Motyw", msg);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (newPassword.length < 6) {
      setError("Nowe hasło musi mieć co najmniej 6 znaków.");
      toast.error("Hasło", "Nowe hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są zgodne.");
      toast.error("Hasło", "Nowe hasła nie są zgodne.");
      return;
    }
    try {
      const result = await updateMeMutation.mutateAsync({
        data: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });
      await applyUserUpdate(result.data as AuthUser, "Hasło zostało zmienione.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się zmienić hasła.";
      setError(msg);
      toast.error("Hasło", msg);
    }
  }

  async function savePrefs(next: NotificationPrefs) {
    setPrefs(next);
    setError(null);
    setOk(null);
    try {
      const result = await updateMeMutation.mutateAsync({
        data: { notification_prefs: next },
      });
      await applyUserUpdate(
        result.data as AuthUser,
        "Zapisano preferencje powiadomień.",
      );
    } catch (err) {
      setPrefs({
        email_squad: user.notification_prefs?.email_squad ?? true,
        email_contact: user.notification_prefs?.email_contact ?? true,
      });
      const msg =
        err instanceof Error
          ? err.message
          : "Nie udało się zapisać preferencji.";
      setError(msg);
      toast.error("Powiadomienia", msg);
    }
  }

  async function submitEmailChange(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    const trimmed = changeEmail.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }
    try {
      const same = trimmed === user.email.toLowerCase();
      const result = await verifyMutation.mutateAsync({
        data: same ? { email: null } : { email: trimmed },
      });
      const updated = result.data as AuthUser;
      await applyUserUpdate(
        updated,
        updated.email_verified
          ? "E-mail zaktualizowany."
          : "Wysłano link weryfikacyjny na nowy adres.",
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się zmienić e-maila.";
      setError(msg);
      toast.error("E-mail", msg);
    }
  }

  const isStaff = hasAnyRole(user, STAFF_ROLES);

  const profileDirty =
    displayName.trim() !== user.display_name ||
    (photoUrl.trim() || "") !== (user.photo_url ?? "");

  return {
    colorThemes,
    layoutThemes,
    displayName,
    setDisplayName,
    photoUrl,
    setPhotoUrl,
    uiTheme,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    ok,
    saving,
    prefs,
    changeEmail,
    setChangeEmail,
    saveProfile,
    saveTheme,
    savePassword,
    savePrefs,
    submitEmailChange,
    isStaff,
    profileDirty,
  };
}
