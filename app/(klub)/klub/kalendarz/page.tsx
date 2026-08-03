"use client";

import { RequirePublicFlag } from "@/components/RequirePublicFlag";
import { StaffCalendar } from "@/components/klub/StaffCalendar";
import { CLUB_CALENDAR_FLAG } from "@/lib/public-flags";

export default function KlubKalendarzPage() {
  return (
    <RequirePublicFlag flag={CLUB_CALENDAR_FLAG}>
      <div className="animate-rise">
        <StaffCalendar />
      </div>
    </RequirePublicFlag>
  );
}
