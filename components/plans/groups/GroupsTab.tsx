"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AthleteGroup, AthleteProfile } from "@/lib/api/generated/models";
import {
  createGroup,
  deleteGroup,
  getListGroupsQueryKey,
  updateGroup,
  useListGroups,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { PLAN_BTN, PLAN_FIELD } from "@/lib/plans/labels";

export function GroupsTab() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const groupsQuery = useListGroups();
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const groups = (groupsQuery.data?.data as AthleteGroup[] | undefined) ?? [];
  const profiles =
    (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];
  const [name, setName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AthleteGroup | null>(null);

  const athletes = profiles.filter((p) => p.user_id && p.user_id !== "manual");

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Grupy", "Podaj nazwę grupy.");
      return;
    }
    try {
      const body = { name: name.trim(), member_user_ids: members };
      if (editingId) {
        await updateGroup(editingId, body);
        toast.success("Zapisano grupę", name);
      } else {
        await createGroup(body);
        toast.success("Dodano grupę", name);
      }
      setName("");
      setMembers([]);
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });
    } catch (err) {
      toast.error("Grupy", err instanceof Error ? err.message : "Zapis nieudany");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteGroup(deleteTarget.id);
      toast.success("Usunięto grupę", deleteTarget.name);
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });
    } catch (err) {
      toast.error(
        "Usuwanie",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form onSubmit={save} className="space-y-3 border border-paper/10 p-4">
        <h2 className="font-display text-sm uppercase">
          {editingId ? "Edycja grupy" : "Nowa grupa"}
        </h2>
        <label className="block text-sm text-paper/70">
          Nazwa
          <input
            className={PLAN_FIELD}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <fieldset className="max-h-56 space-y-1 overflow-y-auto border border-paper/15 p-2">
          <legend className="text-sm text-paper/70">Członkowie</legend>
          {athletes.map((p) => {
            const uid = p.user_id as string;
            const checked = members.includes(uid);
            return (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setMembers(
                      checked
                        ? members.filter((x) => x !== uid)
                        : [...members, uid],
                    )
                  }
                />
                {p.display_name}
              </label>
            );
          })}
        </fieldset>
        <button type="submit" className={PLAN_BTN}>
          {editingId ? "Zapisz" : "Dodaj"}
        </button>
      </form>
      <div>
        {groupsQuery.isPending ? (
          <InlineStatus kind="loading">Ładowanie grup…</InlineStatus>
        ) : groups.length === 0 ? (
          <EmptyState
            title="Brak grup"
            description="Grupa to lista zawodników — puste przypisanie planu nie oznacza wszystkich."
          />
        ) : (
          <ul className="space-y-2">
            {groups.map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-paper/10 px-3 py-2"
              >
                <div>
                  <p className="text-sm">{g.name}</p>
                  <p className="text-xs text-paper/45">
                    {(g.member_user_ids ?? []).length} osób
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    className="text-brand"
                    onClick={() => {
                      setEditingId(g.id);
                      setName(g.name);
                      setMembers(g.member_user_ids ?? []);
                    }}
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="text-paper/45"
                    onClick={() => setDeleteTarget(g)}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Usunąć grupę?"
        message={deleteTarget?.name ?? ""}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
