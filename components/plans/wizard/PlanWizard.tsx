"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  useListGroups,
  useListLibrary,
  useGetSchedule,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import { WizardSteps } from "@/components/plans/wizard/WizardSteps";
import {
  usePlanWizard,
  wizardStepLabels,
} from "@/components/plans/wizard/usePlanWizard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PLAN_BTN, PLAN_BTN_GHOST } from "@/lib/plans/labels";
import type {
  AthleteGroup,
  AthleteProfile,
  LibraryExercise,
  TrainingScheduleDefaults,
} from "@/lib/api/generated/models";

export function PlanWizard() {
  const search = useSearchParams();
  const asCatalog = search.get("katalog") === "1";
  const steps = wizardStepLabels(asCatalog);
  const libraryQuery = useListLibrary();
  const groupsQuery = useListGroups();
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const scheduleQuery = useGetSchedule();
  const library = (libraryQuery.data?.data as LibraryExercise[] | undefined) ?? [];
  const w = usePlanWizard(library, asCatalog);
  const appliedSchedule = useRef(false);

  useEffect(() => {
    const schedule = scheduleQuery.data?.data as
      | TrainingScheduleDefaults
      | undefined;
    if (!schedule?.weekdays?.length || appliedSchedule.current) return;
    appliedSchedule.current = true;
    w.setWeekdays(schedule.weekdays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleQuery.data]);

  const profiles =
    (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];
  const groups = (groupsQuery.data?.data as AthleteGroup[] | undefined) ?? [];

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Plany"
        title={asCatalog ? "Nowy szablon" : "Kreator planu"}
        backHref="/klub/plany"
        description={`Krok ${w.step + 1} / ${steps.length} — ${steps[w.step]}`}
      />
      <div className="h-1 bg-paper/10">
        <div
          className="h-1 bg-brand"
          style={{ width: `${((w.step + 1) / steps.length) * 100}%` }}
        />
      </div>
      {w.error ? <InlineStatus kind="error">{w.error}</InlineStatus> : null}
      <WizardSteps
        step={w.step}
        state={w.state}
        seeded={w.seeded}
        library={library}
        profiles={profiles}
        groups={groups}
        patch={w.patch}
        setWeekdays={w.setWeekdays}
        asCatalog={asCatalog}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={PLAN_BTN_GHOST}
          onClick={w.back}
          disabled={w.step === 0}
        >
          Wstecz
        </button>
        {w.step < steps.length - 1 ? (
          <button type="button" className={PLAN_BTN} onClick={w.next}>
            Dalej
          </button>
        ) : (
          <button
            type="button"
            className={PLAN_BTN}
            disabled={w.busy}
            onClick={() => void w.submit()}
          >
            {w.busy ? "Tworzenie…" : asCatalog ? "Utwórz szablon" : "Utwórz szkic"}
          </button>
        )}
      </div>
    </div>
  );
}
