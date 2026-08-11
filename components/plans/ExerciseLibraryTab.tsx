"use client";

import { useEffect, useState } from "react";
import type { ExerciseLibraryItem } from "@/lib/api/generated/models";
import {
  createLibraryItem,
  updateLibraryItem,
} from "@/lib/api/generated/exercise-library/exercise-library";
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

export function ExerciseLibraryTab({
  library,
  onReload,
  onRequestDelete,
}: {
  library: ExerciseLibraryItem[];
  onReload: () => Promise<void>;
  onRequestDelete: (id: string) => void;
}) {
  const toast = useToast();
  const [libName, setLibName] = useState("");
  const [libEdit, setLibEdit] = useState<ExerciseLibraryItem | null>(null);

  // Zamknij formularz edycji, jeśli edytowany element zniknął z listy (np. po usunięciu).
  useEffect(() => {
    if (libEdit && !library.some((item) => item.id === libEdit.id)) {
      setLibEdit(null);
    }
  }, [library, libEdit]);

  async function addItem() {
    if (!libName.trim()) return;
    await createLibraryItem({ name: libName.trim() });
    setLibName("");
    toast.success("Dodano do biblioteki");
    await onReload();
  }

  async function saveEdit() {
    if (!libEdit) return;
    await updateLibraryItem(libEdit.id, {
      name: libEdit.name,
      tags: libEdit.tags ?? [],
      default_sets: libEdit.default_sets ?? null,
      default_reps: libEdit.default_reps ?? null,
      notes: libEdit.notes ?? null,
      video_url: libEdit.video_url ?? null,
    });
    setLibEdit(null);
    toast.success("Zapisano ćwiczenie");
    await onReload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 border border-paper/10 bg-paper/[0.03] p-4">
        <label className="min-w-[200px] flex-1 space-y-1.5">
          <span className={sectionLabel}>Nowe ćwiczenie</span>
          <input
            className={inputClass}
            placeholder="Np. Martwy ciąg"
            value={libName}
            onChange={(e) => setLibName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addItem();
              }
            }}
          />
        </label>
        <button type="button" className={btnPrimary} onClick={() => void addItem()}>
          Dodaj
        </button>
      </div>

      {libEdit ? (
        <div className={panelClass}>
          <p className={sectionLabel}>Edycja ćwiczenia</p>
          <input
            className={inputClass}
            value={libEdit.name}
            onChange={(e) => setLibEdit({ ...libEdit, name: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                Serie domyślne
              </span>
              <input
                className={inputClass}
                type="number"
                value={libEdit.default_sets ?? ""}
                onChange={(e) =>
                  setLibEdit({
                    ...libEdit,
                    default_sets: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </label>
            <label className="space-y-1.5">
              <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
                Powtórzenia
              </span>
              <input
                className={inputClass}
                value={libEdit.default_reps ?? ""}
                onChange={(e) =>
                  setLibEdit({ ...libEdit, default_reps: e.target.value || null })
                }
              />
            </label>
          </div>
          <input
            className={inputClass}
            placeholder="Tagi (po przecinku)"
            value={(libEdit.tags ?? []).join(", ")}
            onChange={(e) =>
              setLibEdit({
                ...libEdit,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          />
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Notatki"
            value={libEdit.notes ?? ""}
            onChange={(e) => setLibEdit({ ...libEdit, notes: e.target.value || null })}
          />
          <input
            className={inputClass}
            placeholder="URL wideo (opcjonalnie)"
            value={libEdit.video_url ?? ""}
            onChange={(e) => setLibEdit({ ...libEdit, video_url: e.target.value || null })}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={() => void saveEdit()}>
              Zapisz
            </button>
            <button type="button" className={btnSecondary} onClick={() => setLibEdit(null)}>
              Anuluj
            </button>
            <button
              type="button"
              className={linkDanger}
              onClick={() => onRequestDelete(libEdit.id)}
            >
              Usuń
            </button>
          </div>
        </div>
      ) : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {library.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-paper/50">
                {[
                  item.tags?.length ? item.tags.join(", ") : null,
                  item.default_sets != null
                    ? `${item.default_sets}×${item.default_reps ?? "?"}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Bez domyślnych wartości"}
              </p>
            </div>
            <button type="button" className={linkBtn} onClick={() => setLibEdit(item)}>
              Edytuj
            </button>
          </li>
        ))}
        {library.length === 0 ? (
          <li className="px-4 py-8 text-center text-paper/45">
            Biblioteka pusta — dodaj pierwsze ćwiczenie powyżej.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
