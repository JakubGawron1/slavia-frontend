import type { CmsPage } from "@/lib/api/generated/models";
import { EmptyState } from "@/components/ui/EmptyState";

export function CmsPageList({
  pages,
  onEdit,
  onRemove,
  onCreate,
}: {
  pages: CmsPage[];
  onEdit: (page: CmsPage) => void;
  onRemove: (id: string, title: string) => void;
  onCreate: () => void;
}) {
  if (pages.length === 0) {
    return (
      <EmptyState
        title="Brak stron CMS"
        description="Dodaj pierwszą stronę, żeby edytować treść bez zmian w kodzie."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            Nowa strona
          </button>
        }
      />
    );
  }

  return (
    <ul className="divide-y divide-paper/10 border border-paper/10">
      {pages.map((page) => (
        <li
          key={page.id}
          className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
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
              onClick={() => onEdit(page)}
            >
              Edytuj
            </button>
            <button
              type="button"
              className="text-xs text-brand underline-offset-2 hover:underline"
              onClick={() => onRemove(page.id, page.title)}
            >
              Usuń
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
