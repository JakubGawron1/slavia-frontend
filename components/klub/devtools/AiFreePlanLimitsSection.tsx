"use client";

import type { AiUsageStatus, GroqFreePlanLimits } from "@/lib/api/generated/models";

const fieldLabel =
  "mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";
const inputClass =
  "w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

function formatNum(n?: number | null) {
  if (n == null) return "—";
  return n.toLocaleString("pl-PL");
}

export function AiFreePlanLimitsSection({
  freeLimits,
  dailyLimit,
  usage,
  onDailyLimitChange,
}: {
  freeLimits: GroqFreePlanLimits | null;
  dailyLimit: number;
  usage: AiUsageStatus | null;
  onDailyLimitChange: (n: number) => void;
}) {
  return (
    <section className="space-y-3 border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Limity Free Plan (Groq)
      </h2>
      {freeLimits ? (
        <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-paper/40">RPM</dt>
            <dd className="font-mono">{formatNum(freeLimits.rpm)}</dd>
          </div>
          <div>
            <dt className="text-paper/40">RPD</dt>
            <dd className="font-mono">{formatNum(freeLimits.rpd)}</dd>
          </div>
          <div>
            <dt className="text-paper/40">TPM</dt>
            <dd className="font-mono">{formatNum(freeLimits.tpm)}</dd>
          </div>
          <div>
            <dt className="text-paper/40">TPD</dt>
            <dd className="font-mono">{formatNum(freeLimits.tpd)}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-paper/50">
          Brak wpisu free planu dla tego modelu — limity aplikacji i tak działają.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="ai-daily" className={fieldLabel}>
            Limit generowań / dzień (app)
          </label>
          <input
            id="ai-daily"
            className={inputClass}
            type="number"
            min={1}
            max={14400}
            value={dailyLimit}
            onChange={(e) =>
              onDailyLimitChange(e.target.value ? Number(e.target.value) : 100)
            }
          />
          <p className="mt-1 text-xs text-paper/45">
            Egzekwowany w Slavia (UTC). Domyślnie 100 dla 8b (nie cały RPD org).
          </p>
        </div>
        {usage ? (
          <div className="text-sm text-paper/70">
            <p className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
              Zużycie dziś ({usage.date_utc})
            </p>
            <p className="mt-2 font-mono text-lg">
              {usage.generations_used} / {usage.generations_limit}
            </p>
            <p className="text-xs text-paper/45">
              Pozostało: {usage.generations_remaining}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
