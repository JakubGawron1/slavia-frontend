"use client";

import { AccountSettingsPage } from "@/components/settings/AccountSettingsPage";
import { usePanel } from "@/components/panel/PanelProvider";

export default function PanelUstawieniaPage() {
  const { user, refreshUser } = usePanel();
  if (!user) return null;

  return (
    <AccountSettingsPage
      user={user}
      onUpdated={(updated) => refreshUser(updated)}
    />
  );
}
