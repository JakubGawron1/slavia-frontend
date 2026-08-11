"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AthleteGroup, PublicUser } from "@/lib/api/generated/models";
import { createGroup, updateGroup } from "@/lib/api/generated/groups/groups";
import { useToast } from "@/components/toast/ToastProvider";
import {
  btnPrimary,
  btnSecondary,
  inputClass,
  linkBtn,
  linkDanger,
  panelClass,
  sectionLabel,
} from "@/components/plans/styles";

export function AthleteGroupsTab({
  groups,
  users,
  groupForm,
  setGroupForm,
  onReload,
  onRequestDelete,
}: {
  groups: AthleteGroup[];
  users: PublicUser[];
  groupForm: AthleteGroup | null;
  setGroupForm: Dispatch<SetStateAction<AthleteGroup | null>>;
  onReload: () => Promise<void>;
  onRequestDelete: (id: string, name: string) => void;
}) {
  const toast = useToast();

  async function saveGroup() {
    if (!groupForm) return;
    if (groupForm.id) {
      await updateGroup(groupForm.id, {
        name: groupForm.name,
        member_user_ids: groupForm.member_user_ids ?? [],
      });
    } else {
      await createGroup({
        name: groupForm.name,
        member_user_ids: groupForm.member_user_ids ?? [],
      });
    }
    setGroupForm(null);
    toast.success("Zapisano grupę");
    await onReload();
  }

  return (
    <div className="space-y-6">
      {groupForm ? (
        <div className={panelClass}>
          <p className={sectionLabel}>{groupForm.id ? "Edycja grupy" : "Nowa grupa"}</p>
          <label className="space-y-1.5">
            <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
              Nazwa grupy
            </span>
            <input
              className={inputClass}
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
            />
          </label>
          <div>
            <p className={`${sectionLabel} mb-2`}>Członkowie</p>
            <div className="flex max-h-48 flex-wrap gap-x-4 gap-y-2 overflow-y-auto">
              {users.map((u) => {
                const members = groupForm.member_user_ids ?? [];
                return (
                  <label key={u.id} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={members.includes(u.id)}
                      onChange={() => {
                        const has = members.includes(u.id);
                        setGroupForm({
                          ...groupForm,
                          member_user_ids: has
                            ? members.filter((id) => id !== u.id)
                            : [...members, u.id],
                        });
                      }}
                    />
                    {u.display_name}
                  </label>
                );
              })}
              {users.length === 0 ? (
                <span className="text-xs text-paper/40">Brak zawodników na liście kont.</span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={() => void saveGroup()}>
              Zapisz
            </button>
            <button type="button" className={btnSecondary} onClick={() => setGroupForm(null)}>
              Anuluj
            </button>
          </div>
        </div>
      ) : null}
      <ul className="divide-y divide-paper/10 border border-paper/10">
        {groups.map((g) => (
          <li
            key={g.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium">{g.name}</p>
              <p className="text-xs text-paper/50">
                {(g.member_user_ids ?? []).length} członków
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" className={linkBtn} onClick={() => setGroupForm(g)}>
                Edytuj
              </button>
              <button
                type="button"
                className={linkDanger}
                onClick={() => onRequestDelete(g.id, g.name)}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
        {groups.length === 0 && !groupForm ? (
          <li className="px-4 py-8 text-center text-paper/45">
            Brak grup — utwórz pierwszą przyciskiem „Nowa grupa”.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
