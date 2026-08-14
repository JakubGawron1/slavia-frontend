"use client";

import { Suspense } from "react";
import { LoadingScene } from "@/components/loading/LoadingScene";
import ObecnoscScanClient from "./ObecnoscScanClient";

export default function ObecnoscPage() {
  return (
    <Suspense
      fallback={
        <LoadingScene
          variant="inline"
          label="Obecność"
          hint="Przygotowujemy skaner QR…"
        />
      }
    >
      <ObecnoscScanClient />
    </Suspense>
  );
}
