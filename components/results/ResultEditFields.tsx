import type { CompetitionResult } from "@/lib/api/generated/models";
import { ResultCategoryPreview } from "./ResultCategoryPreview";
import { isCompetitionResult, resultInputClass, type ResultEditFormValues } from "./shared";

type ResultEditFieldsProps = {
  editing: CompetitionResult;
  values: ResultEditFormValues;
  onFieldChange: <K extends keyof ResultEditFormValues>(
    key: K,
    value: ResultEditFormValues[K],
  ) => void;
  previewCategory: string | null;
  missingProfileInfo: boolean;
  bodyweightPlaceholder: string;
  /** Gdy podane — dla treningu (nie-zawodów) renderuje opcjonalne pole miejsca z tym placeholderem. */
  trainingVenuePlaceholder?: string;
};

export function ResultEditFields({
  editing,
  values,
  onFieldChange,
  previewCategory,
  missingProfileInfo,
  bodyweightPlaceholder,
  trainingVenuePlaceholder,
}: ResultEditFieldsProps) {
  const isComp = isCompetitionResult(editing);

  return (
    <>
      {isComp ? (
        <input
          className={`${resultInputClass} sm:col-span-2`}
          placeholder="Nazwa zawodów"
          value={values.eventName}
          onChange={(e) => onFieldChange("eventName", e.target.value)}
          required
        />
      ) : null}
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
          {isComp ? "Data zawodów" : "Data treningu"}
        </span>
        <input
          className={resultInputClass}
          type="date"
          value={values.eventDate}
          onChange={(e) => onFieldChange("eventDate", e.target.value)}
          required
        />
      </label>
      <input
        className={resultInputClass}
        placeholder="Rwanie (kg)"
        type="number"
        step="0.5"
        value={values.snatch}
        onChange={(e) => onFieldChange("snatch", e.target.value)}
      />
      <input
        className={resultInputClass}
        placeholder="Podrzut (kg)"
        type="number"
        step="0.5"
        value={values.cj}
        onChange={(e) => onFieldChange("cj", e.target.value)}
      />
      {isComp ? (
        <>
          <input
            className={resultInputClass}
            placeholder={bodyweightPlaceholder}
            type="number"
            step="0.1"
            value={values.bodyweight}
            onChange={(e) => onFieldChange("bodyweight", e.target.value)}
            required
          />
          <ResultCategoryPreview
            category={previewCategory}
            missingProfileInfo={missingProfileInfo}
          />
          <input
            className={`${resultInputClass} sm:col-span-2`}
            placeholder="Miejsce zawodów"
            value={values.venue}
            onChange={(e) => onFieldChange("venue", e.target.value)}
          />
        </>
      ) : trainingVenuePlaceholder ? (
        <input
          className={`${resultInputClass} sm:col-span-2`}
          placeholder={trainingVenuePlaceholder}
          value={values.venue}
          onChange={(e) => onFieldChange("venue", e.target.value)}
        />
      ) : null}
    </>
  );
}
