"use client";

import { AthleteFilterSelect } from "@/components/results/AthleteFilterSelect";
import { OtherResultsList } from "@/components/klub/weryfikacja-wynikow/OtherResultsList";
import { PendingResultsList } from "@/components/klub/weryfikacja-wynikow/PendingResultsList";
import { StaffResultForm } from "@/components/klub/weryfikacja-wynikow/StaffResultForm";
import { useWeryfikacjaWynikow } from "@/components/klub/weryfikacja-wynikow/useWeryfikacjaWynikow";
import { WeryfikacjaEditModal } from "@/components/klub/weryfikacja-wynikow/WeryfikacjaEditModal";

export default function WeryfikacjaPage() {
  const w = useWeryfikacjaWynikow();

  return (
    <div className="animate-rise max-w-4xl space-y-8">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Ludzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Weryfikacja wyników
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Akceptuj zgłoszenia zawodników albo wpisz wynik samodzielnie — wtedy
          od razu trafia jako zaakceptowany. Kategoria wagowa wylicza się z
          profilu (wiek, płeć) i masy ciała.
        </p>
      </div>

      {w.error ? (
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
          {w.error}
        </p>
      ) : null}

      <StaffResultForm
        profiles={w.profiles}
        profileId={w.profileId}
        onProfileIdChange={w.setProfileId}
        eventName={w.eventName}
        onEventNameChange={w.setEventName}
        eventDate={w.eventDate}
        onEventDateChange={w.setEventDate}
        snatch={w.snatch}
        onSnatchChange={w.setSnatch}
        cj={w.cj}
        onCjChange={w.setCj}
        bodyweight={w.bodyweight}
        onBodyweightChange={w.setBodyweight}
        venue={w.venue}
        onVenueChange={w.setVenue}
        previewCategory={w.previewCategory}
        missingProfileInfo={w.missingProfileInfoForCreate}
        saving={w.saving}
        onSubmit={(e) => void w.createStaffResult(e)}
      />

      {w.loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      <AthleteFilterSelect
        options={w.athleteFilterOptions}
        value={w.filterAthlete}
        onChange={w.setFilterAthlete}
      />

      <PendingResultsList
        results={w.pending}
        loading={w.loading}
        notes={w.notes}
        onNoteChange={(id, value) =>
          w.setNotes((prev) => ({ ...prev, [id]: value }))
        }
        onEdit={w.openEdit}
        onReview={(id, status) => void w.review(id, status)}
      />

      <OtherResultsList results={w.others} onEdit={w.openEdit} />

      <WeryfikacjaEditModal
        editing={w.editing}
        values={w.editValues}
        onFieldChange={w.setEditField}
        previewCategory={w.editPreviewCategory}
        missingProfileInfo={w.missingProfileInfoForEdit}
        saving={w.editSaving}
        onSubmit={(e) => void w.saveEdit(e)}
        onClose={w.closeEdit}
      />
    </div>
  );
}
