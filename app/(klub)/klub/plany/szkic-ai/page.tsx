"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { AiDraftPanel } from "@/components/plans/ai/AiDraftPanel";
import { TRAINING_PLANS_AI_FLAG } from "@/lib/panel-flags";

export default function KlubSzkicAiPage() {
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_AI_FLAG}>
      <AiDraftPanel />
    </RequirePanelFlag>
  );
}
