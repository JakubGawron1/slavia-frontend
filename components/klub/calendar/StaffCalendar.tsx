"use client";

import { ISO_WEEKDAY_SHORT } from "@/lib/calendar";
import { CalendarMonthGrid } from "@/components/calendar/CalendarMonthGrid";
import { Modal } from "@/components/ui/Modal";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventDetailDialog } from "@/components/klub/calendar/EventDetailDialog";
import { EventFormDialog } from "@/components/klub/calendar/EventFormDialog";
import { useStaffCalendar } from "@/components/klub/calendar/useStaffCalendar";

const fieldClass =
  "mt-1 w-full border border-paper/20 bg-chrome/60 px-3 py-2 text-sm text-paper outline-none focus:border-brand";

export function StaffCalendar() {
  const cal = useStaffCalendar();
  const {
    todayKey,
    profiles,
    schedule,
    setSchedule,
    error,
    hideCancelled,
    setHideCancelled,
    form,
    setForm,
    formMode,
    ctx,
    setCtx,
    detail,
    setDetail,
    dialog,
    setDialog,
    clubEvents,
    activeAthletes,
    missingForDetail,
    detailRoster,
    openCreate,
    openEdit,
    onSelectEvent,
    saveForm,
    requestDelete,
    confirmDelete,
    requestCancel,
    confirmCancel,
    restoreEvent,
    goToAttendance,
    acceptWithdrawal,
    rejectWithdrawal,
    clearWithdrawal,
    saveSchedule,
    confirmSchedule,
  } = cal;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          eyebrow="Kadra"
          title="Kalendarz zawodów"
          description="Kliknij dzień, aby dodać wydarzenie. Kliknij wydarzenie — menu Edytuj / Usuń."
        />
        <button
          type="button"
          onClick={() => openCreate()}
          className="bg-brand px-4 py-2.5 font-display text-sm tracking-wide text-paper uppercase"
        >
          + Nowe wydarzenie
        </button>
      </div>

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}

      {schedule ? (
        <form
          onSubmit={saveSchedule}
          className="space-y-4 border border-paper/10 bg-paper/[0.03] p-4 sm:p-5"
        >
          <h2 className="font-display text-lg uppercase tracking-wide">
            Terminarz treningów
          </h2>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6, 7] as const).map((d) => {
              const on = schedule.weekdays.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setSchedule({
                      ...schedule,
                      weekdays: on
                        ? schedule.weekdays.filter((x) => x !== d)
                        : [...schedule.weekdays, d].sort(),
                    })
                  }
                  className={`px-3 py-2 font-display text-xs uppercase ${
                    on
                      ? "bg-brand text-paper"
                      : "border border-paper/20 text-paper/60"
                  }`}
                >
                  {ISO_WEEKDAY_SHORT[d]}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm text-paper/70">
              Start
              <input
                className={fieldClass}
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
              />
            </label>
            <label className="text-sm text-paper/70">
              Koniec
              <input
                className={fieldClass}
                value={schedule.end_time}
                onChange={(e) =>
                  setSchedule({ ...schedule, end_time: e.target.value })
                }
              />
            </label>
            <label className="text-sm text-paper/70 sm:col-span-2">
              Miejsce
              <input
                className={fieldClass}
                value={schedule.location}
                onChange={(e) =>
                  setSchedule({ ...schedule, location: e.target.value })
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className="border border-paper/20 px-4 py-2 font-display text-sm uppercase tracking-wide hover:border-brand"
          >
            Zapisz terminarz
          </button>
        </form>
      ) : null}

      <div className="flex w-full min-w-0 min-h-[min(48rem,calc(100svh-10.5rem))] flex-col rounded border border-paper/10">
        <div className="min-h-0 flex-1">
          <CalendarMonthGrid
            events={clubEvents}
            todayKey={todayKey}
            filterTypes={["zawody", "trening"]}
            hideCancelled={hideCancelled}
            onHideCancelledChange={setHideCancelled}
            onSelectDay={(dateKey) => openCreate(dateKey)}
            onSelectEvent={onSelectEvent}
            size="large"
            layout="wide"
            tone="panel"
          />
        </div>
      </div>

      {ctx ? (
        <div
          className="fixed z-[60] min-w-[11rem] border border-paper/20 bg-chrome py-1 shadow-xl"
          style={{ left: ctx.x, top: ctx.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="truncate border-b border-paper/10 px-3 py-2 text-xs text-paper/45">
            {ctx.event.title}
          </p>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-paper hover:bg-paper/10"
            onClick={() => openEdit(ctx.event)}
          >
            Edytuj
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-paper hover:bg-paper/10"
            onClick={() => {
              setDetail(ctx.event);
              setCtx(null);
            }}
          >
            Szczegóły
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-sm text-brand hover:bg-brand/10"
            onClick={() => requestDelete(ctx.event)}
          >
            Usuń
          </button>
        </div>
      ) : null}

      <EventFormDialog
        form={form}
        formMode={formMode}
        activeAthletes={activeAthletes}
        onChange={setForm}
        onSubmit={saveForm}
        onClose={() => setForm(null)}
      />

      <EventDetailDialog
        detail={detail}
        profiles={profiles}
        missingForDetail={missingForDetail}
        detailRoster={detailRoster}
        onClose={() => setDetail(null)}
        onEdit={openEdit}
        onRequestCancel={requestCancel}
        onRestore={(ev) => void restoreEvent(ev)}
        onGoToAttendance={goToAttendance}
        onRequestDelete={requestDelete}
        onAcceptWithdrawal={(ev, id) => void acceptWithdrawal(ev, id)}
        onRejectWithdrawal={(ev, id) => void rejectWithdrawal(ev, id)}
        onClearWithdrawal={(ev, id) => void clearWithdrawal(ev, id)}
      />

      <Modal
        open={dialog?.kind === "cancel"}
        title="Odwołaj wydarzenie"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "cancel" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Odwołać <strong className="text-paper">{dialog.event.title}</strong>?
            </p>
            <label className="block text-sm text-paper/70">
              Powód odwołania (opcjonalnie)
              <textarea
                className={fieldClass}
                rows={3}
                value={dialog.note}
                onChange={(e) =>
                  setDialog({ ...dialog, note: e.target.value })
                }
                placeholder="Np. brak sali, zmiana terminu…"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmCancel()}
              >
                Odwołaj
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "delete"}
        title="Usuń wydarzenie"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "delete" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Usunąć trwale{" "}
              <strong className="text-paper">{dialog.event.title}</strong>? Tej
              operacji nie da się cofnąć.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmDelete()}
              >
                Usuń
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "restore-force"}
        title="Kolizja przy przywracaniu"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "restore-force" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60 whitespace-pre-wrap">
              {dialog.message}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void restoreEvent(dialog.event, true)}
              >
                Wymuś przywrócenie
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={dialog?.kind === "schedule"}
        title="Zapisz terminarz"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === "schedule" ? (
          <div className="space-y-4">
            <p className="text-sm text-paper/60">
              Zapisać terminarz? Przyszłe seedowane treningi poza nowymi dniami
              zostaną usunięte.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
                onClick={() => void confirmSchedule()}
              >
                Zapisz
              </button>
              <button
                type="button"
                className="border border-paper/20 px-4 py-2 text-sm"
                onClick={() => setDialog(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
