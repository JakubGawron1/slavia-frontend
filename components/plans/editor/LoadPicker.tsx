"use client";

import type { LoadSpec, PctOf } from "@/lib/api/generated/models";

const CELL =
  "border-0 bg-transparent py-1 text-sm text-paper outline-none focus:text-brand";

const MODES: { id: LoadSpec["mode"]; label: string }[] = [
  { id: "kg", label: "kg" },
  { id: "pct", label: "% PR" },
  { id: "bar", label: "sztanga" },
  { id: "athlete", label: "sam" },
];

const OF_OPTIONS: { id: PctOf; label: string }[] = [
  { id: "snatch", label: "rwanie" },
  { id: "clean_jerk", label: "podrzut" },
  { id: "total", label: "dwubój" },
  { id: "exercise", label: "ćw." },
];

function emptyFor(mode: LoadSpec["mode"]): LoadSpec {
  if (mode === "kg") return { mode: "kg", kg: 20 };
  if (mode === "pct") return { mode: "pct", pct: 70, of: "exercise" };
  if (mode === "bar") return { mode: "bar" };
  return { mode: "athlete" };
}

export function LoadPicker({
  value,
  onChange,
  previewKg,
}: {
  value: LoadSpec;
  onChange: (next: LoadSpec) => void;
  previewKg?: number | null;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <select
        className={`${CELL} font-display text-xs tracking-[0.08em] uppercase text-paper/55`}
        value={value.mode}
        onChange={(e) => onChange(emptyFor(e.target.value as LoadSpec["mode"]))}
        aria-label="Sposób obciążenia"
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      {value.mode === "kg" ? (
        <input
          type="number"
          min={0}
          step={0.5}
          className={`${CELL} w-16 tabular-nums`}
          value={value.kg}
          onChange={(e) =>
            onChange({ mode: "kg", kg: Number(e.target.value) || 0 })
          }
          aria-label="Kilogramy"
        />
      ) : null}
      {value.mode === "pct" ? (
        <>
          <input
            type="number"
            min={0}
            max={120}
            step={1}
            className={`${CELL} w-14 tabular-nums`}
            value={value.pct}
            onChange={(e) =>
              onChange({ ...value, pct: Number(e.target.value) || 0 })
            }
            aria-label="Procent PR"
          />
          <select
            className={`${CELL} text-paper/50`}
            value={value.of}
            onChange={(e) =>
              onChange({ ...value, of: e.target.value as PctOf })
            }
            aria-label="Procent z"
          >
            {OF_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          {previewKg != null ? (
            <span className="tabular-nums text-xs text-paper/40">
              ≈ {previewKg} kg
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
