"use client";

import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { PageHeader } from "@/components/ui/PageHeader";
import type { AuthUser } from "@/lib/auth";

/** Wspólny widok ustawień konta — route’y `/klub` i `/panel` zostają osobne. */
export function AccountSettingsPage({
  user,
  onUpdated,
}: {
  user: AuthUser;
  onUpdated: (user: AuthUser) => void | Promise<void>;
}) {
  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Konto"
        title="Ustawienia"
        description="Profil, e-mail, hasło, powiadomienia, wygląd paneli i prywatność — sekcje możesz zwijać i rozwijać."
      />
      <AccountSettingsForm user={user} onUpdated={onUpdated} />
    </div>
  );
}
