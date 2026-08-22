import type { FormEvent } from "react";
import type { AthleteProfile } from "@/lib/api/generated/models";
import { ResultFormFields } from "@/components/results/ResultFormFields";
import { resultInputClass } from "@/components/results/shared";

type StaffResultFormProps = {
  profiles: AthleteProfile[];
  profileId: string;
  onProfileIdChange: (id: string) => void;
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
  missingProfileInfo: boolean;
  saving: boolean;
  onSubmit: (e: FormEvent) => void;
};

const fieldLabelClass =
  "font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase";

export function StaffResultForm({
  profiles,
  profileId,
  onProfileIdChange,
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
  missingProfileInfo,
  saving,
  onSubmit,
}: StaffResultFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 border border-paper/10 bg-paper/[0.03] p-4 sm:grid-cols-2"
    >
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/50 uppercase sm:col-span-2">
        Wpisz wynik (od razu zaakceptowany)
      </h2>

      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className={fieldLabelClass}>Zawodnik (profil)</span>
        <select
          className={resultInputClass}
          value={profileId}
          onChange={(e) => onProfileIdChange(e.target.value)}
          required
        >
          <option value="">— Wybierz profil —</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.display_name}
              {p.category ? ` · ${p.category}` : ""}
            </option>
          ))}
        </select>
      </label>

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
        showCompetitionMeta
        dateLabel="Data zawodów"
        previewCategory={previewCategory}
        missingProfileInfo={missingProfileInfo}
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
      >
        {saving ? "Zapisywanie…" : "Dodaj i zaakceptuj"}
      </button>
    </form>
  );
}
