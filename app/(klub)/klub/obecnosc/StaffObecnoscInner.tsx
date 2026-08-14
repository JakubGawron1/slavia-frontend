"use client";

import { AttendanceListView } from "./AttendanceListView";
import { PendingScansSection } from "./PendingScansSection";
import { QrPanel } from "./QrPanel";
import { useStaffObecnosc } from "./useStaffObecnosc";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

export default function StaffObecnoscInner() {
  const o = useStaffObecnosc();

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Trening"
        title="Obecność"
        description="Stały kod QR klubu — działa na kolejne treningi, aż go odświeżysz."
      />

      {o.error ? <InlineStatus kind="error">{o.error}</InlineStatus> : null}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <QrPanel
          session={o.session}
          qrPayload={o.qrPayload}
          onRefresh={() => void o.refreshQr()}
        />

        <div className="space-y-6">
          <PendingScansSection
            pending={o.pending}
            trainings={o.trainings}
            approveEventById={o.approveEventById}
            onApproveEventChange={(recordId, eventId) =>
              o.setApproveEventById((prev) => ({ ...prev, [recordId]: eventId }))
            }
            onApprove={(r) => void o.approvePending(r)}
            onReject={(r) => void o.rejectPending(r)}
          />

          <AttendanceListView
            trainings={o.trainings}
            selectedEventId={o.selectedEventId}
            onSelectedEventIdChange={o.setSelectedEventId}
            selectedTraining={o.selectedTraining}
            view={o.view}
            onViewChange={o.setView}
            users={o.users}
            filterUser={o.filterUser}
            onFilterUserChange={o.setFilterUser}
            onRefresh={() => void o.load()}
            filtered={o.filtered}
            byDay={o.byDay}
          />
        </div>
      </section>
    </div>
  );
}
