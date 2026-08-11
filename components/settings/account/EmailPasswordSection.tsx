import type { FormEvent } from "react";
import type { AuthUser } from "@/lib/auth";
import { SettingsCategory } from "@/components/settings/SettingsCategory";
import { fieldClass, labelClass, subheadingClass } from "./styles";

type EmailPasswordSectionProps = {
  user: AuthUser;
  saving: boolean;
  changeEmail: string;
  onChangeEmailChange: (v: string) => void;
  onSubmitEmailChange: (e: FormEvent) => void;
  currentPassword: string;
  onCurrentPasswordChange: (v: string) => void;
  newPassword: string;
  onNewPasswordChange: (v: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (v: string) => void;
  onSubmitPassword: (e: FormEvent) => void;
};

export function EmailPasswordSection({
  user,
  saving,
  changeEmail,
  onChangeEmailChange,
  onSubmitEmailChange,
  currentPassword,
  onCurrentPasswordChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  onSubmitPassword,
}: EmailPasswordSectionProps) {
  return (
    <SettingsCategory
      title="E-mail i hasło"
      description="Zmiana adresu, weryfikacja i hasło logowania"
    >
      <form onSubmit={onSubmitEmailChange}>
        <p className={subheadingClass}>Adres e-mail</p>
        <p className="mt-2 text-sm text-paper/55">
          Zmiana wymaga potwierdzenia linkiem (adresy .dev / .local są
          weryfikowane automatycznie).
        </p>
        <div className="mt-4">
          <label htmlFor="settings-email" className={labelClass}>
            E-mail
          </label>
          <input
            id="settings-email"
            type="email"
            className={fieldClass}
            value={changeEmail}
            onChange={(e) => onChangeEmailChange(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="panel-control mt-5 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {user.email_verified &&
          changeEmail.trim().toLowerCase() === user.email.toLowerCase()
            ? "Wyślij ponownie weryfikację"
            : "Zapisz / wyślij weryfikację"}
        </button>
      </form>

      <form onSubmit={onSubmitPassword} className="mt-8 border-t border-paper/10 pt-6">
        <p className={subheadingClass}>Hasło</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="settings-current-password" className={labelClass}>
              Aktualne hasło
            </label>
            <input
              id="settings-current-password"
              type="password"
              className={fieldClass}
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label htmlFor="settings-new-password" className={labelClass}>
              Nowe hasło
            </label>
            <input
              id="settings-new-password"
              type="password"
              className={fieldClass}
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="settings-confirm-password" className={labelClass}>
              Potwierdź nowe hasło
            </label>
            <input
              id="settings-confirm-password"
              type="password"
              className={fieldClass}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
    </SettingsCategory>
  );
}
