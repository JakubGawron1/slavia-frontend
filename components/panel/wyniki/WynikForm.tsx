import type { FormEvent } from "react";
import { ResultFormFields } from "@/components/results/ResultFormFields";
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
      <ResultFormFields
        values={{ eventName, eventDate, snatch, cj, bodyweight, venue }}
        onFieldChange={(key, value) => {
          if (key === "eventName") onEventNameChange(value);
          else if (key === "eventDate") onEventDateChange(value);
          else if (key === "snatch") onSnatchChange(value);
          else if (key === "cj") onCjChange(value);
          else if (key === "bodyweight") onBodyweightChange(value);
          else onVenueChange(value);
        }}
        showCompetitionMeta={kind === "competition"}
        dateLabel={kind === "competition" ? "Data zawodów" : "Data treningu"}
        previewCategory={previewCategory}
        missingProfileInfo={!profileReady}
        bodyweightPlaceholder="Aktualna masa ciała (kg)"
      />
      <button
        type="submit"
        className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase sm:col-span-2 sm:justify-self-start"
      >
        Wyślij do weryfikacji
      </button>
    </form>
  );
}
