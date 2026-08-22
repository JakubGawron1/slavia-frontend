"use client";

import { useParams } from "next/navigation";
import { RequirePanelFlag } from "@/components/RequireFlag";
import { PlanEditor } from "@/components/plans/editor/PlanEditor";
import { TRAINING_PLANS_FLAG } from "@/lib/panel-flags";
import { useGetPlan } from "@/lib/api/generated/default/default";
import type { TrainingPlan } from "@/lib/api/generated/models";
import { InlineStatus } from "@/components/ui/InlineStatus";

function PlanEditorGate({ id }: { id: string }) {
  const query = useGetPlan(id);
  if (query.isPending) {
    return <InlineStatus kind="loading">Ładowanie planu…</InlineStatus>;
  }
  if (query.isError || !query.data?.data) {
    return <InlineStatus kind="error">Nie znaleziono planu.</InlineStatus>;
  }
  return <PlanEditor initial={query.data.data as TrainingPlan} persisted />;
}

export default function KlubPlanIdPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  return (
    <RequirePanelFlag flag={TRAINING_PLANS_FLAG}>
      {id ? <PlanEditorGate id={id} /> : null}
    </RequirePanelFlag>
  );
}
