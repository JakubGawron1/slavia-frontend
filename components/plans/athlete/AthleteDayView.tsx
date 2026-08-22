"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  AthleteStats,
  ExercisePr,
  PlanExercise,
  PlanSet,
  TrainingPlan,
} from "@/lib/api/generated/models";
import { resolveLoad } from "@/lib/plans/resolveLoad";
import { resolvePlanToday } from "@/lib/plans/today";
import { MUST_DO_CHIP, WEEKDAY_LONG, isMustDo } from "@/lib/plans/labels";

function SetRow({
  set,
  stats,
  pr,
}: {
  set: PlanSet;
  stats?: AthleteStats | null;
  pr?: number | null;
}) {
  const resolved = resolveLoad(set.load, stats, pr);
  const warmup = (set.kind ?? "work") === "warmup";
  return (
    <li
      className={`flex flex-wrap items-baseline justify-between gap-2 ${
        warmup ? "text-paper/45" : "text-paper"
      }`}
    >
      <span className="text-sm">
        {warmup ? "W" : "R"} · {set.reps}
      </span>
      <span className={warmup ? "text-sm" : "font-display text-xl text-brand"}>
        {resolved.label}
      </span>
      {set.rpe != null ? (
        <span className="border border-paper/20 px-1.5 py-0.5 font-display text-[10px] tracking-[0.1em] uppercase">
          RPE {set.rpe}
        </span>
      ) : null}
      {resolved.hint ? (
        <span className="w-full text-xs text-paper/40">{resolved.hint}</span>
      ) : null}
    </li>
  );
}

function ExerciseView({
  ex,
  stats,
  prs,
  altId,
  onAlt,
}: {
  ex: PlanExercise;
  stats?: AthleteStats | null;
  prs: ExercisePr[];
  altId?: string;
  onAlt: (id?: string) => void;
}) {
  const alt = (ex.alternatives ?? []).find((a) => a.id === altId);
  const chosen = alt
    ? { name: alt.name, sets: alt.sets ?? ex.sets ?? [], library_id: alt.library_id }
    : { name: ex.name, sets: ex.sets ?? [], library_id: ex.library_id };
  const pr = prs.find((p) => p.exercise_id === chosen.library_id)?.kg;
  const warmup = (ex.role ?? "main") === "warmup";
  const mustDo = isMustDo(ex.role) && !warmup;
  return (
    <article
      className={`border p-3 ${
        mustDo
          ? "border-amber-400/50 bg-amber-500/12"
          : warmup
            ? "border-paper/10 opacity-70"
            : "border-paper/10"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          className={
            warmup
              ? "text-sm text-paper/60"
              : mustDo
                ? "font-display text-base text-amber-100 uppercase"
                : "font-display text-base text-paper uppercase"
          }
        >
          {chosen.name}
        </h3>
        {mustDo ? <span className={MUST_DO_CHIP}>Must do</span> : null}
        {(ex.alternatives ?? []).length > 0 ? (
          <label className="text-xs text-paper/55">
            Zamiennik
            <select
              className="ml-2 border border-paper/20 bg-chrome/60 px-2 py-1"
              value={altId ?? ""}
              onChange={(e) => onAlt(e.target.value || undefined)}
            >
              <option value="">{ex.name}</option>
              {(ex.alternatives ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <ul className="mt-2 space-y-1">
        {chosen.sets.map((s) => (
          <SetRow key={s.id} set={s} stats={stats} pr={pr} />
        ))}
      </ul>
    </article>
  );
}

export function AthleteDayView({
  plan,
  stats,
  prs,
}: {
  plan: TrainingPlan;
  stats?: AthleteStats | null;
  prs: ExercisePr[];
}) {
  const today = resolvePlanToday(plan);
  const [alts, setAlts] = useState<Record<string, string | undefined>>({});

  return (
    <div className="space-y-6">
      <section className="border border-brand/30 bg-brand/10 p-4">
        <p className="font-display text-[11px] tracking-[0.14em] text-brand uppercase">
          Dziś · T{today.weekIndex} · {WEEKDAY_LONG[today.weekday]}
        </p>
        {today.day ? (
          <div className="mt-3 space-y-3">
            {(today.day.exercises ?? []).map((ex) => (
              <ExerciseView
                key={ex.id}
                ex={ex}
                stats={stats}
                prs={prs}
                altId={alts[ex.id]}
                onAlt={(id) => setAlts((m) => ({ ...m, [ex.id]: id }))}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-paper/60">
            Dziś nie ma sesji w tym mikrocyklu.
          </p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Reszta tygodnia T{today.weekIndex}
        </h2>
        {(today.week?.days ?? [])
          .filter((d) => d.weekday !== today.weekday)
          .map((d) => (
            <details key={d.id} className="border border-paper/10 p-3">
              <summary className="cursor-pointer font-display text-sm uppercase">
                {WEEKDAY_LONG[d.weekday]}
              </summary>
              <div className="mt-3 space-y-3">
                {(d.exercises ?? []).map((ex) => (
                  <ExerciseView
                    key={ex.id}
                    ex={ex}
                    stats={stats}
                    prs={prs}
                    altId={alts[ex.id]}
                    onAlt={(id) => setAlts((m) => ({ ...m, [ex.id]: id }))}
                  />
                ))}
              </div>
            </details>
          ))}
      </section>
      <Link href="/panel/plany" className="text-sm text-brand">
        Wszystkie plany
      </Link>
    </div>
  );
}
