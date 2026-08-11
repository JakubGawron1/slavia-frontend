"use client";

import { SinclairCalculator } from "@/components/SinclairCalculator";
import { BackLink } from "@/components/ui/BackLink";

export default function PanelSinclairPage() {
  return (
    <div className="animate-rise mx-auto max-w-4xl space-y-6">
      <div>
        <BackLink fallbackHref="/panel" />
        <p className="mt-3 font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Kalkulator Sinclair
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-paper/55">
          Przelicznik 2025–2028 — porównuj wyniki dwuboju przy różnej masie
          ciała.
        </p>
      </div>
      <SinclairCalculator />
    </div>
  );
}
