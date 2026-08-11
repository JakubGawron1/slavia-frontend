import type { FormEvent } from "react";
import type { AuthUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/klub-nav";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { SettingsCategory } from "@/components/settings/SettingsCategory";
import { fieldClass, labelClass } from "./styles";

type ProfileSectionProps = {
  user: AuthUser;
  displayName: string;
  onDisplayNameChange: (v: string) => void;
  photoUrl: string;
  onPhotoUrlChange: (v: string) => void;
  saving: boolean;
  profileDirty: boolean;
  onSubmit: (e: FormEvent) => void;
};

export function ProfileSection({
  user,
  displayName,
  onDisplayNameChange,
  photoUrl,
  onPhotoUrlChange,
  saving,
  profileDirty,
  onSubmit,
}: ProfileSectionProps) {
  return (
    <SettingsCategory
      title="Profil"
      description="Nazwa wyświetlana, zdjęcie i role konta"
      defaultOpen
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-paper/40">E-mail</dt>
          <dd className="mt-0.5 text-paper">{user.email}</dd>
          <dd className="mt-1 text-xs text-paper/45">
            {user.email_verified
              ? "Zweryfikowany"
              : user.pending_email
                ? `Oczekuje na weryfikację: ${user.pending_email}`
                : "Niezweryfikowany"}
          </dd>
        </div>
        <div>
          <dt className="text-paper/40">Role</dt>
          <dd className="mt-0.5 text-paper">
            {user.roles.map((r) => ROLE_LABELS[r]).join(", ")}
          </dd>
        </div>
      </dl>

      <form onSubmit={onSubmit} className="mt-6">
        <div>
          <label htmlFor="settings-display-name" className={labelClass}>
            Nazwa wyświetlana
          </label>
          <input
            id="settings-display-name"
            className={fieldClass}
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            autoComplete="nickname"
            required
          />
        </div>
        <PhotoUploadField
          className="mt-4"
          value={photoUrl}
          onChange={onPhotoUrlChange}
          disabled={saving}
          label="Zdjęcie konta"
          hint={
            user.roles.includes("zawodnik")
              ? "Dla zawodnika to samo zdjęcie jest widoczne na profilu publicznym."
              : "Zdjęcie przypisane do konta (kadra nie ma osobnego profilu publicznego)."
          }
          inputClassName={fieldClass}
        />
        <button
          type="submit"
          disabled={saving || !profileDirty}
          className="panel-control mt-5 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Zapisz profil
        </button>
      </form>
    </SettingsCategory>
  );
}
