"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { StaffCalendar } from "@/components/klub/calendar/StaffCalendar";
import { CLUB_CALENDAR_FLAG } from "@/lib/panel-flags";

export default function KlubKalendarzPage() {
  return (
    <RequirePanelFlag flag={CLUB_CALENDAR_FLAG}>
      <div className="animate-rise">
        <StaffCalendar />
      </div>
    </RequirePanelFlag>
  );
}
