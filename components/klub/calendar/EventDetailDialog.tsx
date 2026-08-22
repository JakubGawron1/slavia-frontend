import { Modal } from "@/components/ui/Modal";
import {
  eventAssignedIds,
  eventTypeLabel,
  eventWithdrawals,
  type CalendarEventFull,
  type WithdrawalStatus,
} from "@/lib/events";
import type { AthleteProfile } from "@/lib/api/generated/models";
import { AttendanceSection } from "@/components/klub/calendar/AttendanceSection";
import { CompetitionEntriesSection } from "@/components/klub/calendar/CompetitionEntriesSection";
import type { RosterAttendanceRow } from "@/components/klub/calendar/useStaffCalendar";

export function EventDetailDialog({
  detail,
  profiles,
  missingForDetail,
  detailRoster,
  onClose,
  onEdit,
  onRequestCancel,
  onRestore,
  onGoToAttendance,
  onRequestDelete,
  onAcceptWithdrawal,
  onRejectWithdrawal,
  onClearWithdrawal,
}: {
  detail: CalendarEventFull | null;
  profiles: AthleteProfile[];
  missingForDetail: AthleteProfile[];
  detailRoster: RosterAttendanceRow[];
  onClose: () => void;
  onEdit: (ev: CalendarEventFull) => void;
  onRequestCancel: (ev: CalendarEventFull) => void;
  onRestore: (ev: CalendarEventFull) => void;
  onGoToAttendance: () => void;
  onRequestDelete: (ev: CalendarEventFull) => void;
  onAcceptWithdrawal: (ev: CalendarEventFull, athleteId: string) => void;
  onRejectWithdrawal: (ev: CalendarEventFull, athleteId: string) => void;
  onClearWithdrawal: (ev: CalendarEventFull, athleteId: string) => void;
}) {
  return (
    <Modal open={!!detail} title={detail?.title ?? "Szczegóły"} onClose={onClose} wide>
      {detail ? (
        <div className="space-y-4">
          <p className="text-sm text-paper/55">
            {eventTypeLabel(detail.event_type)}
            {detail.status === "cancelled" ? " · odwołane" : ""} ·{" "}
            {detail.end_date && detail.end_date !== detail.date
              ? `${detail.date} – ${detail.end_date}`
              : detail.date}
            {detail.time ? ` · ${detail.time}` : ""}
            {detail.location ? ` · ${detail.location}` : ""}
          </p>
          {detail.plan_id ? (
            <p className="text-sm text-brand">Powiązany z planem treningowym</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
              onClick={() => {
                onEdit(detail);
                onClose();
              }}
            >
              Edytuj
            </button>
            {detail.status === "scheduled" ? (
              <button
                type="button"
                className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
                onClick={() => onRequestCancel(detail)}
              >
                Odwołaj
              </button>
            ) : (
              <button
                type="button"
                className="border border-paper/20 px-3 py-1.5 text-xs uppercase"
                onClick={() => onRestore(detail)}
              >
                Przywróć
              </button>
            )}
            {detail.event_type === "trening" && detail.status === "scheduled" ? (
              <button
                type="button"
                className="bg-brand px-3 py-1.5 text-xs text-paper uppercase"
                onClick={() => onGoToAttendance()}
              >
                Otwórz obecność
              </button>
            ) : null}
            <button
              type="button"
              className="border border-brand/40 px-3 py-1.5 text-xs text-brand uppercase"
              onClick={() => onRequestDelete(detail)}
            >
              Usuń
            </button>
          </div>

          {detail.event_type === "zawody" ? (
            <CompetitionEntriesSection
              assignedAthleteIds={eventAssignedIds(detail)}
              profiles={profiles}
              missingForDetail={missingForDetail}
            />
          ) : (
            <AttendanceSection detailRoster={detailRoster} />
          )}

          {eventWithdrawals(detail).length > 0 ? (
            <div>
              <h3 className="font-display text-sm uppercase">Rezygnacje</h3>
              <ul className="mt-2 space-y-2">
                {eventWithdrawals(detail).map((w) => {
                  const p = profiles.find((x) => x.id === w.athlete_id);
                  const st = w.status as WithdrawalStatus;
                  return (
                    <li
                      key={`${w.athlete_id}-${w.at}`}
                      className="flex flex-wrap items-center justify-between gap-2 border border-paper/15 px-3 py-2 text-sm"
                    >
                      <span>
                        <strong>{p?.display_name ?? w.athlete_id}</strong> —{" "}
                        {w.reason} <span className="text-paper/45">({st})</span>
                      </span>
                      <span className="flex gap-2">
                        {st === "pending" && detail.event_type === "zawody" ? (
                          <>
                            <button
                              type="button"
                              className="text-xs uppercase text-brand"
                              onClick={() =>
                                onAcceptWithdrawal(detail, w.athlete_id)
                              }
                            >
                              Akceptuj
                            </button>
                            <button
                              type="button"
                              className="text-xs uppercase"
                              onClick={() =>
                                onRejectWithdrawal(detail, w.athlete_id)
                              }
                            >
                              Odrzuć
                            </button>
                          </>
                        ) : null}
                        {st === "accepted" && detail.event_type === "trening" ? (
                          <button
                            type="button"
                            className="text-xs uppercase"
                            onClick={() =>
                              onClearWithdrawal(detail, w.athlete_id)
                            }
                          >
                            Przywróć
                          </button>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
