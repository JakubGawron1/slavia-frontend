"use client";

import { useState } from "react";
import { CalendarMonthGrid } from "@/components/calendar/CalendarMonthGrid";
import type { ClubEvent } from "@/lib/events";

type ClubCalendarProps = {
  initialEvents: ClubEvent[];
  todayKey: string;
};

/** Adapter publiczny — toggle ukrywania odwołanych. */
export function ClubCalendar({ initialEvents, todayKey }: ClubCalendarProps) {
  const [hideCancelled, setHideCancelled] = useState(false);

  return (
    <CalendarMonthGrid
      events={initialEvents}
      todayKey={todayKey}
      hideCancelled={hideCancelled}
      onHideCancelledChange={setHideCancelled}
      size="large"
      layout="wide"
      tone="site"
    />
  );
}
