import type { FormEvent } from "react";
import type { CompetitionResult } from "@/lib/api/generated/models";
import { Modal } from "@/components/ui/Modal";
import { ResultEditFields } from "@/components/results/ResultEditFields";
import {
  isCompetitionResult,
  RESULT_STATUS_LABELS,
  type ResultEditFormValues,
} from "@/components/results/shared";

type WeryfikacjaEditModalProps = {
  editing: CompetitionResult | null;
  values: ResultEditFormValues | null;
  onFieldChange: <K extends keyof ResultEditFormValues>(
    key: K,
    value: ResultEditFormValues[K],
  ) => void;
  previewCategory: string | null;
  missingProfileInfo: boolean;
  saving: boolean;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function WeryfikacjaEditModal({
  editing,
  values,
  onFieldChange,
  previewCategory,
  missingProfileInfo,
  saving,
  onSubmit,
  onClose,
}: WeryfikacjaEditModalProps) {
  return (
    <Modal
      open={editing != null}
      title={editing ? `Edycja — ${editing.athlete_name}` : "Edycja wyniku"}
      onClose={onClose}
      wide
    >
      {editing && values ? (
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <p className="text-sm text-paper/60 sm:col-span-2">
            {isCompetitionResult(editing) ? "Zawody" : "Trening"} · status:{" "}
            {RESULT_STATUS_LABELS[editing.status]}
          </p>
          <ResultEditFields
            editing={editing}
            values={values}
            onFieldChange={onFieldChange}
            previewCategory={previewCategory}
            missingProfileInfo={missingProfileInfo}
            bodyweightPlaceholder="Masa ciała (kg)"
            trainingVenuePlaceholder="Miejsce (opcjonalnie)"
          />
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
            >
              {saving ? "Zapisywanie…" : "Zapisz zmiany"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Anuluj
            </button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
