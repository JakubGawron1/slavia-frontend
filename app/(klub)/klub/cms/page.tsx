"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { CmsPage } from "@/lib/api/generated/models";
import {
  createCmsPage,
  deleteCmsPage,
  listCmsPages,
  updateCmsPage,
} from "@/lib/api/generated/default/default";
import { useToast } from "@/components/toast/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { CmsForm, newBlock } from "@/components/klub/cms/CmsForm";
import { CmsPageList } from "@/components/klub/cms/CmsPageList";

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
    <div className="animate-rise space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader
          eyebrow="Treść"
          title="CMS"
          description="Edytuj zawartość stron bez ingerencji w kod — strony, bloki, publikacja."
        />
        <button
          type="button"
          onClick={startNew}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
        >
          Nowa strona
        </button>
      </div>

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}

      {editing ? (
        <CmsForm
          editing={editing}
          onChange={setEditing}
          onSubmit={(e) => void save(e)}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {loading ? (
        <InlineStatus kind="loading">Ładowanie stron CMS…</InlineStatus>
      ) : (
        <CmsPageList
          pages={pages}
          onEdit={setEditing}
          onRemove={(id, title) => setDeleteTarget({ id, title })}
          onCreate={startNew}
        />
      )}

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
