"use client";

import { AppearanceSection } from "./account/AppearanceSection";
import { EmailPasswordSection } from "./account/EmailPasswordSection";
import { NotificationsSection } from "./account/NotificationsSection";
import { ProfileSection } from "./account/ProfileSection";
import {
  useAccountSettingsForm,
  type AccountSettingsFormProps,
} from "./account/useAccountSettingsForm";

export function AccountSettingsForm(props: AccountSettingsFormProps) {
  const { user } = props;
  const s = useAccountSettingsForm(props);

  return (
    <div className="space-y-3">
      {s.error ? (
        <p className="settings-surface border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-paper">
          {s.error}
        </p>
      ) : null}
      {s.ok ? (
        <p className="settings-surface border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-paper">
          {s.ok}
        </p>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3">
          <ProfileSection
            user={user}
            displayName={s.displayName}
            onDisplayNameChange={s.setDisplayName}
            photoUrl={s.photoUrl}
            onPhotoUrlChange={s.setPhotoUrl}
            saving={s.saving}
            profileDirty={s.profileDirty}
            onSubmit={s.saveProfile}
          />

          <EmailPasswordSection
            user={user}
            saving={s.saving}
            changeEmail={s.changeEmail}
            onChangeEmailChange={s.setChangeEmail}
            onSubmitEmailChange={(e) => void s.submitEmailChange(e)}
            currentPassword={s.currentPassword}
            onCurrentPasswordChange={s.setCurrentPassword}
            newPassword={s.newPassword}
            onNewPasswordChange={s.setNewPassword}
            confirmPassword={s.confirmPassword}
            onConfirmPasswordChange={s.setConfirmPassword}
            onSubmitPassword={s.savePassword}
          />

          {s.allowNotificationEmails ? (
            <NotificationsSection
              prefs={s.prefs}
              saving={s.saving}
              isStaff={s.isStaff}
              onSavePrefs={(next) => void s.savePrefs(next)}
            />
          ) : null}
        </div>

        <div className="space-y-3">
          <AppearanceSection
            stableThemes={s.stableThemes}
            experimentalThemes={s.experimentalThemes}
            allowExperimental={s.allowExperimental}
            uiTheme={s.uiTheme}
            saving={s.saving}
            onSelectTheme={(id) => void s.saveTheme(id)}
          />
        </div>
      </div>
    </div>
  );
}
