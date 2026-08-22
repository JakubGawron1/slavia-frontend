"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { AthleteRecordsPage } from "@/components/records/AthleteRecordsPage";
import { TRAINING_RECORDS_FLAG } from "@/lib/panel-flags";

export default function PanelRekordyPage() {
  return (
    <RequirePanelFlag flag={TRAINING_RECORDS_FLAG}>
      <AthleteRecordsPage />
    </RequirePanelFlag>
  );
}
