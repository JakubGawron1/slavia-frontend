"use client";

import type { AthleteGroup, PublicUser, TrainingPlan } from "@/lib/api/generated/models";
import type { AssignMode } from "@/lib/plans/helpers";
import { chipActive, chipIdle, inputClass, sectionLabel } from "@/components/plans/styles";

export function PlanAssignmentPanel({
  editing,
  assignMode,
  setAssignMode,
  users,
  groups,
  setEditingTracked,
  toggleUser,
  toggleGroup,
}: {
  editing: TrainingPlan;
  assignMode: AssignMode;
  setAssignMode: (m: AssignMode) => void;
  users: PublicUser[];
  groups: AthleteGroup[];
  setEditingTracked: (next: TrainingPlan) => void;
  toggleUser: (uid: string) => void;
  toggleGroup: (gid: string) => void;
}) {
  return (
    <section className="space-y-3 border-t border-paper/10 pt-4">
      <p className={sectionLabel}>Przypisanie</p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "Wszyscy"],
            ["personal", "Jeden zawodnik"],
            ["group", "Grupa / wielu"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            className={assignMode === mode ? chipActive : chipIdle}
            onClick={() => {
              setAssignMode(mode);
              if (mode === "all") {
                setEditingTracked({
                  ...editing,
                  assigned_user_ids: [],
                  assigned_group_ids: [],
                });
              } else if (mode === "personal") {
                const one = editing.assigned_user_ids?.[0] ?? "";
                setEditingTracked({
                  ...editing,
                  assigned_user_ids: one ? [one] : [],
                  assigned_group_ids: [],
                });
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {assignMode === "personal" ? (
        <label className="block max-w-md text-sm">
          <span className="mb-1.5 block text-paper/55">Zawodnik</span>
          <select
            className={inputClass}
            value={editing.assigned_user_ids?.[0] ?? ""}
            onChange={(e) =>
              setEditingTracked({
                ...editing,
                assigned_user_ids: e.target.value ? [e.target.value] : [],
                assigned_group_ids: [],
              })
            }
            required
          >
            <option value="">— wybierz —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.display_name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {assignMode === "group" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className={`${sectionLabel} mb-2`}>Grupy</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {groups.map((g) => (
                <label key={g.id} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.assigned_group_ids?.includes(g.id) ?? false}
                    onChange={() => toggleGroup(g.id)}
                  />
                  {g.name}
                </label>
              ))}
              {groups.length === 0 ? (
                <span className="text-xs text-paper/40">
                  Brak grup — dodaj w zakładce Grupy.
                </span>
              ) : null}
            </div>
          </div>
          <div>
            <p className={`${sectionLabel} mb-2`}>Dodatkowi zawodnicy</p>
            <div className="flex max-h-40 flex-wrap gap-x-4 gap-y-2 overflow-y-auto">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.assigned_user_ids?.includes(u.id) ?? false}
                    onChange={() => toggleUser(u.id)}
                  />
                  {u.display_name}
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {assignMode === "all" ? (
        <p className="text-sm text-paper/45">
          Plan widoczny dla wszystkich aktywnych zawodników.
        </p>
      ) : null}
    </section>
  );
}
