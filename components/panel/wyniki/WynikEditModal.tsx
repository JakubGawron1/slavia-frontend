import type { FormEvent } from "react";
import type { CompetitionResult } from "@/lib/api/generated/models";
import { Modal } from "@/components/ui/Modal";
import { ResultEditFields } from "@/components/results/ResultEditFields";
import { isCompetitionResult, type ResultEditFormValues } from "@/components/results/shared";

type WynikEditModalProps = {
  editing: CompetitionResult | null;
  values: ResultEditFormValues | null;
  onFieldChange: <K extends keyof ResultEditFormValues>(
    key: K,
    value: ResultEditFormValues[K],
  ) => void;
  previewCategory: string | null;
  profileReady: boolean;
  saving: boolean;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function WynikEditModal({
  editing,
  values,
  onFieldChange,
  previewCategory,
  profileReady,
  saving,
  onSubmit,
  onClose,
}: WynikEditModalProps) {
  return (
    <Modal
      open={editing != null}
      title={editing ? `Popraw wynik — ${editing.event_name}` : "Popraw wynik"}
      onClose={onClose}
      wide
    >
      {editing && values ? (
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          {editing.status === "needs_edit" && editing.reviewer_note ? (
            <p className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm text-paper/80 sm:col-span-2">
              Uwaga trenera: {editing.reviewer_note}
            </p>
          ) : null}
          <p className="text-sm text-paper/60 sm:col-span-2">
            {isCompetitionResult(editing) ? "Zawody" : "Trening"}
            {editing.status === "accepted"
              ? " · po zapisie wynik wróci do weryfikacji (nawet jeśli był już zaakceptowany)"
              : " · po zapisie wynik wróci do weryfikacji"}
          </p>
          <ResultEditFields
            editing={editing}
            values={values}
            onFieldChange={onFieldChange}
            previewCategory={previewCategory}
            missingProfileInfo={!profileReady}
            bodyweightPlaceholder="Aktualna masa ciała (kg)"
          />
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
            >
              {saving ? "Zapisywanie…" : "Wyślij poprawkę"}
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
