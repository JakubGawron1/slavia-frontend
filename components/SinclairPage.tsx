"use client";

import { SinclairCalculator } from "@/components/SinclairCalculator";
import { PageHeader } from "@/components/ui/PageHeader";

/** Wspólny widok kalkulatora — route’y `/klub` i `/panel` zostają osobne. */
export function SinclairPage() {
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
