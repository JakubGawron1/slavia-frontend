"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  ExerciseFamily,
  LibraryExercise,
  LibraryExerciseBody,
} from "@/lib/api/generated/models";
import {
  createLibraryItem,
  deleteLibraryItem,
  getListLibraryQueryKey,
  updateLibraryItem,
  useListLibrary,
} from "@/lib/api/generated/default/default";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { FAMILY_LABEL, PLAN_BTN, PLAN_FIELD } from "@/lib/plans/labels";

const FAMILIES: ExerciseFamily[] = [
  "olympic",
  "squat",
  "pull",
  "accessory",
  "warmup",
];

const emptyBody = (): LibraryExerciseBody => ({
  name: "",
  family: "olympic",
  notes: null,
  tags: [],
  default_pct_of: "snatch",
});

export function LibraryTab() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const query = useListLibrary();
  const items = (query.data?.data as LibraryExercise[] | undefined) ?? [];
  const [form, setForm] = useState<LibraryExerciseBody>(emptyBody());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibraryExercise | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Biblioteka", "Podaj nazwę ćwiczenia.");
      return;
    }
    try {
      if (editingId) {
        await updateLibraryItem(editingId, form);
        toast.success("Zapisano ćwiczenie", form.name);
      } else {
        await createLibraryItem(form);
        toast.success("Dodano ćwiczenie", form.name);
      }
      setForm(emptyBody());
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: getListLibraryQueryKey() });
    } catch (err) {
      toast.error(
        "Biblioteka",
        err instanceof Error ? err.message : "Zapis nieudany",
      );
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteLibraryItem(deleteTarget.id);
      toast.success("Usunięto", deleteTarget.name);
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: getListLibraryQueryKey() });
    } catch (err) {
      toast.error(
        "Usuwanie",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <form onSubmit={save} className="space-y-3 border border-paper/10 p-4">
        <h2 className="font-display text-sm uppercase">
          {editingId ? "Edycja" : "Nowe ćwiczenie"}
        </h2>
        <label className="block text-sm text-paper/70">
          Nazwa
          <input
            className={PLAN_FIELD}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block text-sm text-paper/70">
          Rodzina
          <select
            className={PLAN_FIELD}
            value={form.family ?? "olympic"}
            onChange={(e) =>
              setForm({ ...form, family: e.target.value as ExerciseFamily })
            }
          >
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {FAMILY_LABEL[f]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-paper/70">
          Notatka
          <textarea
            className={PLAN_FIELD}
            rows={2}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
          />
        </label>
        <button type="submit" className={PLAN_BTN}>
          {editingId ? "Zapisz" : "Dodaj"}
        </button>
        {editingId ? (
          <button
            type="button"
            className="ml-2 text-sm text-paper/50"
            onClick={() => {
              setEditingId(null);
              setForm(emptyBody());
            }}
          >
            Anuluj
          </button>
        ) : null}
      </form>
      <div>
        {query.isPending ? (
          <InlineStatus kind="loading">Ładowanie biblioteki…</InlineStatus>
        ) : items.length === 0 ? (
          <EmptyState
            title="Pusta biblioteka"
            description="Dodaj ruchy olimpijskie i akcesoria — seed backendu powinien już tu być."
          />
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-paper/10 px-3 py-2"
              >
                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-paper/45">
                    {FAMILY_LABEL[item.family ?? "olympic"]}
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    className="text-brand"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        name: item.name,
                        family: item.family,
                        notes: item.notes,
                        tags: item.tags,
                        default_pct_of: item.default_pct_of,
                      });
                    }}
                  >
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="text-paper/45"
                    onClick={() => setDeleteTarget(item)}
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
        title="Usunąć ćwiczenie?"
        message={deleteTarget?.name ?? ""}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
