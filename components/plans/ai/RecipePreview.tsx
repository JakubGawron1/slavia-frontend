"use client";

import type { AiPlanRecipe } from "@/lib/api/generated/models";
import {
  PLAN_EYEBROW,
  PLAN_SURFACE,
  SESSION_LABEL,
  WEEKDAY_LONG,
} from "@/lib/plans/labels";
import type { SessionTemplate } from "@/lib/api/generated/models";

export function RecipePreview({ recipe }: { recipe: AiPlanRecipe }) {
  const weeks = recipe.weeks ?? 0;
  return (
    <div className={`${PLAN_SURFACE} space-y-5 px-5 py-5`}>
      <div>
        <p className={PLAN_EYEBROW}>Przepis</p>
        <h2 className="mt-1 font-display text-xl uppercase text-brand">
          {recipe.title || "Szkic AI"}
        </h2>
        <p className="mt-1 text-sm text-paper/55">
          {weeks} tyg.
          {recipe.meet_week != null ? ` · szczyt / zawody T${recipe.meet_week}` : ""}
        </p>
        {recipe.notes ? (
          <p className="mt-2 text-sm text-paper/70">{recipe.notes}</p>
        ) : null}
      </div>
      {(recipe.phases ?? []).length > 0 ? (
        <div>
          <p className={`${PLAN_EYEBROW} mb-2`}>Fazy</p>
          <ul className="space-y-1 text-sm text-paper/70">
            {(recipe.phases ?? []).map((p, i) => (
              <li key={p.id ?? i}>
                {p.intent || p.id || "faza"} · T{(p.weeks ?? []).join(", T")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div>
        <p className={`${PLAN_EYEBROW} mb-2`}>Mikrocykl (T1)</p>
        <ul className="space-y-3">
          {(recipe.cycle ?? []).map((day) => (
            <li key={day.weekday} className="border-t border-paper/10 pt-3">
              <p className="font-display text-sm tracking-wide text-paper uppercase">
                {WEEKDAY_LONG[day.weekday] ?? `Dzień ${day.weekday}`}
                {day.club_session !== false ? (
                  <span className="ml-2 font-display text-[10px] tracking-[0.12em] text-paper/40">
                    sesja Slavi
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-paper/40">
                {day.session && day.session in SESSION_LABEL
                  ? SESSION_LABEL[day.session as SessionTemplate]
                  : (day.session ?? "")}
              </p>
              <ul className="mt-1 text-sm text-paper/70">
                {(day.mains ?? []).map((m, i) => (
                  <li key={`${m.name}-${i}`}>
                    {m.name}
                    {m.wave_id ? ` · fala ${m.wave_id}` : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {(recipe.waves ?? []).length > 0 ? (
        <div>
          <p className={`${PLAN_EYEBROW} mb-2`}>Fale</p>
          <ul className="space-y-1 text-sm text-paper/70">
            {(recipe.waves ?? []).map((w) => (
              <li key={w.id}>
                {w.id}: T1 {w.t1?.sets}×{w.t1?.reps} @{w.t1?.pct}% → T
                {w.peak?.week} {w.peak?.sets}×{w.peak?.reps} @{w.peak?.pct}%
                {w.deload_pct_delta != null
                  ? ` · deload ${w.deload_pct_delta > 0 ? "+" : ""}${w.deload_pct_delta} pp`
                  : ""}
                {w.volume_on_deload != null
                  ? ` · objętość deload ×${w.volume_on_deload}`
                  : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
