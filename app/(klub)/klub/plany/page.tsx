"use client";

import { StaffPlansInner } from "@/components/klub/StaffPlansInner";
import { RequirePublicFlag } from "@/components/RequirePublicFlag";
import { TRAINING_PLANS_FLAG } from "@/lib/public-flags";

export default function StaffPlansPage() {
  return (
    <RequirePublicFlag flag={TRAINING_PLANS_FLAG}>
      <StaffPlansInner />
    </RequirePublicFlag>
  );
}
