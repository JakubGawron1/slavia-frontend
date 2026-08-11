"use client";

import type { Dispatch, SetStateAction } from "react";
import type { PublicUser, TrainingPlanProgress } from "@/lib/api/generated/models";
import { btnSecondary, inputClass, sectionLabel } from "@/components/plans/styles";

export function PlanProgressPanel({
  progressAll,
  users,
  replyDrafts,
  setReplyDrafts,
  onSaveReply,
}: {
  progressAll: TrainingPlanProgress[];
  users: PublicUser[];
  replyDrafts: Record<string, string>;
  setReplyDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  onSaveReply: (userId: string) => void;
}) {
  const rows = progressAll.filter((p) => p.athlete_feedback?.trim());
  if (rows.length === 0) return null;

  return (
    <section className="space-y-3 border-t border-paper/10 pt-4">
      <p className={sectionLabel}>Feedback zawodników</p>
      {rows.map((row) => {
        const name =
          users.find((u) => u.id === row.user_id)?.display_name ??
          row.user_id.slice(0, 8);
        return (
          <div
            key={row.id}
            className="space-y-2 border border-paper/10 bg-chrome/20 p-3 sm:p-4"
          >
            <p className="text-sm font-medium">{name}</p>
            <p className="text-sm text-paper/70">{row.athlete_feedback}</p>
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Odpowiedź trenera po sesji…"
              value={replyDrafts[row.user_id] ?? ""}
              onChange={(e) =>
                setReplyDrafts((prev) => ({
                  ...prev,
                  [row.user_id]: e.target.value,
                }))
              }
            />
            <button
              type="button"
              className={btnSecondary}
              onClick={() => onSaveReply(row.user_id)}
            >
              Zapisz odpowiedź
            </button>
          </div>
        );
      })}
    </section>
  );
}
