"use client";

import { usePanelWyniki } from "@/components/panel/wyniki/usePanelWyniki";
import { WynikEditModal } from "@/components/panel/wyniki/WynikEditModal";
import { WynikForm } from "@/components/panel/wyniki/WynikForm";
import { WynikiResultsList } from "@/components/panel/wyniki/WynikiResultsList";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

export default function WynikiPage() {
  const w = usePanelWyniki();

  return (
    <div className="animate-rise space-y-8">
      <PageHeader
        eyebrow="Sport"
        title="Wyniki i rekordy"
        description="Zgłoś wynik z zawodów lub rekord treningowy — trafi do weryfikacji trenera."
      />

      {w.error ? <InlineStatus kind="error">{w.error}</InlineStatus> : null}

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

      <WynikiResultsList
        results={w.results}
        loading={w.loading}
        onEdit={w.openEdit}
        onEmptyAction={() =>
          document.getElementById("wynik-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      />

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
