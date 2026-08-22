"use client";

import { CoNowegoPage } from "@/components/changelog/CoNowegoPage";
import { usePanel } from "@/components/panel/PanelProvider";

export default function PanelCoNowegoPage() {
  const { user } = usePanel();
  return <CoNowegoPage user={user} homeHref="/panel" />;
}
