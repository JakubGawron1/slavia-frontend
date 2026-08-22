"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { StaffRecordsPage } from "@/components/records/StaffRecordsPage";
import { TRAINING_RECORDS_FLAG } from "@/lib/panel-flags";

export default function KlubRekordyPage() {
  return (
    <RequirePanelFlag flag={TRAINING_RECORDS_FLAG}>
      <StaffRecordsPage />
    </RequirePanelFlag>
  );
}
