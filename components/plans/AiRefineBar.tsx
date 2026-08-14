"use client";

import type { TrainingPlan } from "@/lib/api/generated/models";
import type { AiPlanDraft } from "@/components/plans/useAiPlanDraft";
import { btnSecondary, inputClass, panelClass, sectionLabel } from "@/components/plans/styles";

export function AiRefineBar({
  ai,
  editing,
}: {
  ai: AiPlanDraft;
  editing: TrainingPlan;
}) {
  const saved = Boolean(editing.id);
  const exhausted = ai.draftsRemaining === 0;
  const canRun = saved || Boolean(ai.aiPrompt.trim());
  return (
    <div className={`${panelClass} !space-y-3`}>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[200px] flex-1 space-y-1.5">
          <span className={sectionLabel}>
            {saved ? "Dopracuj AI (nowy niespisany szkic)" : "Generuj ponownie"}
          </span>
          <input
            className={inputClass}
            placeholder={
              saved
                ? "Co zmienić? Np. więcej rwania, lżejszy czwartek…"
                : "Ten sam opis — wygeneruj od nowa"
            }
            value={ai.aiPrompt}
            onChange={(e) => ai.setAiPrompt(e.target.value)}
            disabled={ai.aiBusy}
          />
        </label>
        <button
          type="button"
          className={btnSecondary}
          disabled={ai.aiBusy || exhausted || !canRun}
          onClick={() => void ai.doAiRefine(editing)}
        >
          {ai.aiBusy ? "Generuję…" : saved ? "Dopracuj" : "Generuj ponownie"}
        </button>
      </div>
      {saved ? (
        <p className="text-[11px] text-paper/40">
          Zapisany plan zostaje bez zmian — otworzy się nowy szkic do zapisu.
        </p>
      ) : null}
      {exhausted ? (
        <p className="text-[11px] text-paper/45">Dzienny limit szkiców wyczerpany.</p>
      ) : null}
    </div>
  );
}
