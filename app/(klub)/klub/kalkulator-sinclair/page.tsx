"use client";

import { SinclairCalculator } from "@/components/SinclairCalculator";

export default function KlubSinclairPage() {
  return (
    <div className="animate-rise mx-auto max-w-4xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
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
