"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserChangelogView } from "@/components/changelog/UserChangelogView";
import { usePanel } from "@/components/panel/PanelProvider";

export default function PanelCoNowegoPage() {
  const { user } = usePanel();
  const router = useRouter();

  useEffect(() => {
    if (user?.roles.includes("superadmin")) {
      router.replace("/klub/devtools");
    }
  }, [user, router]);

  if (!user || user.roles.includes("superadmin")) return null;

  return <UserChangelogView homeHref="/panel" />;
}
