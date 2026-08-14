"use client";

import { useCallback, useEffect, useState } from "react";
import type { TrainingPlan } from "@/lib/api/generated/models";
import type { AiDraftBody } from "@/lib/api/generated/models/aiDraftBody";
import { aiDraftPlan, getAiUsage } from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";

const MAX_PROMPT = 4000;
const DEFAULT_DAYS = [1, 3, 5];

export function useAiPlanDraft(
  aiEnabled: boolean,
  openEdit: (plan: TrainingPlan) => void,
) {
  const toast = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiWeeks, setAiWeeks] = useState(4);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiDays, setAiDays] = useState<number[]>(DEFAULT_DAYS);
  const [aiUserId, setAiUserId] = useState("");
  const [aiGroupId, setAiGroupId] = useState("");
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null);
  const [draftsLimit, setDraftsLimit] = useState<number | null>(null);

  const refreshUsage = useCallback(async () => {
    if (!aiEnabled) return;
    try {
      const res = await getAiUsage();
      if (res.status === 200 && res.data && "drafts_remaining" in res.data) {
        setDraftsRemaining(res.data.drafts_remaining);
        setDraftsLimit(res.data.drafts_limit);
      }
    } catch {
      /* limit tylko podpowiedź */
    }
  }, [aiEnabled]);

  useEffect(() => {
    void refreshUsage();
  }, [refreshUsage]);

  function toggleAiDay(day: number) {
    setAiDays((prev) => {
      const next = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b);
      return next.length ? next : prev;
    });
  }

  async function generate(sourcePlanId?: string, promptOverride?: string) {
    if (aiBusy) return;
    if (draftsRemaining === 0) {
      toast.error("AI", "Dzienny limit szkiców wyczerpany.");
      return;
    }
    const prompt = (promptOverride ?? aiPrompt).trim();
    if (!prompt) {
      toast.error("AI", "Opisz program treningowy.");
      return;
    }
    if (prompt.length > MAX_PROMPT) {
      toast.error("AI", `Prompt jest za długi (max ${MAX_PROMPT} znaków).`);
      return;
    }
    setAiBusy(true);
    try {
      const body: AiDraftBody = {
        prompt,
        weeks: Math.min(16, Math.max(1, aiWeeks || 4)),
        days_of_week: aiDays.length ? aiDays : null,
        assigned_user_id: aiUserId || null,
        assigned_group_id: aiGroupId || null,
        source_plan_id: sourcePlanId || null,
      };
      const res = await aiDraftPlan(body);
      const plan = res.data as TrainingPlan;
      openEdit({ ...plan, id: "" });
      toast.success(
        sourcePlanId ? "Dopracowano szkic AI" : "Szkic AI gotowy",
        "Sprawdź i zapisz, gdy będzie OK.",
      );
      await refreshUsage();
    } catch (err) {
      toast.error("AI", err instanceof Error ? err.message : "Błąd");
    } finally {
      setAiBusy(false);
    }
  }

  async function doAiDraft() {
    await generate();
  }

  async function doAiRefine(editing: TrainingPlan | null) {
    if (!editing) {
      await generate();
      return;
    }
    const fallback =
      aiPrompt.trim() ||
      editing.description?.trim() ||
      `Dopracuj plan «${editing.title}»`;
    if (!aiPrompt.trim()) {
      setAiPrompt(fallback);
    }
    await generate(editing.id || undefined, fallback);
  }

  return {
    aiPrompt,
    setAiPrompt,
    aiWeeks,
    setAiWeeks,
    aiBusy,
    aiDays,
    toggleAiDay,
    aiUserId,
    setAiUserId,
    aiGroupId,
    setAiGroupId,
    draftsRemaining,
    draftsLimit,
    maxPrompt: MAX_PROMPT,
    doAiDraft,
    doAiRefine,
  };
}

export type AiPlanDraft = ReturnType<typeof useAiPlanDraft>;
