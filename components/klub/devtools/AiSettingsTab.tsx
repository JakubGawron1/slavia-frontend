"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/toast/ToastProvider";
import type {
  AiResponseStyle,
  AiSettings,
  AiSettingsResponse,
  AiUsageStatus,
  GroqFreePlanLimits,
  GroqModelInfo,
} from "@/lib/api/generated/models";
import {
  getAiSettings,
  listAiModels,
  putAiSettings,
} from "@/lib/api/generated/admin/admin";
import { AiFreePlanLimitsSection } from "@/components/klub/devtools/AiFreePlanLimitsSection";

const STYLE_OPTIONS: { value: AiResponseStyle; label: string; hint: string }[] = [
  { value: "concise", label: "Zwięzły", hint: "Mało ćwiczeń, krótkie notatki" },
  { value: "balanced", label: "Zrównoważony", hint: "Typowa objętość olimpijska" },
  { value: "detailed", label: "Szczegółowy", hint: "Więcej wskazówek w notatkach" },
  { value: "coach", label: "Trener klubowy", hint: "Konkretny język treningowy PL" },
];

const fieldLabel =
  "mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";
const inputClass =
  "w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";
const boxClass = "space-y-3 border border-paper/10 bg-paper/[0.03] p-5";

function defaultsFromResponse(res: AiSettingsResponse): AiSettings {
  return {
    ...res.settings,
    model: res.settings.model?.trim() || res.env_model_fallback || "llama-3.1-8b-instant",
  };
}

