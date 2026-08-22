import type { CompetitionResult } from "@/lib/api/generated/models";
import { ResultFormFields } from "./ResultFormFields";
import {
  isCompetitionResult,
  type ResultEditFormValues,
} from "./shared";

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
    <ResultFormFields
      values={values}
      onFieldChange={onFieldChange}
      showCompetitionMeta={isComp}
      dateLabel={isComp ? "Data zawodów" : "Data treningu"}
      previewCategory={previewCategory}
      missingProfileInfo={missingProfileInfo}
      bodyweightPlaceholder={bodyweightPlaceholder}
      trainingVenuePlaceholder={trainingVenuePlaceholder}
    />
  );
}
