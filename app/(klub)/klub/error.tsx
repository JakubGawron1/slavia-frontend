"use client";

import { PanelErrorView } from "@/components/ui/PanelErrorView";

export default function KlubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PanelErrorView
      title="Błąd panelu klubowego"
      message={error.message || "Nie udało się wczytać tego widoku."}
      onRetry={reset}
    />
  );
}
