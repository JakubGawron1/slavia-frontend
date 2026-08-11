"use client";

import { AttendanceListView } from "./AttendanceListView";
import { PendingScansSection } from "./PendingScansSection";
import { QrPanel } from "./QrPanel";
import { useStaffObecnosc } from "./useStaffObecnosc";

export default function StaffObecnoscInner() {
  const o = useStaffObecnosc();

  return (
    <div className="animate-rise max-w-5xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Trening
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Obecność
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Stały kod QR klubu — działa na kolejne treningi, aż go odświeżysz.
        </p>
      </div>

      {o.error ? (
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
          {o.error}
        </p>
      ) : null}

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
