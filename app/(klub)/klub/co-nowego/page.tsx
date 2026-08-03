"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserChangelogView } from "@/components/changelog/UserChangelogView";
import { useKlub } from "@/components/klub/KlubProvider";

export default function KlubCoNowegoPage() {
  const { user } = useKlub();
  const router = useRouter();

  useEffect(() => {
    if (user?.roles.includes("superadmin")) {
      router.replace("/klub/devtools");
    }
  }, [user, router]);

  if (!user || user.roles.includes("superadmin")) return null;

  return <UserChangelogView homeHref="/klub" />;
}
