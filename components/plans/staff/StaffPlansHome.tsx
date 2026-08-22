"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import type { TrainingPlan } from "@/lib/api/generated/models";
import {
  copyPlan,
  deletePlan,
  getListPlansQueryKey,
  useListPanelFlags,
  useListPlans,
} from "@/lib/api/generated/default/default";
import { FilterChip } from "@/components/ui/FilterChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { CatalogTab } from "@/components/plans/catalog/CatalogTab";
import { LibraryTab } from "@/components/plans/library/LibraryTab";
import { GroupsTab } from "@/components/plans/groups/GroupsTab";
import {
  PLAN_BTN,
  PLAN_BTN_GHOST,
  PLAN_ORIGIN_LABEL,
  PLAN_STATUS_LABEL,
  assignmentSummary,
} from "@/lib/plans/labels";
import { isFlagEnabled, TRAINING_PLANS_AI_FLAG } from "@/lib/panel-flags";
import { useRouter } from "next/navigation";

type Tab = "active" | "catalog" | "archive" | "library" | "groups";

export function StaffPlansHome() {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<TrainingPlan | null>(null);
  const flagsQuery = useListPanelFlags({ query: { staleTime: 60_000 } });
  const aiOn = isFlagEnabled(flagsQuery.data?.data, TRAINING_PLANS_AI_FLAG);
  const plansQuery = useListPlans();
  const plans = (plansQuery.data?.data as TrainingPlan[] | undefined) ?? [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return plans.filter((p) => {
      if (tab === "active") {
        if (p.status === "catalog" || p.status === "archived") return false;
      } else if (tab === "archive") {
        if (p.status !== "archived") return false;
      } else {
        return false;
      }
      if (!needle) return true;
      return p.title.toLowerCase().includes(needle);
    });
  }, [plans, tab, q]);

  async function useTemplate(id: string) {
    try {
      const res = await copyPlan(id);
      const copy = res.data as TrainingPlan;
      toast.success("Użyto szablonu", copy.title);
      await queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
      router.push(`/klub/plany/${copy.id}`);
    } catch (err) {
      toast.error(
        "Katalog",
        err instanceof Error ? err.message : "Kopiowanie nieudane",
      );
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deletePlan(deleteId.id);
      toast.success("Usunięto plan", deleteId.title);
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
    } catch (err) {
      toast.error(
        "Usuwanie",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
    }
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Trening"
        title="Plany treningowe"
        description="Kreator, pusty edytor, katalog i szkic AI prowadzą do tego samego edytora."
      />
      <div className="flex flex-wrap gap-2">
        <Link href="/klub/plany/nowy" className={PLAN_BTN}>
          Kreator
        </Link>
        <Link href="/klub/plany/szkic?nowy=1" className={PLAN_BTN_GHOST}>
          Edytor od zera
        </Link>
        {aiOn ? (
          <Link href="/klub/plany/szkic-ai" className={PLAN_BTN_GHOST}>
            Szkic AI
          </Link>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["active", "Aktywne"],
            ["catalog", "Katalog"],
            ["archive", "Archiwum"],
            ["library", "Biblioteka"],
            ["groups", "Grupy"],
          ] as const
        ).map(([id, label]) => (
          <FilterChip
            key={id}
            active={tab === id}
            onClick={() => setTab(id)}
            label={label}
          />
        ))}
      </div>

      {tab === "active" || tab === "archive" ? (
        <>
          <label className="block max-w-sm text-sm text-paper/70">
            Szukaj
            <input
              className="mt-1 w-full border border-paper/20 bg-chrome/60 px-3 py-2 text-sm outline-none focus:border-brand"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          {plansQuery.isPending ? (
            <InlineStatus kind="loading">Ładowanie planów…</InlineStatus>
          ) : plansQuery.isError ? (
            <InlineStatus kind="error">Nie udało się wczytać planów.</InlineStatus>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={tab === "archive" ? "Brak archiwum" : "Brak aktywnych planów"}
              description="Ułóż plan kreatorem, od razu w edytorze albo weź szablon z katalogu."
              action={
                <div className="flex flex-wrap gap-2">
                  <Link href="/klub/plany/nowy" className={PLAN_BTN}>
                    Kreator
                  </Link>
                  <Link href="/klub/plany/szkic?nowy=1" className={PLAN_BTN_GHOST}>
                    Edytor od zera
                  </Link>
                </div>
              }
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="border border-paper/10 bg-paper/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/klub/plany/${p.id}`}
                        className="font-display text-lg uppercase hover:text-brand"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-sm text-paper/55">
                        {(p.weeks ?? []).length} tyg. ·{" "}
                        {assignmentSummary(
                          p.assignment?.kind,
                          p.assignment?.user_ids?.length ?? 0,
                          p.assignment?.group_ids?.length ?? 0,
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="border border-paper/20 px-2 py-0.5 font-display text-[10px] tracking-[0.12em] uppercase">
                        {PLAN_STATUS_LABEL[p.status ?? "draft"]}
                      </span>
                      {p.is_current ? (
                        <span className="border border-brand/40 bg-brand/15 px-2 py-0.5 font-display text-[10px] tracking-[0.12em] uppercase">
                          Sezon
                        </span>
                      ) : null}
                      <span className="text-[10px] tracking-[0.1em] text-paper/40 uppercase">
                        {PLAN_ORIGIN_LABEL[p.origin ?? "manual"]}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/klub/plany/${p.id}`}
                      className="text-sm text-brand hover:text-paper"
                    >
                      Edytuj
                    </Link>
                    <button
                      type="button"
                      className="text-sm text-paper/45 hover:text-paper"
                      onClick={() => setDeleteId(p)}
                    >
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {tab === "catalog" ? <CatalogTab onUse={useTemplate} /> : null}
      {tab === "library" ? <LibraryTab /> : null}
      {tab === "groups" ? <GroupsTab /> : null}

      <ConfirmModal
        open={!!deleteId}
        title="Usunąć plan?"
        message={deleteId ? `Plan „${deleteId.title}” zostanie usunięty.` : ""}
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
