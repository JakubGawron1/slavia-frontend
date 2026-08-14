"use client";

import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePanel } from "@/components/panel/PanelProvider";

export default function PanelUstawieniaPage() {
  const { user, refreshUser } = usePanel();
  if (!user) return null;

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Konto"
        title="Ustawienia"
        description="Profil, e-mail, hasło, powiadomienia, wygląd paneli i prywatność — sekcje możesz zwijać i rozwijać."
      />

      <AccountSettingsForm user={user} onUpdated={(updated) => refreshUser(updated)} />
    </div>
  );
}
