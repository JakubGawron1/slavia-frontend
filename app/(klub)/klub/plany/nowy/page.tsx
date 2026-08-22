"use client";

import { Suspense } from "react";
import { RequirePanelFlag } from "@/components/RequireFlag";
import { PlanWizard } from "@/components/plans/wizard/PlanWizard";
import { TRAINING_PLANS_FLAG } from "@/lib/panel-flags";
import { InlineStatus } from "@/components/ui/InlineStatus";

export default function KlubNowyPlanPage() {
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_FLAG}>
      <Suspense fallback={<InlineStatus kind="loading">Ładowanie kreatora…</InlineStatus>}>
        <PlanWizard />
      </Suspense>
    </RequirePanelFlag>
  );
}
