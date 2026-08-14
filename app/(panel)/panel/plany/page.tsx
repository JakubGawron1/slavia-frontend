"use client";

import { Suspense } from "react";
import { AthletePlansInner } from "@/components/panel/AthletePlansInner";
import { RequirePublicFlag } from "@/components/RequirePublicFlag";
import { LoadingScene } from "@/components/loading/LoadingScene";
import { TRAINING_PLANS_FLAG } from "@/lib/public-flags";

export default function AthletePlansPage() {
  return (
    <RequirePublicFlag flag={TRAINING_PLANS_FLAG}>
      <Suspense
        fallback={
          <LoadingScene
            variant="inline"
            label="Plany"
            hint="Ładujemy Twoje rozpiski…"
          />
        }
      >
        <AthletePlansInner />
      </Suspense>
    </RequirePublicFlag>
  );
}
