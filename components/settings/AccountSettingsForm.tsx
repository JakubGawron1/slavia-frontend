"use client";

import { useEffect, useState } from "react";
import {
  useListPublicFlags,
  useUpdateMe,
} from "@/lib/api/generated/default/default";
import { ROLE_LABELS } from "@/lib/klub-nav";
import type { AuthUser } from "@/lib/auth";
import { storeSession, getStoredToken } from "@/lib/auth";
import {
  EXPERIMENTAL_PANEL_THEMES_FLAG,
  experimentalPanelThemes,
  PANEL_THEMES,
  resolvePanelTheme,
  stablePanelThemes,
  type PanelThemeId,
} from "@/lib/panel-themes";
import { isFlagEnabled } from "@/lib/public-flags";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { CookieConsentSettings } from "@/components/settings/CookieConsentSettings";
import { useToast } from "@/components/toast/ToastProvider";

type ThemeOption = (typeof PANEL_THEMES)[number];

type Props = {
  user: AuthUser;
  onUpdated: (user: AuthUser) => void | Promise<void>;
};

function ThemeGrid({
  themes,
  selectedId,
  saving,
  onSelect,
}: {
  themes: readonly ThemeOption[];
  selectedId: PanelThemeId;
  saving: boolean;
  onSelect: (id: PanelThemeId) => void;
}) {
  return (
    <div
      className="mt-4 grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Wybór motywu"
    >
      {themes.map((theme) => {
        const selected = selectedId === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={saving}
            onClick={() => onSelect(theme.id)}
            className={`settings-surface group text-left transition-colors disabled:cursor-wait disabled:opacity-60 ${
              selected
                ? "border border-brand bg-brand/10"
                : "border border-paper/15 bg-chrome/20 hover:border-paper/35"
            }`}
          >
            <div
              className="flex h-14 overflow-hidden border-b border-paper/10"
              aria-hidden="true"
            >
              <span className="w-[42%]" style={{ backgroundColor: theme.swatch.ink }} />
              <span className="w-[28%]" style={{ backgroundColor: theme.swatch.accent }} />
              <span className="w-[18%]" style={{ backgroundColor: theme.swatch.brand }} />
              <span className="w-[12%]" style={{ backgroundColor: theme.swatch.paper }} />
            </div>
            <div className="px-3 py-2.5">
              <p className="font-display text-[11px] tracking-[0.12em] text-paper uppercase">
                {theme.label}
                {theme.experimental ? (
                  <span className="ml-2 font-sans text-[10px] tracking-normal text-amber-400/90 normal-case">
                    experimental
                  </span>
                ) : null}
                {selected ? (
                  <span className="ml-2 text-brand normal-case tracking-normal">
                    · aktywny
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-paper/50">{theme.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function AccountSettingsForm({ user, onUpdated }: Props) {
  const toast = useToast();
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const allowExperimental = isFlagEnabled(
    flagsQuery.data?.data ?? [],
    EXPERIMENTAL_PANEL_THEMES_FLAG,
  );
  const stableThemes = stablePanelThemes();
  const experimentalThemes = allowExperimental ? experimentalPanelThemes() : [];

  const [displayName, setDisplayName] = useState(user.display_name);
  const [photoUrl, setPhotoUrl] = useState(user.photo_url ?? "");
  const [uiTheme, setUiTheme] = useState<PanelThemeId>(
    resolvePanelTheme(user.ui_theme, { allowExperimental }),
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const updateMeMutation = useUpdateMe();
  const saving = updateMeMutation.isPending;

  useEffect(() => {
    setDisplayName(user.display_name);
    setPhotoUrl(user.photo_url ?? "");
    setUiTheme(resolvePanelTheme(user.ui_theme, { allowExperimental }));
  }, [user.display_name, user.photo_url, user.ui_theme, allowExperimental]);

  async function applyUserUpdate(updated: AuthUser, message: string) {
    const token = getStoredToken();
    if (token) storeSession(token, updated);
    await onUpdated(updated);
    setOk(message);
    toast.success(message);
  }

  async function saveProfile(e: React.FormEvent) {
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
    if (
      themeId === resolvePanelTheme(user.ui_theme, { allowExperimental }) ||
      saving
    ) {
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
      setUiTheme(resolvePanelTheme(user.ui_theme, { allowExperimental }));
      const msg =
        err instanceof Error ? err.message : "Nie udało się zapisać motywu.";
      setError(msg);
      toast.error("Motyw", msg);
    }
  }

  async function savePassword(e: React.FormEvent) {
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

  const profileDirty =
    displayName.trim() !== user.display_name ||
    (photoUrl.trim() || "") !== (user.photo_url ?? "");

  const field =
    "panel-control w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-brand";
  const label =
    "mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";
  const surface = "settings-surface border border-paper/10 bg-chrome/30 p-5 md:p-6";

  return (
    <div className="space-y-6">
      {error ? (
        <p className="settings-surface border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-paper">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="settings-surface border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-paper">
          {ok}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <section className={surface}>
            <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
              Konto
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-paper/40">E-mail</dt>
                <dd className="mt-0.5 text-paper">{user.email}</dd>
              </div>
              <div>
                <dt className="text-paper/40">Role</dt>
                <dd className="mt-0.5 text-paper">
                  {user.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                </dd>
              </div>
            </dl>
          </section>

          <form onSubmit={saveProfile} className={surface}>
            <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
              Profil
            </h2>
            <div className="mt-4">
              <label htmlFor="settings-display-name" className={label}>
                Nazwa wyświetlana
              </label>
              <input
                id="settings-display-name"
                className={field}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="nickname"
                required
              />
            </div>
            <PhotoUploadField
              className="mt-4"
              value={photoUrl}
              onChange={setPhotoUrl}
              disabled={saving}
              label="Zdjęcie konta"
              hint={
                user.roles.includes("zawodnik")
                  ? "Dla zawodnika to samo zdjęcie jest widoczne na profilu publicznym."
                  : "Zdjęcie przypisane do konta (kadra nie ma osobnego profilu publicznego)."
              }
              inputClassName={field}
            />
            <button
              type="submit"
              disabled={saving || !profileDirty}
              className="panel-control mt-5 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Zapisz profil
            </button>
          </form>

          <form onSubmit={savePassword} className={surface}>
            <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
              Hasło
            </h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label htmlFor="settings-current-password" className={label}>
                  Aktualne hasło
                </label>
                <input
                  id="settings-current-password"
                  type="password"
                  className={field}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div>
                <label htmlFor="settings-new-password" className={label}>
                  Nowe hasło
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  className={field}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="settings-confirm-password" className={label}>
                  Potwierdź nowe hasło
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  className={field}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="panel-control mt-5 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Zmień hasło
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <section className={surface}>
            <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
              Motywy stable
            </h2>
            <p className="mt-2 text-sm text-paper/55">
              Kolorystyka paneli. Wybór jest zapisany na koncie i działa na
              każdym urządzeniu.
            </p>
            <ThemeGrid
              themes={stableThemes}
              selectedId={uiTheme}
              saving={saving}
              onSelect={(id) => void saveTheme(id)}
            />
          </section>

          {allowExperimental ? (
            <section className={surface}>
              <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
                Motywy experimental
              </h2>
              <p className="mt-2 text-sm text-paper/55">
                Zmieniają też układ i geometrię UI. Dostępne przez flagę
                DevTools.
              </p>
              <ThemeGrid
                themes={experimentalThemes}
                selectedId={uiTheme}
                saving={saving}
                onSelect={(id) => void saveTheme(id)}
              />
            </section>
          ) : null}

          <CookieConsentSettings className={surface} />
        </div>
      </div>
    </div>
  );
}
