/**
 * Etykiety UI dla metadanych flagi.
 * Same flagi (klucz, kind, opis, rollout_status) pochodzą z API backendu.
 */

import type {
  FlagAudience,
  FlagKind,
  FlagRolloutStatus,
} from "@/lib/api/generated/models";

export const FLAG_KIND_LABELS: Record<FlagKind, { label: string; hint: string }> =
  {
    stable: {
      label: "Stabilne",
      hint: "Gotowa funkcja — ten sam przełącznik co experimental.",
    },
    experimental: {
      label: "Eksperymentalne",
      hint: "Testy na żywych kontach — po włączeniu funkcja trafia do użytkowników.",
    },
  };

export const FLAG_AUDIENCE_LABELS: Record<
  FlagAudience,
  { label: string; hint: string }
> = {
  public: {
    label: "witryna",
    hint: "Czyta GET /api/flags/public — publiczna strona klubu.",
  },
  panels: {
    label: "panele",
    hint: "Klub i panel zawodnika — GET /api/flags/panels (logowanie).",
  },
  both: {
    label: "oba",
    hint: "Ta sama flaga na witrynie i w panelach.",
  },
  internal: {
    label: "serwer",
    hint: "Tylko backend — nie wychodzi do klientów.",
  },
};

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
