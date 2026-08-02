"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type {
  PlanExercise,
  PublicUser,
  TrainingPlan,
} from "@/lib/api/generated/models";
import { klubFetch } from "@/lib/klub-api";

function emptyEx(): PlanExercise {
  return {
    id: crypto.randomUUID(),
    name: "",
    sets: 3,
    reps: "3",
    load_kg: null,
    notes: null,
  };
}

export default function StaffPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [editing, setEditing] = useState<TrainingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, u] = await Promise.all([
        klubFetch<TrainingPlan[]>("/api/plans"),
        klubFetch<PublicUser[]>("/api/users").catch(() => [] as PublicUser[]),
      ]);
      setPlans(p);
      setUsers(u.filter((x) => x.roles.includes("zawodnik")));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd planów");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    setEditing({
      id: "",
      title: "",
      description: "",
      week_label: "",
      exercises: [emptyEx()],
      assigned_user_ids: [],
      created_at: "",
      created_by: "",
      updated_at: "",
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    try {
      const body = {
        title: editing.title,
        description: editing.description || null,
        week_label: editing.week_label || null,
        exercises: editing.exercises,
        assigned_user_ids: editing.assigned_user_ids,
      };
      if (editing.id) {
        await klubFetch(`/api/plans/${editing.id}`, { method: "PATCH", body });
      } else {
        await klubFetch("/api/plans", { method: "POST", body });
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Zapis nieudany");
    }
  }

  async function remove(id: string) {
    if (!confirm("Usunąć plan?")) return;
    try {
      await klubFetch(`/api/plans/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Usuwanie nieudane");
    }
  }

  function toggleAssign(userId: string) {
    if (!editing) return;
    const has = editing.assigned_user_ids.includes(userId);
    setEditing({
      ...editing,
      assigned_user_ids: has
        ? editing.assigned_user_ids.filter((id) => id !== userId)
        : [...editing.assigned_user_ids, userId],
    });
  }

  return (
    <div className="animate-rise max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Trening
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
            Plany treningowe
          </h1>
          <p className="mt-2 text-sm text-paper/55">
            Tworzenie i edycja planów dla zawodników (puste przypisanie = wszyscy).
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
        >
          Nowy plan
        </button>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {editing ? (
        <form
          onSubmit={save}
          className="space-y-4 border border-paper/10 bg-paper/[0.03] p-4"
        >
          <input
            className="w-full border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Tytuł"
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            required
          />
          <input
            className="w-full border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Etykieta tygodnia (opcjonalnie)"
            value={editing.week_label ?? ""}
            onChange={(e) =>
              setEditing({ ...editing, week_label: e.target.value })
            }
          />
          <textarea
            className="w-full border border-paper/20 bg-ink/40 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="Opis"
            rows={2}
            value={editing.description ?? ""}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
          />

          <div>
            <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
              Przypisani zawodnicy (puste = wszyscy)
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={editing.assigned_user_ids.includes(u.id)}
                    onChange={() => toggleAssign(u.id)}
                  />
                  {u.display_name}
                </label>
              ))}
              {users.length === 0 ? (
                <span className="text-xs text-paper/40">
                  Brak kont z rolą zawodnik — plan będzie widoczny dla wszystkich.
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
              Ćwiczenia
            </p>
            {editing.exercises.map((ex, i) => (
              <div key={ex.id} className="grid gap-2 border border-paper/10 p-3 sm:grid-cols-4">
                <input
                  className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm sm:col-span-2"
                  placeholder="Nazwa"
                  value={ex.name}
                  onChange={(e) => {
                    const exercises = [...editing.exercises];
                    exercises[i] = { ...ex, name: e.target.value };
                    setEditing({ ...editing, exercises });
                  }}
                  required
                />
                <input
                  className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm"
                  placeholder="Serie"
                  type="number"
                  value={ex.sets ?? ""}
                  onChange={(e) => {
                    const exercises = [...editing.exercises];
                    exercises[i] = {
                      ...ex,
                      sets: e.target.value ? Number(e.target.value) : null,
                    };
                    setEditing({ ...editing, exercises });
                  }}
                />
                <input
                  className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm"
                  placeholder="Powtórzenia"
                  value={ex.reps ?? ""}
                  onChange={(e) => {
                    const exercises = [...editing.exercises];
                    exercises[i] = { ...ex, reps: e.target.value || null };
                    setEditing({ ...editing, exercises });
                  }}
                />
                <input
                  className="border border-paper/20 bg-ink/40 px-2 py-1.5 text-sm"
                  placeholder="Kg"
                  type="number"
                  step="0.5"
                  value={ex.load_kg ?? ""}
                  onChange={(e) => {
                    const exercises = [...editing.exercises];
                    exercises[i] = {
                      ...ex,
                      load_kg: e.target.value ? Number(e.target.value) : null,
                    };
                    setEditing({ ...editing, exercises });
                  }}
                />
                <button
                  type="button"
                  className="text-left text-xs text-brand sm:col-span-4"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      exercises: editing.exercises.filter((_, j) => j !== i),
                    })
                  }
                >
                  Usuń ćwiczenie
                </button>
              </div>
            ))}
            <button
              type="button"
              className="border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
              onClick={() =>
                setEditing({
                  ...editing,
                  exercises: [...editing.exercises, emptyEx()],
                })
              }
            >
              + Ćwiczenie
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Zapisz
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Anuluj
            </button>
          </div>
        </form>
      ) : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {plans.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-paper/50">
                {p.exercises.length} ćw. ·{" "}
                {p.assigned_user_ids.length
                  ? `${p.assigned_user_ids.length} przypisanych`
                  : "wszyscy"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs underline-offset-2 hover:underline"
                onClick={() => setEditing(p)}
              >
                Edytuj
              </button>
              <button
                type="button"
                className="text-xs text-brand underline-offset-2 hover:underline"
                onClick={() => void remove(p.id)}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
        {plans.length === 0 ? (
          <li className="px-4 py-6 text-paper/45">Brak planów.</li>
        ) : null}
      </ul>
    </div>
  );
}
