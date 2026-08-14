import type { FormEvent } from "react";
import type { CmsBlock, CmsPage, CmsStatus } from "@/lib/api/generated/models";

function newBlock(type = "paragraph"): CmsBlock {
  return {
    id: crypto.randomUUID(),
    type,
    content: "",
  };
}

const fieldClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

export function CmsForm({
  editing,
  onChange,
  onSubmit,
  onCancel,
}: {
  editing: CmsPage;
  onChange: (next: CmsPage) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-paper/10 bg-paper/[0.03] p-4 md:p-6"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Tytuł
          </span>
          <input
            className={fieldClass}
            value={editing.title}
            onChange={(e) => onChange({ ...editing, title: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Slug
          </span>
          <input
            className={fieldClass}
            placeholder="np. o-klubie"
            value={editing.slug}
            onChange={(e) => onChange({ ...editing, slug: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2 md:col-span-1">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Status
          </span>
          <select
            className={fieldClass}
            value={editing.status}
            onChange={(e) =>
              onChange({ ...editing, status: e.target.value as CmsStatus })
            }
          >
            <option value="draft">Szkic</option>
            <option value="published">Opublikowana</option>
          </select>
        </label>
      </div>

      <div className="space-y-3">
        <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
          Bloki treści
        </p>
        {editing.blocks.map((block, index) => (
          <div key={block.id} className="border border-paper/10 bg-chrome/30 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              <label className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-[10px] tracking-[0.12em] text-paper/45 uppercase">
                  Typ bloku
                </span>
                <select
                  className="border border-paper/20 bg-chrome/40 px-2 py-1 text-xs"
                  value={block.type}
                  onChange={(e) => {
                    const blocks = [...editing.blocks];
                    blocks[index] = { ...block, type: e.target.value };
                    onChange({ ...editing, blocks });
                  }}
                >
                  <option value="heading">Nagłówek</option>
                  <option value="paragraph">Akapit</option>
                  <option value="image">Obraz (URL)</option>
                  <option value="html">HTML</option>
                </select>
              </label>
              <button
                type="button"
                className="self-end text-xs text-brand"
                onClick={() => {
                  onChange({
                    ...editing,
                    blocks: editing.blocks.filter((_, i) => i !== index),
                  });
                }}
              >
                Usuń blok
              </button>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] tracking-[0.12em] text-paper/45 uppercase">
                {block.type === "image" ? "URL obrazu" : "Treść bloku"}
              </span>
              <textarea
                className={`w-full ${fieldClass}`}
                rows={block.type === "paragraph" || block.type === "html" ? 4 : 2}
                value={block.content}
                onChange={(e) => {
                  const blocks = [...editing.blocks];
                  blocks[index] = { ...block, content: e.target.value };
                  onChange({ ...editing, blocks });
                }}
                placeholder={block.type === "image" ? "https://…" : undefined}
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
          onClick={() =>
            onChange({ ...editing, blocks: [...editing.blocks, newBlock()] })
          }
        >
          + Blok
        </button>
      </div>

      <div className="sticky bottom-0 z-[5] -mx-4 flex flex-wrap gap-2 border-t border-paper/10 bg-chrome/95 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
        <button
          type="submit"
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
        >
          Zapisz
        </button>
        <button
          type="button"
          className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          onClick={onCancel}
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
  );
}

export { newBlock };
