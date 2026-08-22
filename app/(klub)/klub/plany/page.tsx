"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { StaffPlansHome } from "@/components/plans/staff/StaffPlansHome";
import { TRAINING_PLANS_FLAG } from "@/lib/panel-flags";

export default function KlubPlanyPage() {
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_FLAG}>
      <StaffPlansHome />
    </RequirePanelFlag>
  );
}
