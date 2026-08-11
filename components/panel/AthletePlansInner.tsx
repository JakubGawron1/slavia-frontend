"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  PlanExercise,
  PlanProgressEntry,
  TrainingPlan,
  TrainingPlanProgress,
} from "@/lib/api/generated/models";
import {
  athleteStats,
  getMyProgress,
  listPlans,
  saveProgress,
} from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";
import { usePanel } from "@/components/panel/PanelProvider";
import {
  DAY_LABELS,
  ensureWeeks,
  expandSetScheme,
  flattenExercises,
  formatPrescription,
  pctOfLabel,
  resolveLoadKg,
  todayIsoWeekday,
  usesExercisePr,
} from "@/lib/plans/helpers";

export function AthletePlansInner() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, PlanProgressEntry>>({});
  const [feedback, setFeedback] = useState("");
  const [coachReply, setCoachReply] = useState<string | null>(null);
  const [coachRepliedAt, setCoachRepliedAt] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [bests, setBests] = useState<{
    snatch?: number | null;
    cj?: number | null;
    total?: number | null;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [weekIdx, setWeekIdx] = useState(0);
  const [onlyToday, setOnlyToday] = useState(false);

  const load = useCallback(async () => {
    try {
      const [res, statsRes] = await Promise.all([
        listPlans(),
        athleteStats().catch(() => null),
      ]);
      const list = (res.data as TrainingPlan[]) ?? [];
      setPlans(list);
      setActiveId((prev) => {
        if (planFromUrl && list.some((p) => p.id === planFromUrl)) {
          return planFromUrl;
        }
        if (prev && list.some((p) => p.id === prev)) return prev;
        const season = list.find((p) => p.is_season_active);
        return season?.id ?? list[0]?.id ?? null;
      });
      setProgress({});
      const s = statsRes?.status === 200 ? statsRes.data : null;
      if (s && "best_snatch_kg" in s) {
        setBests({
          snatch: s.best_snatch_kg,
          cj: s.best_clean_jerk_kg,
          total: s.best_total_kg,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd planów");
    }
  }, [planFromUrl]);

  useEffect(() => {
    void load();
  }, [load, scopeKey]);

  useEffect(() => {
    if (!activeId) return;
    void (async () => {
      try {
        const pRes = await getMyProgress(activeId);
        const p = pRes.data as TrainingPlanProgress;
        const map: Record<string, PlanProgressEntry> = {};
        for (const e of p.entries ?? []) map[e.exercise_id] = e;
        setProgress(map);
        setFeedback(p.athlete_feedback ?? "");
        setCoachReply(p.coach_reply ?? null);
        setCoachRepliedAt(p.coach_replied_at ?? null);
        setCompletedAt(p.completed_at ?? null);
        setWeekIdx(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd postępu");
      }
    })();
  }, [activeId]);

  const plan = plans.find((p) => p.id === activeId);
  const weeks = useMemo(() => (plan ? ensureWeeks(plan) : []), [plan]);
  const today = todayIsoWeekday();

  function entryFor(exId: string): PlanProgressEntry {
    return (
      progress[exId] ?? {
        exercise_id: exId,
        completed: false,
        athlete_note: null,
        actual_load_kg: null,
        selected_alternative_id: null,
      }
    );
  }

  function patchEntry(exId: string, patch: Partial<PlanProgressEntry>) {
    setProgress((prev) => ({
      ...prev,
      [exId]: { ...entryFor(exId), ...patch },
    }));
    setSaved(false);
  }

  async function save() {
    if (!activeId) return;
    setError(null);
    try {
      const res = await saveProgress(activeId, {
        entries: Object.values(progress),
        athlete_feedback: feedback || null,
      });
      const p = res.data as TrainingPlanProgress;
      setCompletedAt(p.completed_at ?? null);
      setSaved(true);
      toast.success("Zapisano postęp treningu");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("Postęp planu", msg);
    }
  }

  const dayExercises = useMemo(() => {
    const out: { day: number; ex: PlanExercise }[] = [];
    if (!plan) return out;

    const w = weeks[weekIdx];
    if (w) {
      for (const d of w.days ?? []) {
        const sorted = [...(d.exercises ?? [])].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        );
        for (const ex of sorted) {
          out.push({ day: d.day_of_week, ex });
        }
      }
    }

    // Fallback: puste tygodnie / legacy flat list
    if (out.length === 0) {
      for (const ex of flattenExercises(plan)) {
        out.push({ day: 1, ex });
      }
    }

    if (onlyToday) {
      return out.filter((row) => row.day === today);
    }
    return out;
  }, [weeks, weekIdx, plan, onlyToday, today]);

  return (
    <div className="animate-rise max-w-3xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Trening
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Plany treningowe
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Serie, obciążenie %1RM, zamienniki i odhaczanie postępu.
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={
              activeId === p.id
                ? "border border-brand bg-brand px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
                : "border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper/65 uppercase hover:border-paper/40 hover:text-paper"
            }
          >
            {p.title}
            {p.is_season_active ? (
              <span className="ml-1.5 opacity-80">· sezon</span>
            ) : null}
            {planAssignmentBadge(p)}
          </button>
        ))}
        {plans.length === 0 ? (
          <p className="text-sm text-paper/45">Brak przypisanych planów.</p>
        ) : null}
      </div>

      {plan ? (
        <div className="space-y-5 border border-paper/10 bg-paper/[0.03] p-4 md:p-6">
          <div>
            <h2 className="font-display text-xl uppercase">{plan.title}</h2>
            {plan.week_label ? (
              <p className="mt-1 text-sm text-paper/50">{plan.week_label}</p>
            ) : null}
            {plan.description ? (
              <p className="mt-2 text-sm text-paper/65">{plan.description}</p>
            ) : null}
            {completedAt ? (
              <p className="mt-3 inline-block border border-brand bg-brand/15 px-2 py-1 font-display text-[10px] tracking-wider text-brand uppercase">
                Plan ukończony
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {weeks.length > 1
              ? weeks.map((w, i) => (
                  <button
                    key={w.week_index}
                    type="button"
                    onClick={() => setWeekIdx(i)}
                    className={
                      weekIdx === i
                        ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                        : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/60 uppercase"
                    }
                  >
                    {w.label ?? `T${w.week_index}`}
                  </button>
                ))
              : null}
            <label className="ml-auto flex items-center gap-1.5 text-xs text-paper/60">
              <input
                type="checkbox"
                checked={onlyToday}
                onChange={(e) => setOnlyToday(e.target.checked)}
              />
              Tylko dziś ({DAY_LABELS[today]})
            </label>
          </div>

          {dayExercises.length === 0 ? (
            <p className="border border-paper/10 bg-paper/[0.03] px-4 py-6 text-sm text-paper/50">
              {onlyToday
                ? "Brak ćwiczeń na dziś w tym tygodniu — wyłącz filtr lub wybierz inny tydzień."
                : "Ten plan nie ma jeszcze ćwiczeń. Poproś trenera o uzupełnienie rozpiski."}
            </p>
          ) : null}

          <ul className="space-y-3">
            {dayExercises.map(({ day, ex }) => {
              const entry = entryFor(ex.id);
              const selectedAlt = (ex.alternatives ?? []).find(
                (a) => a.id === entry.selected_alternative_id,
              );
              const active: PlanExercise = selectedAlt
                ? {
                    ...ex,
                    name: selectedAlt.name || ex.name,
                    sets: selectedAlt.sets ?? ex.sets,
                    reps: selectedAlt.reps ?? ex.reps,
                    load_kg: selectedAlt.load_kg ?? ex.load_kg,
                    load_pct: selectedAlt.load_pct ?? ex.load_pct,
                    pct_of: selectedAlt.pct_of ?? ex.pct_of,
                    set_scheme: ex.set_scheme,
                  }
                : ex;
              const scheme = expandSetScheme(active);
              const isToday = day === today;
              const hasExercisePr =
                usesExercisePr(active) ||
                scheme.some((s) => usesExercisePr(s));

              return (
                <li
                  key={ex.id}
                  className={
                    isToday
                      ? "border border-brand/40 bg-brand/[0.07] p-4"
                      : "border border-paper/10 bg-paper/[0.03] p-4"
                  }
                >
                  <p className="mb-2 text-[10px] tracking-wider text-paper/40 uppercase">
                    {DAY_LABELS[day] ?? day}
                    {isToday ? " · dziś" : ""}
                    {ex.is_warmup ? " · warm-up" : ""}
                  </p>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(entry.completed)}
                      onChange={() =>
                        patchEntry(ex.id, { completed: !entry.completed })
                      }
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{active.name}</span>
                      <span className="mt-1 block text-sm text-paper/55">
                        {formatPrescription(active, bests)}
                      </span>
                      {hasExercisePr ? (
                        <span className="mt-1 block text-xs text-paper/45">
                          Dobierz kg według własnego PR tego ruchu (nie ma go w
                          profilu).
                        </span>
                      ) : null}
                      {ex.notes ? (
                        <span className="mt-1 block text-sm text-paper/70">
                          Trener: {ex.notes}
                        </span>
                      ) : null}
                    </span>
                  </label>

                  {scheme.length > 0 ? (
                    <ol className="mt-3 space-y-1 border-t border-paper/10 pt-3 text-sm">
                      {scheme.map((s, i) => {
                        const kg = resolveLoadKg(s, bests);
                        return (
                          <li
                            key={`${ex.id}-set-${i}`}
                            className="flex flex-wrap gap-x-3 gap-y-0.5 text-paper/70"
                          >
                            <span className="w-10 text-paper/40">
                              {s.is_warmup ? "W" : `S${i + 1}`}
                            </span>
                            <span>{s.reps ?? "—"} powt.</span>
                            {s.load_pct != null ? (
                              <span>
                                {s.load_pct}%{" "}
                                {pctOfLabel(s.pct_of, active.name)}
                              </span>
                            ) : null}
                            {kg != null ? (
                              <span className="text-paper">{kg} kg</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ol>
                  ) : null}

                  {(ex.alternatives ?? []).length > 0 ? (
                    <div className="mt-3">
                      <p className="text-xs text-paper/45">Zamiennik (kontuzja)</p>
                      <select
                        className="mt-1 w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm"
                        value={entry.selected_alternative_id ?? ""}
                        onChange={(e) =>
                          patchEntry(ex.id, {
                            selected_alternative_id: e.target.value || null,
                          })
                        }
                      >
                        <option value="">Ćwiczenie główne</option>
                        {(ex.alternatives ?? []).map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name || "Zamiennik"}
                            {a.reason ? ` — ${a.reason}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
                      placeholder="Faktyczne obciążenie (kg)"
                      type="number"
                      step="0.5"
                      value={entry.actual_load_kg ?? ""}
                      onChange={(e) =>
                        patchEntry(ex.id, {
                          actual_load_kg: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                    <input
                      className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
                      placeholder="Notatka"
                      value={entry.athlete_note ?? ""}
                      onChange={(e) =>
                        patchEntry(ex.id, {
                          athlete_note: e.target.value || null,
                        })
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <textarea
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
            rows={2}
            placeholder="Komentarz do trenera (feedback)"
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setSaved(false);
            }}
          />

          {coachReply ? (
            <div className="border border-brand/30 bg-brand/[0.08] p-3 text-sm">
              <p className="font-display text-[10px] tracking-wider text-brand uppercase">
                Odpowiedź trenera
                {coachRepliedAt
                  ? ` · ${new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(coachRepliedAt))}`
                  : ""}
              </p>
              <p className="mt-1 text-paper/80">{coachReply}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void save()}
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            {saved ? "Zapisano" : "Zapisz postęp"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function planAssignmentBadge(p: TrainingPlan) {
  const n = p.assigned_user_ids?.length ?? 0;
  const g = p.assigned_group_ids?.length ?? 0;
  if (n === 1 && g === 0) {
    return (
      <span className="ml-1 text-[10px] text-brand uppercase">osobisty</span>
    );
  }
  return null;
}
