"use client";

import type { Dispatch, SetStateAction } from "react";
import type { PublicUser, TrainingPlan, TrainingPlanProgress } from "@/lib/api/generated/models";
import { completionFromPlan } from "@/lib/plans/completion";
import { btnSecondary, inputClass, sectionLabel } from "@/components/plans/styles";

export function PlanProgressPanel({
  plan,
  progressAll,
  users,
  replyDrafts,
  setReplyDrafts,
  onSaveReply,
}: {
  plan: TrainingPlan;
  progressAll: TrainingPlanProgress[];
  users: PublicUser[];
  replyDrafts: Record<string, string>;
  setReplyDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  onSaveReply: (userId: string) => void;
}) {
  if (progressAll.length === 0) return null;

  return (
    <section className="space-y-3 border-t border-paper/10 pt-4">
      <p className={sectionLabel}>Postęp zawodników</p>
      {progressAll.map((row) => {
        const name =
          users.find((u) => u.id === row.user_id)?.display_name ??
          row.user_id.slice(0, 8);
        const { pct, done, total } = completionFromPlan(plan, row);
        return (
          <div
            key={row.id}
            className="space-y-2 border border-paper/10 bg-chrome/20 p-3 sm:p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-[11px] tabular-nums text-paper/50">
                {pct}% · {done}/{total}
                {row.completed_at ? " · ukończony" : ""}
              </p>
            </div>
            {row.athlete_feedback?.trim() ? (
              <>
                <p className="text-sm text-paper/70">{row.athlete_feedback}</p>
                <label className="space-y-1">
                  <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                    Odpowiedź trenera
                  </span>
                  <textarea
                    className={inputClass}
                    rows={2}
                    placeholder="Po sesji…"
                    value={replyDrafts[row.user_id] ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({
                        ...prev,
                        [row.user_id]: e.target.value,
                      }))
                    }
                  />
                </label>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => onSaveReply(row.user_id)}
                >
                  Zapisz odpowiedź
                </button>
              </>
            ) : (
              <p className="text-xs text-paper/40">Brak feedbacku.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
