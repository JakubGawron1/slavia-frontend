"use client";

import { AccountSettingsPage } from "@/components/settings/AccountSettingsPage";
import { useKlub } from "@/components/klub/KlubProvider";

export default function KlubUstawieniaPage() {
  const { user, refreshUser } = useKlub();
  if (!user) return null;

  return (
    <AccountSettingsPage
      user={user}
      onUpdated={(updated) => refreshUser(updated)}
    />
  );
}
