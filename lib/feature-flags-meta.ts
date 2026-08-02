/**
 * Etykiety UI dla statusu wdrożenia flagi.
 * Same flagi (klucz, kind, opis, rollout_status) pochodzą z API backendu.
 */

import type { FlagRolloutStatus } from "@/lib/api/generated/models";

export const FLAG_ROLLOUT_LABELS: Record<
  FlagRolloutStatus,
  { label: string; hint: string }
> = {
  wired: {
    label: "Wdrożone",
    hint: "Flaga jest czytana w kodzie i realnie włącza/wyłącza funkcję.",
  },
  partial: {
    label: "Częściowo",
    hint: "Są elementy UI/nawigacji, ale flaga jeszcze nie egzekwuje zachowania.",
  },
  stub: {
    label: "Szkielet",
    hint: "Flaga istnieje w API/seedzie; brak logiki produktowej pod spodem.",
  },
  planned: {
    label: "Planowane",
    hint: "Zarezerwowany klucz pod przyszłą funkcję — nie używać w produkcji.",
  },
};
