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

/** Kalkulator Sinclair — UI paneli (zawodnik / klub). */
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

  const field =
    "panel-control w-full border border-paper/20 bg-chrome/40 px-4 py-3 pr-14 text-sm text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-brand";
  const label =
    "font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-0 lg:border lg:border-paper/10">
      <div className="border border-paper/10 bg-chrome/30 p-5 md:p-6 lg:border-0 lg:border-r lg:border-paper/10">
        <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
          Dane
        </p>
        <h2 className="mt-2 font-display text-xl tracking-wide text-paper uppercase md:text-2xl">
          Wprowadź wynik
        </h2>

        <fieldset className="mt-6">
          <legend className={label}>Płeć</legend>
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
                  className={`panel-control border px-4 py-3 font-display text-xs tracking-[0.1em] uppercase transition-colors ${
                    active
                      ? "border-brand bg-brand/20 text-paper"
                      : "border-paper/20 bg-chrome/40 text-paper/70 hover:border-paper/40"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor={bwId} className={label}>
            Masa ciała z ważenia
          </label>
          <div className="relative mt-2">
            <input
              id={bwId}
              inputMode="decimal"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="np. 81.4"
              className={field}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-paper/40">
              kg
            </span>
          </div>
          <p className="mt-2 text-xs text-paper/45">
            Rzeczywista masa ciała z zawodów
          </p>
        </div>

        <div className="mt-5">
          <label htmlFor={totalId} className={label}>
            Dwubój (total)
          </label>
          <div className="relative mt-2">
            <input
              id={totalId}
              inputMode="decimal"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="np. 265"
              className={field}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-paper/40">
              kg
            </span>
          </div>
          <p className="mt-2 text-xs text-paper/45">
            Suma najlepszego rwania i podrzutu
          </p>
        </div>

        <p className="mt-6 border-t border-paper/10 pt-4 font-mono text-[11px] leading-relaxed text-paper/40">
          Stałe {sex === "male" ? "mężczyźni" : "kobiety"}: A = {constants.A}, b
          = {constants.b} kg
        </p>
      </div>

      <div className="border border-paper/10 bg-chrome/50 p-5 md:p-6 lg:border-0">
        <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
          Wynik
        </p>
        <h2 className="mt-2 font-display text-xl tracking-wide text-paper uppercase md:text-2xl">
          Punkty Sinclair
        </h2>

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
              Współczynnik Sinclair
            </dt>
            <dd
              className={`mt-2 font-display text-3xl tracking-tight md:text-4xl ${
                hasBodyweight ? "text-paper" : "text-paper/25"
              }`}
              aria-live="polite"
            >
              {hasBodyweight ? formatCoefficient(coefficient) : "—"}
            </dd>
          </div>

          <div className="border-t border-paper/10 pt-6">
            <dt className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
              Total Sinclair
            </dt>
            <dd
              className={`mt-2 font-display text-4xl tracking-tight text-brand md:text-5xl ${
                ready ? "" : "opacity-40"
              }`}
              aria-live="polite"
            >
              {ready ? formatPoints(points) : "—"}
              <span className="ml-2 text-sm tracking-[0.12em] text-paper/45 uppercase">
                pkt
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-8 space-y-2 border-t border-paper/10 pt-5 text-xs leading-relaxed text-paper/50">
          {hasBodyweight && bw >= constants.b ? (
            <p>
              Masa ciała ≥ b ({constants.b} kg) — współczynnik wynosi 1.
            </p>
          ) : (
            <p>
              Dla mas niższych niż b:{" "}
              <span className="font-mono text-paper/65">
                10^(A × log₁₀(x/b)²)
              </span>
            </p>
          )}
          <p>Total Sinclair = dwubój × współczynnik. Przelicza się na żywo.</p>
          <p>
            Okres 2025–2028 (jak PodnoszenieCiężarów.pl): mężczyźni b = 201 kg,
            kobiety b = 164 kg.
          </p>
        </div>
      </div>
    </div>
  );
}
