"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequirePanelFlag } from "@/components/RequireFlag";
import { PlanEditor } from "@/components/plans/editor/PlanEditor";
import { TRAINING_PLANS_FLAG } from "@/lib/panel-flags";
import { blankManualPlan } from "@/lib/plans/blank";
import { readUnsavedPlan, writeUnsavedPlan } from "@/lib/plans/unsaved";
import type { TrainingPlan } from "@/lib/api/generated/models";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { PLAN_BTN } from "@/lib/plans/labels";

function UnsavedEditor() {
  const router = useRouter();
  const search = useSearchParams();
  const startBlank = search.get("nowy") === "1";
  const [plan, setPlan] = useState<TrainingPlan | null | undefined>(undefined);

  useEffect(() => {
    if (startBlank) {
      writeUnsavedPlan(blankManualPlan());
      router.replace("/klub/plany/szkic");
      return;
    }
    setPlan(readUnsavedPlan());
  }, [startBlank, router]);

  if (plan === undefined) {
    return <InlineStatus kind="loading">Otwieranie edytora…</InlineStatus>;
  }
  if (!plan) {
    return (
      <EmptyState
        title="Brak szkicu"
        description="Otwórz pusty edytor, wygeneruj szkic AI albo wróć do listy."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/klub/plany/szkic?nowy=1" className={PLAN_BTN}>
              Pusty edytor
            </Link>
            <Link href="/klub/plany" className="text-sm text-brand">
              Lista planów
            </Link>
          </div>
        }
      />
    );
  }
  return <PlanEditor initial={plan} persisted={false} />;
}

export default function KlubSzkicPage() {
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_FLAG}>
      <Suspense
        fallback={<InlineStatus kind="loading">Otwieranie edytora…</InlineStatus>}
      >
        <UnsavedEditor />
      </Suspense>
    </RequirePanelFlag>
  );
}
