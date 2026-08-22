import { ResultCategoryPreview } from "./ResultCategoryPreview";
import {
  resultInputClass,
  type ResultEditFormValues,
} from "./shared";

const fieldLabelClass =
  "font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase";

type ResultFormFieldsProps = {
  values: ResultEditFormValues;
  onFieldChange: <K extends keyof ResultEditFormValues>(
    key: K,
    value: ResultEditFormValues[K],
  ) => void;
  showCompetitionMeta: boolean;
  dateLabel: string;
  previewCategory: string | null;
  missingProfileInfo: boolean;
  bodyweightPlaceholder?: string;
  trainingVenuePlaceholder?: string;
};

export function ResultFormFields({
  values,
  onFieldChange,
  showCompetitionMeta,
  dateLabel,
  previewCategory,
  missingProfileInfo,
  bodyweightPlaceholder,
  trainingVenuePlaceholder,
}: ResultFormFieldsProps) {
  return (
    <>
      {showCompetitionMeta ? (
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={fieldLabelClass}>Nazwa zawodów</span>
          <input
            className={resultInputClass}
            value={values.eventName}
            onChange={(e) => onFieldChange("eventName", e.target.value)}
            required
          />
        </label>
      ) : null}
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className={fieldLabelClass}>{dateLabel}</span>
        <input
          className={resultInputClass}
          type="date"
          value={values.eventDate}
          onChange={(e) => onFieldChange("eventDate", e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Rwanie (kg)</span>
        <input
          className={resultInputClass}
          type="number"
          step="0.5"
          value={values.snatch}
          onChange={(e) => onFieldChange("snatch", e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Podrzut (kg)</span>
        <input
          className={resultInputClass}
          type="number"
          step="0.5"
          value={values.cj}
          onChange={(e) => onFieldChange("cj", e.target.value)}
        />
      </label>
      {showCompetitionMeta ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabelClass}>
              {bodyweightPlaceholder || "Masa ciała (kg)"}
            </span>
            <input
              className={resultInputClass}
              type="number"
              step="0.1"
              value={values.bodyweight}
              onChange={(e) => onFieldChange("bodyweight", e.target.value)}
              required
            />
          </label>
          <ResultCategoryPreview
            category={previewCategory}
            missingProfileInfo={missingProfileInfo}
          />
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={fieldLabelClass}>Miejsce zawodów</span>
            <input
              className={resultInputClass}
              value={values.venue}
              onChange={(e) => onFieldChange("venue", e.target.value)}
            />
          </label>
        </>
      ) : trainingVenuePlaceholder ? (
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={fieldLabelClass}>
            Miejsce{" "}
            <span className="normal-case tracking-normal text-paper/35">
              (opcjonalnie)
            </span>
          </span>
          <input
            className={resultInputClass}
            value={values.venue}
            onChange={(e) => onFieldChange("venue", e.target.value)}
          />
        </label>
      ) : null}
    </>
  );
}
