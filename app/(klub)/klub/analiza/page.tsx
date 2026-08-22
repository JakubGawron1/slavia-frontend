"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { LiftAnalysis } from "@/components/lifts/analysis/LiftAnalysis";
import { LIFT_BAR_PATH_AI_FLAG } from "@/lib/panel-flags";

export default function KlubAnalizaPage() {
  return (
    <RequirePanelFlag flag={LIFT_BAR_PATH_AI_FLAG}>
      <LiftAnalysis />
    </RequirePanelFlag>
  );
}
