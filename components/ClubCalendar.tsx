"use client";

import { useState } from "react";
import {
  CalendarMonthGrid,
  EventRow,
} from "@/components/calendar/CalendarMonthGrid";
import { Modal } from "@/components/ui/Modal";
import type { ClubEvent } from "@/lib/events";

type ClubCalendarProps = {
  initialEvents: ClubEvent[];
  todayKey: string;
};

/** Adapter publiczny — toggle ukrywania odwołanych + modal szczegółów. */
export function ClubCalendar({ initialEvents, todayKey }: ClubCalendarProps) {
  const [hideCancelled, setHideCancelled] = useState(false);
  const [selected, setSelected] = useState<ClubEvent | null>(null);

  return (
    <>
      <CalendarMonthGrid
        events={initialEvents}
        todayKey={todayKey}
        hideCancelled={hideCancelled}
        onHideCancelledChange={setHideCancelled}
        onSelectEvent={(event) => setSelected(event)}
        size="large"
        layout="wide"
        tone="site"
      />
      <Modal
        open={!!selected}
        title={selected?.title ?? "Wydarzenie"}
        onClose={() => setSelected(null)}
      >
        {selected ? <EventRow event={selected} dark /> : null}
      </Modal>
    </>
  );
}
