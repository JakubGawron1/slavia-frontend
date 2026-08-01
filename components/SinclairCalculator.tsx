"use client";

import { useId, useState } from "react";
import {
  formatCoefficient,
  formatPoints,
  SINCLAIR_2025_2028,
  sinclairCoefficient,
  sinclairTotal,
  type SinclairSex,
} from "@/lib/sinclair";

function parsePositive(raw: string): number {
  const normalized = raw.replace(",", ".").trim();
  if (!normalized) return Number.NaN;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : Number.NaN;
}

export function SinclairCalculator() {
  const sexId = useId();
  const bwId = useId();
  const totalId = useId();

  const [sex, setSex] = useState<SinclairSex>("male");
  const [bodyweight, setBodyweight] = useState("");
  const [total, setTotal] = useState("");

  const bw = parsePositive(bodyweight);
  const tot = parsePositive(total);
  const constants = SINCLAIR_2025_2028[sex];

  const coefficient = sinclairCoefficient(bw, sex);
  const points = sinclairTotal(tot, bw, sex);

  const hasBodyweight = Number.isFinite(bw);
  const hasTotal = Number.isFinite(tot);
  const ready = hasBodyweight && hasTotal;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-0">
      <div className="border border-mist bg-paper p-6 md:p-8">
        <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
          Dane
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-wide text-ink uppercase md:text-3xl">
          Wprowadź wynik
        </h2>

        <fieldset className="mt-8">
          <legend className="font-display text-xs tracking-[0.16em] text-steel-soft uppercase">
            Płeć
          </legend>
          <div
            className="mt-3 grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-labelledby={sexId}
          >
            <span id={sexId} className="sr-only">
              Płeć
            </span>
            {(
              [
                { value: "male", label: "Mężczyzna" },
                { value: "female", label: "Kobieta" },
              ] as const
            ).map((option) => {
              const active = sex === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSex(option.value)}
                  className={`border px-4 py-3 font-display text-sm tracking-[0.1em] uppercase transition-colors ${
                    active
                      ? "border-brand bg-brand text-paper"
                      : "border-mist bg-background text-steel hover:border-steel-soft"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6">
          <label
            htmlFor={bwId}
            className="font-display text-xs tracking-[0.16em] text-steel-soft uppercase"
          >
            Masa ciała z ważenia
          </label>
          <div className="relative mt-2">
            <input
              id={bwId}
              inputMode="decimal"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="np. 81.4"
              className="w-full border border-mist bg-background px-4 py-3.5 pr-14 text-ink outline-none transition-[border-color] placeholder:text-steel-soft/50 focus:border-brand"
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-steel-soft">
              kg
            </span>
          </div>
          <p className="mt-2 text-sm text-steel-soft">
            Rzeczywista masa ciała z zawodów
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor={totalId}
            className="font-display text-xs tracking-[0.16em] text-steel-soft uppercase"
          >
            Dwubój (total)
          </label>
          <div className="relative mt-2">
            <input
              id={totalId}
              inputMode="decimal"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="np. 265"
              className="w-full border border-mist bg-background px-4 py-3.5 pr-14 text-ink outline-none transition-[border-color] placeholder:text-steel-soft/50 focus:border-brand"
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-steel-soft">
              kg
            </span>
          </div>
          <p className="mt-2 text-sm text-steel-soft">
            Suma najlepszego rwania i podrzutu
          </p>
        </div>

        <p className="mt-8 border-t border-mist pt-5 font-mono text-xs leading-relaxed text-steel-soft">
          Stałe {sex === "male" ? "mężczyźni" : "kobiety"}: A ={" "}
          {constants.A}, b = {constants.b} kg
        </p>
      </div>

      <div className="border border-mist border-t-0 bg-ink text-paper lg:border-t lg:border-l-0">
        <div className="p-6 md:p-8">
          <p className="font-display text-xs tracking-[0.2em] text-brand uppercase">
            Wynik
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-wide uppercase md:text-3xl">
            Punkty Sinclair
          </h2>

          <dl className="mt-10 space-y-8">
            <div>
              <dt className="font-display text-xs tracking-[0.16em] text-paper/55 uppercase">
                Współczynnik Sinclair
              </dt>
              <dd
                className={`mt-2 font-display text-4xl tracking-tight md:text-5xl ${
                  hasBodyweight ? "text-paper" : "text-paper/30"
                }`}
                aria-live="polite"
              >
                {hasBodyweight ? formatCoefficient(coefficient) : "—"}
              </dd>
            </div>

            <div className="border-t border-paper/15 pt-8">
              <dt className="font-display text-xs tracking-[0.16em] text-paper/55 uppercase">
                Total Sinclair
              </dt>
              <dd
                className={`mt-2 font-display text-5xl tracking-tight text-brand md:text-6xl ${
                  ready ? "" : "opacity-40"
                }`}
                aria-live="polite"
              >
                {ready ? formatPoints(points) : "—"}
                <span className="ml-2 text-lg tracking-[0.12em] text-paper/50 uppercase">
                  pkt
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-10 space-y-3 border-t border-paper/15 pt-6 text-sm leading-relaxed text-paper/65">
            {hasBodyweight && bw >= constants.b ? (
              <p>
                Masa ciała ≥ b ({constants.b} kg) — współczynnik wynosi{" "}
                <strong className="font-medium text-paper">1</strong>, bez
                podwyższenia wyniku względem rzeczywistego totalu.
              </p>
            ) : (
              <p>
                Dla mas niższych niż b stosuje się wzór:{" "}
                <span className="font-mono text-paper/80">
                  10^(A × log₁₀(x/b)²)
                </span>
              </p>
            )}
            <p>
              Total Sinclair = dwubój × współczynnik. Wynik przelicza się na
              żywo — bez przycisku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
