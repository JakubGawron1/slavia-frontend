"use client";

import { useEffect, useState } from "react";
import {
  listLibraryTags,
  setLibraryTags,
} from "@/lib/api/generated/exercise-library/exercise-library";
import { useToast } from "@/components/toast/ToastProvider";
import {
  btnPrimary,
  chipActive,
  chipIdle,
  inputClass,
  linkDanger,
  panelClass,
  sectionLabel,
} from "@/components/plans/styles";

export function ExerciseTagsManager({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function persist(next: string[]) {
    setBusy(true);
    try {
      const res = await setLibraryTags({ tags: next });
      if (res.status !== 200) {
        throw new Error("Nie udało się zapisać tagów");
      }
      onChange(res.data.tags);
      return true;
    } catch (err) {
      toast.error("Tagi", err instanceof Error ? err.message : "Błąd zapisu");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function addTag() {
    const t = draft.trim();
    if (!t || busy) return;
    const exists = tags.some((x) => x.toLowerCase() === t.toLowerCase());
    if (exists) {
      toast.error("Tagi", "Ten tag już jest na liście");
      return;
    }
    const ok = await persist([...tags, t]);
    if (ok) {
      setDraft("");
      toast.success("Dodano tag", t);
    }
  }

  async function removeTag(tag: string) {
    if (busy) return;
    const ok = await persist(tags.filter((x) => x !== tag));
    if (ok) toast.success("Usunięto tag", tag);
  }

  return (
    <div className={panelClass}>
      <p className={sectionLabel}>Lista tagów klubu</p>
      <p className="text-sm text-paper/55">
        Zarządzaj tagami, a potem zaznaczaj je przy ćwiczeniach w bibliotece.
      </p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[180px] flex-1 space-y-1.5">
          <span className="block text-[10px] tracking-wider text-paper/40 uppercase">
            Nowy tag
          </span>
          <input
            className={inputClass}
            placeholder="Np. warmup, squat…"
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addTag();
              }
            }}
          />
        </label>
        <button
          type="button"
          className={btnPrimary}
          disabled={busy || !draft.trim()}
          onClick={() => void addTag()}
        >
          Dodaj tag
        </button>
      </div>
      {tags.length === 0 ? (
        <p className="text-sm text-paper/45">Brak tagów — dodaj pierwszy powyżej.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className={`${chipIdle} inline-flex items-center gap-2`}>
              <span>{tag}</span>
              <button
                type="button"
                className={linkDanger}
                disabled={busy}
                title={`Usuń „${tag}”`}
                onClick={() => void removeTag(tag)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Chipy do zaznaczania tagów na ćwiczeniu (z listy klubowej + ewentualne orphany). */
export function ExerciseTagPicker({
  catalog,
  selected,
  onChange,
}: {
  catalog: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const selectedSet = new Set(selected.map((t) => t.toLowerCase()));
  const orphans = selected.filter(
    (t) => !catalog.some((c) => c.toLowerCase() === t.toLowerCase()),
  );
  const options = [...catalog, ...orphans];

  function toggle(tag: string) {
    const key = tag.toLowerCase();
    if (selectedSet.has(key)) {
      onChange(selected.filter((t) => t.toLowerCase() !== key));
    } else {
      onChange([...selected, tag]);
    }
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-paper/45">
        Brak tagów w katalogu — dodaj je w sekcji powyżej.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const active = selectedSet.has(tag.toLowerCase());
        return (
          <button
            key={tag}
            type="button"
            className={active ? chipActive : chipIdle}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export function useExerciseTagCatalog() {
  const [tags, setTags] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await listLibraryTags();
        if (cancelled) return;
        if (res.status === 200) {
          setTags(res.data.tags);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(
            "Tagi",
            err instanceof Error ? err.message : "Nie udało się wczytać tagów",
          );
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tags, setTags, loaded };
}
