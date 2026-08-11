"use client";

import { useEffect, useState } from "react";
import type { PublicUser, TrainingPlanProgress } from "@/lib/api/generated/models";
import {
  listPlanProgressAll,
  saveCoachReply,
} from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";

/** Feedback zawodników do edytowanego planu + odpowiedzi trenera. */
export function usePlanProgressReplies(planId: string | undefined, users: PublicUser[]) {
  const toast = useToast();
  const [progressAll, setProgressAll] = useState<TrainingPlanProgress[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!planId) {
      setProgressAll([]);
      return;
    }
    void (async () => {
      try {
        const res = await listPlanProgressAll(planId);
        const rows = (res.data as TrainingPlanProgress[]) ?? [];
        setProgressAll(rows);
        const drafts: Record<string, string> = {};
        for (const row of rows) {
          drafts[row.user_id] = row.coach_reply ?? "";
        }
        setReplyDrafts(drafts);
      } catch {
        setProgressAll([]);
      }
    })();
  }, [planId]);

  async function saveReply(userId: string) {
    if (!planId) return;
    try {
      await saveCoachReply(planId, {
        user_id: userId,
        coach_reply: replyDrafts[userId] ?? "",
      });
      const name = users.find((u) => u.id === userId)?.display_name ?? userId.slice(0, 8);
      toast.success("Wysłano odpowiedź", name);
      const res = await listPlanProgressAll(planId);
      setProgressAll((res.data as TrainingPlanProgress[]) ?? []);
    } catch (err) {
      toast.error("Odpowiedź", err instanceof Error ? err.message : "Błąd");
    }
  }

  return { progressAll, replyDrafts, setReplyDrafts, saveReply };
}
