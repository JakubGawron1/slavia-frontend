import type { AnalyzedLiftValue } from "@/lib/validation/liftAnalysis";

export const ANALYZED_LIFT_OPTIONS: {
  value: AnalyzedLiftValue;
  label: string;
}[] = [
  { value: "snatch", label: "Rwanie" },
  { value: "power_snatch", label: "Power snatch" },
  { value: "clean", label: "Zarzut" },
  { value: "power_clean", label: "Power clean" },
  { value: "jerk", label: "Podrzut" },
  { value: "clean_and_jerk", label: "Zarzut i podrzut" },
  { value: "accessory", label: "Akcesorium" },
];

export const LIFT_ANALYZE_BTN =
  "bg-brand px-5 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand/85 disabled:opacity-50";
