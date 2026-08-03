"use client";

import { WhatsNewModal } from "@/components/changelog/WhatsNewModal";
import { useKlub } from "@/components/klub/KlubProvider";

/** Jednorazowy modal „Co nowego” w panelu klubowym (bez superadmin). */
export function KlubWhatsNewHost() {
  const { user } = useKlub();
  if (!user) return null;
  return (
    <WhatsNewModal
      isSuperadmin={user.roles.includes("superadmin")}
      changelogHref="/klub/co-nowego"
    />
  );
}
