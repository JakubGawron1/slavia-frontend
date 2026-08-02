"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  PlanProgressEntry,
  TrainingPlan,
  TrainingPlanProgress,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";

export default function AthletePlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, PlanProgressEntry>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await klubFetch<TrainingPlan[]>("/api/plans");
      setPlans(list);
      if (list[0] && !activeId) setActiveId(list[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd planów");
    }
  }, [activeId]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    void (async () => {
      try {
        const p = await klubFetch<TrainingPlanProgress>(
          `/api/plans/${activeId}/progress`,
        );
        const map: Record<string, PlanProgressEntry> = {};
        for (const e of p.entries) map[e.exercise_id] = e;
        setProgress(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd postępu");
      }
    })();
  }, [activeId]);

  const plan = plans.find((p) => p.id === activeId);

  function toggle(exId: string) {
    setProgress((prev) => {
      const cur = prev[exId] ?? {
        exercise_id: exId,
        completed: false,
        athlete_note: null,
        actual_load_kg: null,
      };
      return {
        ...prev,
        [exId]: { ...cur, completed: !cur.completed },
      };
    });
    setSaved(false);
  }

  function setNote(exId: string, note: string) {
    setProgress((prev) => {
      const cur = prev[exId] ?? {
        exercise_id: exId,
        completed: false,
        athlete_note: null,
        actual_load_kg: null,
      };
      return { ...prev, [exId]: { ...cur, athlete_note: note || null } };
    });
    setSaved(false);
  }

  function setLoad(exId: string, load: string) {
    setProgress((prev) => {
      const cur = prev[exId] ?? {
        exercise_id: exId,
        completed: false,
        athlete_note: null,
        actual_load_kg: null,
      };
      return {
        ...prev,
        [exId]: {
          ...cur,
          actual_load_kg: load ? Number(load) : null,
        },
      };
    });
    setSaved(false);
  }

  async function save() {
    if (!activeId) return;
    setError(null);
    try {
      await klubFetch(`/api/plans/${activeId}/progress`, {
        method: "PUT",
        body: { entries: Object.values(progress) },
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Zapis nieudany");
    }
  }

  return (
    <div className="animate-rise max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold uppercase">
          Plany treningowe
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Podgląd planu i oznaczanie wykonanych ćwiczeń.
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
                ? "border border-brand bg-brand/20 px-3 py-1.5 text-sm"
                : "border border-paper/20 px-3 py-1.5 text-sm text-paper/60"
            }
          >
            {p.title}
          </button>
        ))}
        {plans.length === 0 ? (
          <p className="text-paper/45">Brak przypisanych planów.</p>
        ) : null}
      </div>

      {plan ? (
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-xl uppercase">{plan.title}</h2>
            {plan.week_label ? (
              <p className="text-sm text-paper/50">{plan.week_label}</p>
            ) : null}
            {plan.description ? (
              <p className="mt-2 text-sm text-paper/65">{plan.description}</p>
            ) : null}
          </div>

          <ul className="space-y-3">
            {plan.exercises.map((ex) => {
              const entry = progress[ex.id];
              return (
                <li
                  key={ex.id}
                  className="border border-paper/10 bg-paper/[0.03] p-4"
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(entry?.completed)}
                      onChange={() => toggle(ex.id)}
                    />
                    <span>
                      <span className="font-medium">{ex.name}</span>
                      <span className="mt-1 block text-sm text-paper/55">
                        {ex.sets != null ? `${ex.sets} serii` : null}
                        {ex.reps ? ` · ${ex.reps}` : null}
                        {ex.load_kg != null ? ` · ${ex.load_kg} kg` : null}
                      </span>
                    </span>
                  </label>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                      placeholder="Faktyczne obciążenie (kg)"
                      type="number"
                      step="0.5"
                      value={entry?.actual_load_kg ?? ""}
                      onChange={(e) => setLoad(ex.id, e.target.value)}
                    />
                    <input
                      className="border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
                      placeholder="Notatka"
                      value={entry?.athlete_note ?? ""}
                      onChange={(e) => setNote(ex.id, e.target.value)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

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
