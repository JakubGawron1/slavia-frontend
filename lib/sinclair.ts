export type SinclairSex = "male" | "female";

export const SINCLAIR_2025_2028 = {
  male: { A: 0.7023570715147177, b: 201 },
  female: { A: 0.6734030019259942, b: 164 },
} as const;

/** Współczynnik Sinclair (okres 2025–2028). */
export function sinclairCoefficient(
  bodyweightKg: number,
  sex: SinclairSex,
): number {
  if (!Number.isFinite(bodyweightKg) || bodyweightKg <= 0) {
    return Number.NaN;
  }

  const { A, b } = SINCLAIR_2025_2028[sex];
  if (bodyweightKg >= b) {
    return 1;
  }

  const ratioLog = Math.log10(bodyweightKg / b);
  return 10 ** (A * ratioLog * ratioLog);
}

/** Total Sinclair = dwubój × współczynnik. */
export function sinclairTotal(
  totalKg: number,
  bodyweightKg: number,
  sex: SinclairSex,
): number {
  if (!Number.isFinite(totalKg) || totalKg <= 0) {
    return Number.NaN;
  }

  const coefficient = sinclairCoefficient(bodyweightKg, sex);
  if (Number.isNaN(coefficient)) {
    return Number.NaN;
  }

  return totalKg * coefficient;
}

export function formatCoefficient(value: number): string {
  if (!Number.isFinite(value)) return "—";
  // Deterministic (no locale) — unika różnic SSR/klient
  return value.toFixed(6);
}

export function formatPoints(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(2);
}