export function AiSettingsTab() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyConfigured, setKeyConfigured] = useState(false);
  const [envFallback, setEnvFallback] = useState("");
  const [models, setModels] = useState<GroqModelInfo[]>([]);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [freeLimits, setFreeLimits] = useState<GroqFreePlanLimits | null>(null);
  const [usage, setUsage] = useState<AiUsageStatus | null>(null);
  const [form, setForm] = useState<AiSettings>({
    model: "llama-3.1-8b-instant",
    response_style: "balanced",
    temperature: 0.35,
    max_tokens: 4096,
    default_weeks: 4,
    daily_drafts_limit: 100,
    prefer_library_names: true,
    include_warmup: true,
    custom_instructions: null,
  });

  async function load() {
    setLoading(true);
    setError(null);
    setModelsError(null);
    try {
      const [settingsRes, modelsRes] = await Promise.all([
        getAiSettings(),
        listAiModels().catch((err: unknown) => {
          setModelsError(
            err instanceof Error ? err.message : "Nie udało się pobrać modeli",
          );
          return null;
        }),
      ]);
      const data = settingsRes.data as AiSettingsResponse;
      setKeyConfigured(Boolean(data.groq_key_configured));
      setEnvFallback(data.env_model_fallback ?? "");
      setForm(defaultsFromResponse(data));
      setFreeLimits(data.free_plan_limits ?? null);
      setUsage(data.usage ?? null);
      if (modelsRes) {
        const body = modelsRes.data as {
          models?: GroqModelInfo[];
          groq_key_configured?: boolean;
        };
        setModels(body.models ?? []);
        if (body.groq_key_configured != null) {
          setKeyConfigured(Boolean(body.groq_key_configured));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function onModelChange(id: string) {
    const fromList = models.find((m) => m.id === id)?.free_plan_limits;
    setForm((prev) => {
      const next = { ...prev, model: id };
      if (fromList?.tpm) {
        next.max_tokens = Math.min(
          prev.max_tokens ?? 4096,
          Math.floor(fromList.tpm * 0.7),
          4096,
        );
      }
      return next;
    });
    setFreeLimits(fromList ?? null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await putAiSettings({
        model: form.model?.trim() || "llama-3.1-8b-instant",
        response_style: form.response_style ?? "balanced",
        temperature: Number(form.temperature ?? 0.35),
        max_tokens: Number(form.max_tokens ?? 4096),
        default_weeks: Number(form.default_weeks ?? 4),
        daily_drafts_limit: Number(form.daily_drafts_limit ?? 100),
        prefer_library_names: Boolean(form.prefer_library_names),
        include_warmup: Boolean(form.include_warmup),
        custom_instructions: form.custom_instructions?.trim() || null,
      });
      const data = res.data as AiSettingsResponse;
      setForm(defaultsFromResponse(data));
      setKeyConfigured(Boolean(data.groq_key_configured));
      setFreeLimits(data.free_plan_limits ?? null);
      setUsage(data.usage ?? null);
      toast.success("AI", "Zapisano ustawienia");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się zapisać";
      setError(msg);
      toast.error("AI", msg);
    } finally {
      setSaving(false);
    }
  }

  function patch<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-paper/50">Ładowanie ustawień AI…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
        Limity wstępne wg Groq <span className="font-mono">Free Plan</span>. Domyślny
        model: <span className="font-mono">llama-3.1-8b-instant</span> (14,4k RPD).
        Klucz zostaje w <span className="font-mono">GROQ_API_KEY</span>.
      </div>

      {!keyConfigured ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          Brak <span className="font-mono">GROQ_API_KEY</span> — ustaw w{" "}
          <span className="font-mono">.env</span> i zrestartuj backend.
        </p>
      ) : null}
      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <form onSubmit={(ev) => void onSave(ev)} className="space-y-5">
        <section className={boxClass}>
          <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
            Model Groq
          </h2>
          {modelsError ? <p className="text-sm text-paper/55">{modelsError}</p> : null}
          <div>
            <label htmlFor="ai-model" className={fieldLabel}>
              Aktywny model
            </label>
            <select
              id="ai-model"
              className={inputClass}
              value={form.model ?? ""}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {envFallback && !models.some((m) => m.id === envFallback) ? (
                <option value={envFallback}>{envFallback} (fallback env)</option>
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
          </div>
          <button
            type="button"
            className="border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/65 uppercase"
            onClick={() => void load()}
          >
            Odśwież
          </button>
        </section>

        <AiFreePlanLimitsSection
          freeLimits={freeLimits}
          dailyLimit={form.daily_drafts_limit ?? 100}
          usage={usage}
          onDailyLimitChange={(n) => patch("daily_drafts_limit", n)}
        />

        <section className={boxClass}>
          <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
            Styl odpowiedzi
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {STYLE_OPTIONS.map((opt) => {
              const active = form.response_style === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => patch("response_style", opt.value)}
                  className={
                    active
                      ? "border border-brand bg-brand/15 px-3 py-2.5 text-left"
                      : "border border-paper/15 bg-chrome/20 px-3 py-2.5 text-left hover:border-paper/30"
                  }
                >
                  <span className="block font-display text-[11px] tracking-[0.12em] uppercase">
                    {opt.label}
                  </span>
                  <span className="mt-1 block text-xs text-paper/50">{opt.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={boxClass}>
          <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
            Generowanie
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="ai-temp" className={fieldLabel}>
                Temperature ({form.temperature ?? 0.35})
              </label>
              <input
                id="ai-temp"
                className={inputClass}
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={form.temperature ?? 0.35}
                onChange={(e) => patch("temperature", Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="ai-tokens" className={fieldLabel}>
                Max tokens (≤ TPM free)
              </label>
              <input
                id="ai-tokens"
                className={inputClass}
                type="number"
                min={512}
                max={freeLimits?.tpm ?? 16384}
                step={256}
                value={form.max_tokens ?? 4096}
                onChange={(e) =>
                  patch("max_tokens", e.target.value ? Number(e.target.value) : 4096)
                }
              />
            </div>
            <div>
              <label htmlFor="ai-weeks" className={fieldLabel}>
                Domyślne tygodnie
              </label>
              <input
                id="ai-weeks"
                className={inputClass}
                type="number"
                min={1}
                max={16}
                value={form.default_weeks ?? 4}
                onChange={(e) =>
                  patch("default_weeks", e.target.value ? Number(e.target.value) : 4)
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-paper/70">
            <input
              type="checkbox"
              checked={Boolean(form.prefer_library_names)}
              onChange={(e) => patch("prefer_library_names", e.target.checked)}
            />
            Preferuj bibliotekę (własne ćwiczenia też OK, gdy brak w liście)
          </label>
          <label className="flex items-center gap-2 text-sm text-paper/70">
            <input
              type="checkbox"
              checked={Boolean(form.include_warmup)}
              onChange={(e) => patch("include_warmup", e.target.checked)}
            />
            Dodawaj rozgrzewkę / mobilność
          </label>
          <div>
            <label htmlFor="ai-extra" className={fieldLabel}>
              Dodatkowe instrukcje
            </label>
            <textarea
              id="ai-extra"
              className={`${inputClass} min-h-[88px]`}
              value={form.custom_instructions ?? ""}
              onChange={(e) =>
                patch("custom_instructions", e.target.value || null)
              }
              maxLength={1500}
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
        >
          {saving ? "Zapisuję…" : "Zapisz ustawienia AI"}
        </button>
      </form>
    </div>
  );
}
