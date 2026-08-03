"use client";

import { WhatsNewModal } from "@/components/changelog/WhatsNewModal";
import { usePanel } from "@/components/panel/PanelProvider";

/** Jednorazowy modal „Co nowego” w panelu zawodnika (bez superadmin). */
export function PanelWhatsNewHost() {
  const { user } = usePanel();
  if (!user) return null;
  return (
    <WhatsNewModal
      isSuperadmin={user.roles.includes("superadmin")}
      changelogHref="/panel/co-nowego"
    />
  );
}
