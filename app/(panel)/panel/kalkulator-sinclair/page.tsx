"use client";

import { SinclairCalculator } from "@/components/SinclairCalculator";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PanelSinclairPage() {
  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Narzędzie"
        title="Kalkulator Sinclair"
        description="Przelicznik 2025–2028 — porównuj wyniki dwuboju przy różnej masie ciała."
      />
      <SinclairCalculator />
    </div>
  );
}
