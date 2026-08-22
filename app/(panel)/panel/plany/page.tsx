"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { AthletePlansHome } from "@/components/plans/athlete/AthletePlansHome";
import { TRAINING_PLANS_FLAG } from "@/lib/panel-flags";

export default function PanelPlanyPage() {
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_FLAG}>
      <AthletePlansHome />
    </RequirePanelFlag>
  );
}
