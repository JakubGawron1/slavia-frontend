"use client";

import { CoNowegoPage } from "@/components/changelog/CoNowegoPage";
import { useKlub } from "@/components/klub/KlubProvider";

export default function KlubCoNowegoPage() {
  const { user } = useKlub();
  return <CoNowegoPage user={user} homeHref="/klub" />;
}
