"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAiDraft,
  useListGroups,
} from "@/lib/api/generated/default/default";
import { useListPublicProfiles } from "@/lib/api/generated/public/public";
import { RecipePreview } from "@/components/plans/ai/RecipePreview";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineStatus } from "@/components/ui/InlineStatus";
import {
  PLAN_BTN,
  PLAN_BTN_GHOST,
  PLAN_FIELD,
  PLAN_SURFACE,
  WEEKDAY_SHORT,
} from "@/lib/plans/labels";
import { writeUnsavedPlan } from "@/lib/plans/unsaved";
import type {
  AiDraftResponse,
  AiPlanRecipe,
  AthleteGroup,
  AthleteProfile,
  TrainingPlan,
} from "@/lib/api/generated/models";

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export function AiDraftPanel() {
  const router = useRouter();
  const draft = useAiDraft();
  const groupsQuery = useListGroups();
  const profilesQuery = useListPublicProfiles({ query: { staleTime: 60_000 } });
  const groups = (groupsQuery.data?.data as AthleteGroup[] | undefined) ?? [];
  const profiles =
    (profilesQuery.data?.data as AthleteProfile[] | undefined) ?? [];

  const [prompt, setPrompt] = useState("");
  const [weeks, setWeeks] = useState(8);
  const [weekdays, setWeekdays] = useState<number[]>([1, 3, 5]);
  const [clubDays, setClubDays] = useState<number[]>([1, 3, 5]);
  const [startsOn, setStartsOn] = useState("");
  const [meetOn, setMeetOn] = useState("");
  const [scope, setScope] = useState<"none" | "user" | "group">("none");
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<AiPlanRecipe | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);

  const athletes = useMemo(
    () => profiles.filter((p) => p.user_id && p.user_id !== "manual"),
    [profiles],
  );

  function toggleClubDay(day: number) {
    setClubDays((list) => {
      const on = list.includes(day);
      return on
        ? list.filter((d) => d !== day)
        : [...list, day].sort((a, b) => a - b);
    });
  }

  async function generate() {
    setError(null);
    if (!prompt.trim()) {
      setError("Podaj opis planu dla AI.");
      return;
    }
    const club = clubDays.filter((d) => weekdays.includes(d));
    try {
      const res = await draft.mutateAsync({
        data: {
          prompt: prompt.trim(),
          weeks,
          weekdays,
          club_weekdays: club,
          starts_on: startsOn || null,
          meet_on: meetOn || null,
          user_id: scope === "user" ? userId || null : null,
          group_id: scope === "group" ? groupId || null : null,
        },
      });
      const body = res.data as AiDraftResponse;
      setRecipe(body.recipe);
      setPlan(body.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generowanie nieudane");
    }
  }

  function openEditor() {
    if (!plan) return;
    writeUnsavedPlan(plan);
    router.push("/klub/plany/szkic");
  }

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Plany"
        title="Szkic AI"
        description="AI oddaje przepis (T1 + fale). System składa wszystkie tygodnie. Potem edytor."
        backHref="/klub/plany"
        backLabel="Lista planów"
      />

      <section className={`${PLAN_SURFACE} space-y-4 px-5 py-5`}>
        <label className="block text-[11px] text-paper/45">
          Cel i kontekst
          <textarea
            className={PLAN_FIELD}
            rows={5}
            maxLength={4000}
            placeholder="Np. 8 tygodni do zawodów, objętość rwania, zawodnik trenuje też we wtorki…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-[11px] text-paper/45">
            Tygodnie
            <input
              type="number"
              min={4}
              max={16}
              className={PLAN_FIELD}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value) || 8)}
            />
          </label>
          <label className="text-[11px] text-paper/45">
            Start
            <input
              type="date"
              className={PLAN_FIELD}
              value={startsOn}
              onChange={(e) => setStartsOn(e.target.value)}
            />
          </label>
          <label className="text-[11px] text-paper/45">
            Zawody
            <input
              type="date"
              className={PLAN_FIELD}
              value={meetOn}
              onChange={(e) => setMeetOn(e.target.value)}
            />
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-[11px] text-paper/45">Dni w planie</legend>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                className={
                  weekdays.includes(d)
                    ? "border-brand/40 bg-brand/15 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-brand uppercase"
                    : "border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-paper/50 uppercase"
                }
                onClick={() => {
                  const on = weekdays.includes(d);
                  const next = on
                    ? weekdays.filter((x) => x !== d)
                    : [...weekdays, d].sort((a, b) => a - b);
                  if (next.length === 0) return;
                  setWeekdays(next);
                  setClubDays((c) => {
                    if (on) {
                      const clipped = c.filter((x) => next.includes(x));
                      return clipped.length ? clipped : next;
                    }
                    return [...new Set([...c, d])].sort((a, b) => a - b);
                  });
                }}
              >
                {WEEKDAY_SHORT[d]}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-[11px] text-paper/45">
            Z tego sesje na Slavi (kalendarz)
          </legend>
          <p className="mb-2 text-[11px] text-paper/35">
            Tylko te dni wolno później spiąć z kalendarzem i obecnością. Pozostałe zostają w rozpisce.
          </p>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((d) => (
              <button
                key={d}
                type="button"
                className={
                  clubDays.includes(d)
                    ? "border-brand/40 bg-brand/15 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-brand uppercase"
                    : "border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] text-paper/50 uppercase"
                }
                onClick={() => toggleClubDay(d)}
              >
                {WEEKDAY_SHORT[d]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-[11px] text-paper/45">
            Kontekst PR
            <select
              className={PLAN_FIELD}
              value={scope}
              onChange={(e) => setScope(e.target.value as typeof scope)}
            >
              <option value="none">Bez przypisania</option>
              <option value="user">Zawodnik</option>
              <option value="group">Grupa</option>
            </select>
          </label>
          {scope === "user" ? (
            <label className="text-[11px] text-paper/45">
              Zawodnik
              <select
                className={PLAN_FIELD}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Wybierz…</option>
                {athletes.map((p) => (
                  <option key={p.id} value={p.user_id}>
                    {p.display_name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {scope === "group" ? (
            <label className="text-[11px] text-paper/45">
              Grupa
              <select
                className={PLAN_FIELD}
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <option value="">Wybierz…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <button
          type="button"
          className={PLAN_BTN}
          disabled={draft.isPending}
          onClick={() => void generate()}
        >
          {draft.isPending ? "Generuję…" : "Generuj przepis"}
        </button>
        {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}
      </section>

      {recipe && plan ? (
        <section className="space-y-4">
          <RecipePreview recipe={recipe} />
          <button type="button" className={PLAN_BTN_GHOST} onClick={openEditor}>
            Otwórz edytor
          </button>
        </section>
      ) : null}
    </div>
  );
}
