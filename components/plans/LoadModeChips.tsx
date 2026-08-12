"use client";

import type { PctOfLift } from "@/lib/api/generated/models/pctOfLift";
import {
  LOAD_TEXT_ATHLETE,
  LOAD_TEXT_BAR,
  loadModeOf,
  withLoadMode,
} from "@/lib/plans/helpers";
import { chipActive, chipIdle } from "@/components/plans/styles";

type LoadFields = {
  load_kg?: number | null;
  load_pct?: number | null;
  pct_of?: PctOfLift | null;
  load_text?: string | null;
};

const TEXT_PRESETS = [
  { label: "Sztanga", value: LOAD_TEXT_BAR },
  { label: "Sam ustala", value: LOAD_TEXT_ATHLETE },
] as const;

export function LoadModeChips<T extends LoadFields>({
  value,
  onChange,
  pctDefaults,
  pctLabel = "%",
}: {
  value: T;
  onChange: (next: T) => void;
  pctDefaults?: { load_pct?: number | null; pct_of?: PctOfLift | null };
  pctLabel?: string;
}) {
  const mode = loadModeOf(value);
  const text = value.load_text?.trim() ?? "";

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      <button
        type="button"
        className={mode === "kg" ? chipActive : chipIdle}
        onClick={() => onChange(withLoadMode(value, "kg"))}
      >
        Kg
      </button>
      <button
        type="button"
        className={mode === "pct" ? chipActive : chipIdle}
        onClick={() => onChange(withLoadMode(value, "pct", pctDefaults))}
      >
        {pctLabel}
      </button>
      {TEXT_PRESETS.map((p) => (
        <button
          key={p.value}
          type="button"
          className={mode === "text" && text === p.value ? chipActive : chipIdle}
          onClick={() =>
            onChange(withLoadMode(value, "text", { load_text: p.value }))
          }
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function LoadTextSummary({
  loadText,
}: {
  loadText?: string | null;
}) {
  const t = loadText?.trim();
  if (!t) return null;
  return <p className="text-sm text-paper/70">{t}</p>;
}
