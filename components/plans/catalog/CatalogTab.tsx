"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import type { TrainingPlan } from "@/lib/api/generated/models";
import {
  deletePlan,
  getListPlansQueryKey,
  useListPlans,
} from "@/lib/api/generated/default/default";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { PLAN_BTN, WEEKDAY_SHORT } from "@/lib/plans/labels";

export function CatalogTab({ onUse }: { onUse: (id: string) => Promise<void> }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const query = useListPlans({ status: "catalog" });
  const plans = (query.data?.data as TrainingPlan[] | undefined) ?? [];
  const [preview, setPreview] = useState<TrainingPlan | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<TrainingPlan | null>(null);

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deletePlan(deleteId.id);
      toast.success("Usunięto szablon", deleteId.title);
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
    } catch (err) {
      toast.error(
        "Usuwanie",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
    }
  }

  if (query.isPending) {
    return <InlineStatus kind="loading">Ładowanie katalogu…</InlineStatus>;
  }
  if (query.isError) {
    return <InlineStatus kind="error">Nie udało się wczytać katalogu.</InlineStatus>;
  }

  const week1 = preview?.weeks?.find((w) => w.index === 1);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link href="/klub/plany/nowy?katalog=1" className={PLAN_BTN}>
          Nowy szablon
        </Link>
      </div>
      {plans.length === 0 ? (
        <EmptyState
          title="Brak szablonów"
          description="Ułóż szablon kreatorem albo zapisz istniejący plan ze statusem Katalog."
          action={
            <Link href="/klub/plany/nowy?katalog=1" className={PLAN_BTN}>
              Nowy szablon
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {plans.map((p) => (
            <li key={p.id} className="border border-paper/10 bg-paper/[0.03] p-4">
              <p className="font-display text-lg uppercase">{p.title}</p>
              <p className="mt-1 text-sm text-paper/55">
                {(p.weeks ?? []).length} tygodni · {(p.weeks?.[0]?.days ?? []).length} dni
              </p>
              {p.notes ? (
                <p className="mt-2 text-sm text-paper/60">{p.notes}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={PLAN_BTN}
                  disabled={busy === p.id}
                  onClick={() => {
                    setBusy(p.id);
                    void onUse(p.id).finally(() => setBusy(null));
                  }}
                >
                  {busy === p.id ? "Kopiowanie…" : "Użyj szablonu"}
                </button>
                <Link
                  href={`/klub/plany/${p.id}`}
                  className="self-center text-sm text-brand hover:text-paper"
                >
                  Edytuj
                </Link>
                <button
                  type="button"
                  className="self-center text-sm text-paper/55 hover:text-paper"
                  onClick={() => setPreview(p)}
                >
                  Podgląd T1
                </button>
                <button
                  type="button"
                  className="self-center text-sm text-paper/45 hover:text-paper"
                  onClick={() => setDeleteId(p)}
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal
        open={!!preview}
        title={preview?.title ?? "Podgląd"}
        onClose={() => setPreview(null)}
        wide
      >
        {week1 ? (
          <div className="space-y-3 text-sm">
            {(week1.days ?? []).map((d) => (
              <div key={d.id} className="border border-paper/10 p-3">
                <p className="font-display text-xs uppercase">
                  {WEEKDAY_SHORT[d.weekday]}
                </p>
                <ul className="mt-1 text-paper/70">
                  {(d.exercises ?? []).map((ex) => (
                    <li key={ex.id}>
                      {ex.name} · {(ex.sets ?? []).length} serii
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-paper/50">Brak tygodnia 1.</p>
        )}
      </Modal>
      <ConfirmModal
        open={!!deleteId}
        title="Usunąć szablon?"
        message={
          deleteId
            ? `Szablon „${deleteId.title}” zniknie z katalogu. Plany już z niego zrobione zostają.`
            : ""
        }
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
