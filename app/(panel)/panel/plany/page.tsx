"use client";

import { Suspense } from "react";
import { AthletePlansInner } from "@/components/panel/AthletePlansInner";
import { RequirePublicFlag } from "@/components/RequirePublicFlag";
import { TRAINING_PLANS_FLAG } from "@/lib/public-flags";

export default function AthletePlansPage() {
  return (
    <RequirePublicFlag flag={TRAINING_PLANS_FLAG}>
      <Suspense
        fallback={<p className="text-sm text-paper/50">Ładowanie planów…</p>}
      >
        <AthletePlansInner />
      </Suspense>
    </RequirePublicFlag>
  );
}
