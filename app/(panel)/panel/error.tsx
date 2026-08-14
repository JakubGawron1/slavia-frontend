"use client";

import { PanelErrorView } from "@/components/ui/PanelErrorView";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PanelErrorView
      title="Błąd panelu zawodnika"
      message={error.message || "Nie udało się wczytać tego widoku."}
      onRetry={reset}
    />
  );
}
