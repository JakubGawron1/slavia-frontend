"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserChangelogView } from "@/components/changelog/UserChangelogView";
import type { AuthUser } from "@/lib/auth";

/** Wspólny widok changelogu — superadmin idzie do DevTools. */
export function CoNowegoPage({
  user,
  homeHref,
}: {
  user: AuthUser | null;
  homeHref: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (user?.roles.includes("superadmin")) {
      router.replace("/klub/devtools");
    }
  }, [user, router]);

  if (!user || user.roles.includes("superadmin")) return null;

  return <UserChangelogView homeHref={homeHref} />;
}
