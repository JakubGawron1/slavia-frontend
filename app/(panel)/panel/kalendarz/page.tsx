"use client";

import { RequirePublicFlag } from "@/components/RequirePublicFlag";
import { AthleteCalendar } from "@/components/panel/AthleteCalendar";
import { ATHLETE_CALENDAR_FLAG } from "@/lib/public-flags";

export default function PanelKalendarzPage() {
  return (
    <RequirePublicFlag flag={ATHLETE_CALENDAR_FLAG}>
      <div className="animate-rise">
        <AthleteCalendar />
      </div>
    </RequirePublicFlag>
  );
}
