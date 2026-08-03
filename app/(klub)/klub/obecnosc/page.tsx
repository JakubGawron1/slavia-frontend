"use client";

import { Suspense } from "react";
import StaffObecnoscInner from "./StaffObecnoscInner";

export default function StaffObecnoscPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-paper/55">Ładowanie obecności…</p>
      }
    >
      <StaffObecnoscInner />
    </Suspense>
  );
}
