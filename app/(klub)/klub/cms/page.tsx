"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type {
  CmsBlock,
  CmsPage,
  CmsStatus,
} from "@/lib/api/generated/models";
import {
  createCmsPage,
  deleteCmsPage,
  listCmsPages,
  updateCmsPage,
} from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

function newBlock(type = "paragraph"): CmsBlock {
  return {
    id: crypto.randomUUID(),
    type,
    content: "",
  };
}

export default function CmsAdminPage() {
  const toast = useToast();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPages((await listCmsPages()).data as CmsPage[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd CMS");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    setEditing({
      id: "",
      slug: "",
      title: "",
      status: "draft",
      blocks: [newBlock("heading"), newBlock("paragraph")],
      created_at: "",
      updated_at: "",
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      const body = {
        slug: editing.slug,
        title: editing.title,
        status: editing.status,
        blocks: editing.blocks,
      };
      if (editing.id) {
        await updateCmsPage(editing.id, body);
        toast.success("Zapisano stronę", editing.title);
      } else {
        await createCmsPage(body);
        toast.success("Dodano stronę", editing.title);
      }
      setEditing(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("CMS", msg);
    }
  }

  function remove(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  async function confirmRemove() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCmsPage(deleteTarget.id);
      toast.success("Usunięto stronę");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Usuwanie nieudane";
      setError(msg);
      toast.error("CMS", msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Treść
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
            CMS
          </h1>
          <p className="mt-2 text-sm text-paper/55">
            Edytuj zawartość stron bez ingerencji w kod — strony, bloki, publikacja.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
        >
          Nowa strona
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
          className="space-y-4 border border-paper/10 bg-paper/[0.03] p-4 md:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="Tytuł"
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              required
            />
            <input
              className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="slug (np. o-klubie)"
              value={editing.slug}
              onChange={(e) =>
                setEditing({ ...editing, slug: e.target.value })
              }
              required
            />
            <select
              className="border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
              value={editing.status}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  status: e.target.value as CmsStatus,
                })
              }
            >
              <option value="draft">Szkic</option>
              <option value="published">Opublikowana</option>
            </select>
          </div>

          <div className="space-y-3">
            <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
              Bloki treści
            </p>
            {editing.blocks.map((block, index) => (
              <div
                key={block.id}
                className="border border-paper/10 bg-chrome/30 p-3"
              >
                <div className="mb-2 flex flex-wrap gap-2">
                  <select
                    className="border border-paper/20 bg-chrome/40 px-2 py-1 text-xs"
                    value={block.type}
                    onChange={(e) => {
                      const blocks = [...editing.blocks];
                      blocks[index] = { ...block, type: e.target.value };
                      setEditing({ ...editing, blocks });
                    }}
                  >
                    <option value="heading">Nagłówek</option>
                    <option value="paragraph">Akapit</option>
                    <option value="image">Obraz (URL)</option>
                    <option value="html">HTML</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-brand"
                    onClick={() => {
                      const blocks = editing.blocks.filter((_, i) => i !== index);
                      setEditing({ ...editing, blocks });
                    }}
                  >
                    Usuń blok
                  </button>
                </div>
                <textarea
                  className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand"
                  rows={block.type === "paragraph" || block.type === "html" ? 4 : 2}
                  value={block.content}
                  onChange={(e) => {
                    const blocks = [...editing.blocks];
                    blocks[index] = { ...block, content: e.target.value };
                    setEditing({ ...editing, blocks });
                  }}
                  placeholder={
                    block.type === "image"
                      ? "https://…"
                      : "Treść bloku…"
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
              onClick={() =>
                setEditing({
                  ...editing,
                  blocks: [...editing.blocks, newBlock()],
                })
              }
            >
              + Blok
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Zapisz
            </button>
            <button
              type="button"
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
              onClick={() => setEditing(null)}
            >
              Anuluj
            </button>
          </div>

          {editing.blocks.length > 0 ? (
            <aside className="border-t border-paper/10 pt-4">
              <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
                Podgląd
              </p>
              <div className="mt-3 space-y-3 bg-surface px-5 py-6 text-ink">
                {editing.blocks.map((b) => {
                  if (b.type === "heading") {
                    return (
                      <h3 key={b.id} className="font-display text-2xl uppercase">
                        {b.content || "…"}
                      </h3>
                    );
                  }
                  if (b.type === "image") {
                    return b.content ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={b.id}
                        src={b.content}
                        alt=""
                        className="max-h-48 w-auto"
                      />
                    ) : (
                      <p key={b.id} className="text-sm text-steel-soft">
                        [brak URL obrazu]
                      </p>
                    );
                  }
                  if (b.type === "html") {
                    return (
                      <div
                        key={b.id}
                        className="prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: b.content }}
                      />
                    );
                  }
                  return (
                    <p key={b.id} className="text-sm leading-relaxed">
                      {b.content || "…"}
                    </p>
                  );
                })}
              </div>
            </aside>
          ) : null}
        </form>
      ) : null}

      {loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <ul className="divide-y divide-paper/10 border border-paper/10">
        {pages.map((page) => (
          <li
            key={page.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-xs text-paper/50">
                /{page.slug} · {page.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs underline-offset-2 hover:underline"
                onClick={() => setEditing(page)}
              >
                Edytuj
              </button>
              <button
                type="button"
                className="text-xs text-brand underline-offset-2 hover:underline"
                onClick={() => remove(page.id, page.title)}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
        {!loading && pages.length === 0 ? (
          <li className="px-4 py-6 text-paper/45">Brak stron CMS.</li>
        ) : null}
      </ul>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Usuń stronę CMS"
        message={`Na pewno usunąć stronę „${deleteTarget?.title ?? ""}”?`}
        busy={deleting}
        onConfirm={() => void confirmRemove()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
