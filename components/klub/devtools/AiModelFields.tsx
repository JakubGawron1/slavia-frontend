"use client";

import type { GroqModelInfo } from "@/lib/api/generated/models";

const fieldLabel =
  "mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";
const inputClass =
  "w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

function ModelSelect({
  id,
  label,
  hint,
  missingHint,
  models,
  catalogReady,
  value,
  onChange,
  extraOption,
}: {
  id: string;
  label: string;
  hint: string;
  missingHint: string;
  models: GroqModelInfo[];
  catalogReady: boolean;
  value: string;
  onChange: (id: string) => void;
  extraOption?: { id: string; label: string };
}) {
  const inList =
    Boolean(value) &&
    (models.some((m) => m.id === value) || extraOption?.id === value);
  const stale = Boolean(value) && catalogReady && !inList;

  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <select
        id={id}
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {stale ? (
          <option value={value}>{value} — niedostępny</option>
        ) : null}
        {extraOption && !models.some((m) => m.id === extraOption.id) ? (
          <option value={extraOption.id}>{extraOption.label}</option>
        ) : null}
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.id}
            {m.free_plan_limits
              ? ` · free ${m.free_plan_limits.rpd.toLocaleString("pl-PL")} RPD`
              : ""}
          </option>
        ))}
      </select>
      {stale ? (
        <p className="mt-1.5 text-xs text-brand" role="status">
          {missingHint}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-paper/45">{hint}</p>
      )}
    </div>
  );
}

export function AiModelFields({
  models,
  modelsError,
  envFallback,
  model,
  visionModel,
  onModelChange,
  onVisionModelChange,
  onRefresh,
}: {
  models: GroqModelInfo[];
  modelsError: string | null;
  envFallback: string;
  model: string;
  visionModel: string;
  onModelChange: (id: string) => void;
  onVisionModelChange: (id: string) => void;
  onRefresh: () => void;
}) {
  const catalogReady = models.length > 0;
  const textModels = models.filter((m) => !m.supports_vision);
  const visionModels = models.filter((m) => m.supports_vision);
  const envIsVision = models.some((m) => m.id === envFallback && m.supports_vision);
  const textExtra =
    envFallback && !envIsVision
      ? { id: envFallback, label: `${envFallback} (fallback env)` }
      : undefined;

  return (
    <section className="space-y-3 border border-paper/10 bg-paper/3 p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Modele Groq
      </h2>
      {modelsError ? <p className="text-sm text-paper/55">{modelsError}</p> : null}
      <ModelSelect
        id="ai-model"
        label="Model tekstowy (szkice, playground)"
        hint="Tylko modele tekstowe. Wizyjne są w polu poniżej — tutaj dałyby błąd Groq."
        missingHint="Zapisany model tekstowy już nie istnieje na Groq albo jest wizyjny. Wybierz pozycję z tej listy."
        models={textModels}
        catalogReady={catalogReady}
        value={model}
        onChange={onModelChange}
        extraOption={textExtra}
      />
      <ModelSelect
        id="ai-vision-model"
        label="Model wizyjny (analiza liftu)"
        hint="Tylko modele z obrazami (np. Qwen 3.6, Llama 4 Scout). Tekstowy 8B tu nie zadziała — Groq wymaga stringa, nie klatek."
        missingHint="Zapisany model wizyjny już nie istnieje na Groq albo nie przyjmuje obrazów. Wybierz model z tej listy — inaczej analiza liftu padnie."
        models={visionModels}
        catalogReady={catalogReady}
        value={visionModel}
        onChange={onVisionModelChange}
      />
      {models.length > 0 && visionModels.length === 0 ? (
        <p className="text-xs text-paper/55">
          Groq nie zwrócił żadnego modelu z obrazami. Odśwież listę albo sprawdź konto.
        </p>
      ) : null}
      <button
        type="button"
        className="border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/65 uppercase"
        onClick={onRefresh}
      >
        Odśwież
      </button>
    </section>
  );
}
