"use client";

import { usePanelWyniki } from "@/components/panel/wyniki/usePanelWyniki";
import { WynikEditModal } from "@/components/panel/wyniki/WynikEditModal";
import { WynikForm } from "@/components/panel/wyniki/WynikForm";
import { WynikiResultsList } from "@/components/panel/wyniki/WynikiResultsList";

export default function WynikiPage() {
  const w = usePanelWyniki();

  return (
    <div className="animate-rise max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold uppercase">
          Wyniki i rekordy
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Zgłoś wynik z zawodów lub rekord treningowy — trafi do weryfikacji
          trenera.
        </p>
      </div>

      {w.error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {w.error}
        </p>
      ) : null}

      <WynikForm
        kind={w.kind}
        onKindChange={w.setKind}
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
        profileReady={w.profileReady}
        onSubmit={w.submit}
      />

      <WynikiResultsList results={w.results} onEdit={w.openEdit} />

      <WynikEditModal
        editing={w.editing}
        values={w.editValues}
        onFieldChange={w.setEditField}
        previewCategory={w.editPreviewCategory}
        profileReady={w.profileReady}
        saving={w.editSaving}
        onSubmit={(e) => void w.saveEdit(e)}
        onClose={w.closeEdit}
      />
    </div>
  );
}
