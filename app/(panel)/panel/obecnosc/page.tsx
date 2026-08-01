"use client";

import { Suspense } from "react";
import ObecnoscScanClient from "./ObecnoscScanClient";

export default function ObecnoscPage() {
  return (
    <Suspense fallback={<p className="text-paper/50">Ładowanie…</p>}>
      <ObecnoscScanClient />
    </Suspense>
  );
}
