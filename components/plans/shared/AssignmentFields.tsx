"use client";

import type {
  AthleteGroup,
  AthleteProfile,
  AssignmentKind,
  PlanAssignment,
} from "@/lib/api/generated/models";
import { PLAN_FIELD } from "@/lib/plans/labels";

const KINDS: { id: AssignmentKind; label: string }[] = [
  { id: "none", label: "Bez przypisania" },
  { id: "all", label: "Wszyscy zawodnicy" },
  { id: "users", label: "Wybrani zawodnicy" },
  { id: "groups", label: "Grupy" },
];

export function AssignmentFields({
  value,
  onChange,
  profiles,
  groups,
}: {
  value: PlanAssignment;
  onChange: (next: PlanAssignment) => void;
  profiles: AthleteProfile[];
  groups: AthleteGroup[];
}) {
  const kind = value.kind ?? "none";
  const userIds = value.user_ids ?? [];
  const groupIds = value.group_ids ?? [];

  return (
    <div className="space-y-3">
      <label className="block text-sm text-paper/70">
        Przypisanie
        <select
          className={PLAN_FIELD}
          value={kind}
          onChange={(e) =>
            onChange({
              ...value,
              kind: e.target.value as AssignmentKind,
            })
          }
        >
          {KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-paper/45">
        Puste przypisanie nie oznacza wszystkich — wybierz „Wszyscy”, jeśli plan
        ma iść do całego klubu.
      </p>
      {kind === "users" ? (
        <fieldset className="max-h-48 space-y-1 overflow-y-auto border border-paper/15 p-2">
          <legend className="text-sm text-paper/70">Zawodnicy</legend>
          {profiles.map((p) => {
            const uid = p.user_id;
            if (!uid || uid === "manual") return null;
            const checked = userIds.includes(uid);
            return (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      ...value,
                      user_ids: checked
                        ? userIds.filter((x) => x !== uid)
                        : [...userIds, uid],
                    })
                  }
                />
                {p.display_name}
              </label>
            );
          })}
        </fieldset>
      ) : null}
      {kind === "groups" ? (
        <fieldset className="max-h-48 space-y-1 overflow-y-auto border border-paper/15 p-2">
          <legend className="text-sm text-paper/70">Grupy</legend>
          {groups.map((g) => {
            const checked = groupIds.includes(g.id);
            return (
              <label key={g.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange({
                      ...value,
                      group_ids: checked
                        ? groupIds.filter((x) => x !== g.id)
                        : [...groupIds, g.id],
                    })
                  }
                />
                {g.name}
              </label>
            );
          })}
        </fieldset>
      ) : null}
    </div>
  );
}
