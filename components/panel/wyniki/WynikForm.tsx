import type { FormEvent } from "react";
import { ResultCategoryPreview } from "@/components/results/ResultCategoryPreview";
import { resultInputClass } from "@/components/results/shared";
import type { WynikKind } from "./usePanelWyniki";

type WynikFormProps = {
  kind: WynikKind;
  onKindChange: (kind: WynikKind) => void;
  eventName: string;
  onEventNameChange: (v: string) => void;
  eventDate: string;
  onEventDateChange: (v: string) => void;
  snatch: string;
  onSnatchChange: (v: string) => void;
  cj: string;
  onCjChange: (v: string) => void;
  bodyweight: string;
  onBodyweightChange: (v: string) => void;
  venue: string;
  onVenueChange: (v: string) => void;
  previewCategory: string | null;
  profileReady: boolean;
  onSubmit: (e: FormEvent) => void;
};

const fieldLabelClass =
  "font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase";

export function WynikForm({
  kind,
  onKindChange,
  eventName,
  onEventNameChange,
  eventDate,
  onEventDateChange,
  snatch,
  onSnatchChange,
  cj,
  onCjChange,
  bodyweight,
  onBodyweightChange,
  venue,
  onVenueChange,
  previewCategory,
  profileReady,
  onSubmit,
}: WynikFormProps) {
  const tabClass = (active: boolean) =>
    active
      ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase"
      : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.1em] uppercase text-paper/50";

  return (
    <form
      id="wynik-form"
      onSubmit={onSubmit}
      className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
    >
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="button"
          onClick={() => onKindChange("competition")}
          className={tabClass(kind === "competition")}
        >
          Zawody
        </button>
        <button
          type="button"
          onClick={() => onKindChange("training")}
          className={tabClass(kind === "training")}
        >
          Rekord treningowy
        </button>
      </div>
      {kind === "competition" ? (
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={fieldLabelClass}>Nazwa zawodów</span>
          <input
            className={resultInputClass}
            value={eventName}
            onChange={(e) => onEventNameChange(e.target.value)}
            required
          />
        </label>
      ) : null}
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className={fieldLabelClass}>
          {kind === "competition" ? "Data zawodów" : "Data treningu"}
        </span>
        <input
          className={resultInputClass}
          type="date"
          value={eventDate}
          onChange={(e) => onEventDateChange(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Rwanie (kg)</span>
        <input
          className={resultInputClass}
          type="number"
          step="0.5"
          value={snatch}
          onChange={(e) => onSnatchChange(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Podrzut (kg)</span>
        <input
          className={resultInputClass}
          type="number"
          step="0.5"
          value={cj}
          onChange={(e) => onCjChange(e.target.value)}
        />
      </label>
      {kind === "competition" ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabelClass}>Aktualna masa ciała (kg)</span>
            <input
              className={resultInputClass}
              type="number"
              step="0.1"
              value={bodyweight}
              onChange={(e) => onBodyweightChange(e.target.value)}
              required
            />
          </label>
          <ResultCategoryPreview
            category={previewCategory}
            missingProfileInfo={!profileReady}
          />
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={fieldLabelClass}>Miejsce zawodów</span>
            <input
              className={resultInputClass}
              value={venue}
              onChange={(e) => onVenueChange(e.target.value)}
            />
          </label>
        </>
      ) : null}
      <button
        type="submit"
        className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase sm:col-span-2 sm:justify-self-start"
      >
        Wyślij do weryfikacji
      </button>
    </form>
  );
}
