"use client";

import type { AthleteGroup, PublicUser } from "@/lib/api/generated/models";
import { DAY_LABELS } from "@/lib/plans/helpers";
import type { AiPlanDraft } from "@/components/plans/useAiPlanDraft";
import {
  btnSecondary,
  chipActive,
  chipIdle,
  inputClass,
  sectionLabel,
} from "@/components/plans/styles";

export function AiDraftPanel({
  ai,
  users,
  groups,
}: {
  ai: AiPlanDraft;
  users: PublicUser[];
  groups: AthleteGroup[];
}) {
  const remaining =
    ai.draftsRemaining != null && ai.draftsLimit != null
      ? `${ai.draftsRemaining}/${ai.draftsLimit} szkiców dziś`
      : null;

  const exhausted = ai.draftsRemaining === 0;
  return (
    <div className="space-y-3 border border-paper/10 bg-paper/[0.03] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={sectionLabel}>Szkic AI</p>
        {remaining ? (
          <p className="text-[11px] text-paper/45">{remaining}</p>
        ) : null}
      </div>
      <label className="block space-y-1.5">
        <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
          Opis programu
        </span>
        <textarea
          className={inputClass}
          rows={3}
          maxLength={ai.maxPrompt}
          placeholder="Np. 12 tygodni siły, peaking na zawody, 3×/tyg., dużo rwania…"
          value={ai.aiPrompt}
          onChange={(e) => ai.setAiPrompt(e.target.value)}
          disabled={ai.aiBusy}
        />
        <span className="block text-[10px] text-paper/35">
          {ai.aiPrompt.length}/{ai.maxPrompt}
        </span>
      </label>
      <div className="flex flex-wrap items-end gap-3">
        <label className="w-24 space-y-1.5">
          <span className={sectionLabel}>Tyg.</span>
          <input
            className={inputClass}
            type="number"
            min={1}
            max={16}
            value={ai.aiWeeks}
            onChange={(e) =>
              ai.setAiWeeks(e.target.value ? Number(e.target.value) : 4)
            }
            disabled={ai.aiBusy}
          />
        </label>
        <div className="space-y-1.5">
          <p className={sectionLabel}>Dni</p>
          <div className="flex flex-wrap gap-1.5">
            {DAY_LABELS.slice(1).map((label, i) => {
              const day = i + 1;
              const on = ai.aiDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={on ? chipActive : chipIdle}
                  disabled={ai.aiBusy}
                  aria-pressed={on}
                  onClick={() => ai.toggleAiDay(day)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className={sectionLabel}>Zawodnik (opcjonalnie)</span>
          <select
            className={inputClass}
            value={ai.aiUserId}
            disabled={ai.aiBusy}
            onChange={(e) => ai.setAiUserId(e.target.value)}
          >
            <option value="">— bez kontekstu PR —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.display_name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className={sectionLabel}>Grupa (opcjonalnie)</span>
          <select
            className={inputClass}
            value={ai.aiGroupId}
            disabled={ai.aiBusy}
            onChange={(e) => ai.setAiGroupId(e.target.value)}
          >
            <option value="">— bez grupy —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {exhausted ? (
        <p className="text-[11px] text-paper/45">
          Dzienny limit szkiców wyczerpany — spróbuj jutro albo poproś admina o podniesienie limitu.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void ai.doAiDraft()}
        className={btnSecondary}
        disabled={ai.aiBusy || exhausted || !ai.aiPrompt.trim()}
      >
        {ai.aiBusy ? "Generuję…" : "Generuj szkic"}
      </button>
    </div>
  );
}
