"use client";

import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { usePanel } from "@/components/panel/PanelProvider";

export default function PanelUstawieniaPage() {
  const { user, refreshUser } = usePanel();
  if (!user) return null;

  return (
    <div className="animate-rise mx-auto max-w-6xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Konto
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Ustawienia
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-paper/55">
          Profil, e-mail, hasło, powiadomienia, wygląd paneli i prywatność —
          sekcje możesz zwijać i rozwijać.
        </p>
      </div>

      <AccountSettingsForm user={user} onUpdated={(updated) => refreshUser(updated)} />
    </div>
  );
}
