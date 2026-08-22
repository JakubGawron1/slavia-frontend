"use client";

import { RequirePanelFlag } from "@/components/RequireFlag";
import { AthleteCalendar } from "@/components/panel/AthleteCalendar";
import { ATHLETE_CALENDAR_FLAG } from "@/lib/panel-flags";

export default function PanelKalendarzPage() {
  return (
    <RequirePanelFlag flag={ATHLETE_CALENDAR_FLAG}>
      <div className="animate-rise">
        <AthleteCalendar />
      </div>
    </RequirePanelFlag>
  );
}
