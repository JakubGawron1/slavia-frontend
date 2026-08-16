"use client";

import { useState } from "react";
import { useToast } from "@/components/toast/ToastProvider";
import type { AiUsageStatus } from "@/lib/api/generated/models";
import { generateAiContent } from "@/lib/api/generated/admin/admin";

const fieldLabel =
  "mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase";
const inputClass =
  "w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";

type AiGenerateSectionProps = {
  keyConfigured: boolean;
  onUsage: (usage: AiUsageStatus) => void;
};

export function AiGenerateSection({
  keyConfigured,
  onUsage,
}: AiGenerateSectionProps) {
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function onGenerate() {
    const text = prompt.trim();
    if (!text) {
      toast.error("AI", "Podaj treść do wygenerowania.");
      return;
    }
    setBusy(true);
    try {
      const res = await generateAiContent({ prompt: text });
      const data = res.data as { text?: string; usage?: AiUsageStatus };
      setResult(data.text ?? "");
      if (data.usage) onUsage(data.usage);
      toast.success("AI", "Wygenerowano treść");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generowanie nieudane";
      toast.error("AI", msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Generowanie treści
      </h2>
      <p className="text-sm text-paper/55">
        Używa zapisanego modelu, stylu, temperatury i instrukcji. Każde
        wywołanie zużywa 1 slot dziennego limitu.
      </p>
      <div>
        <label htmlFor="ai-prompt" className={fieldLabel}>
          Prompt
        </label>
        <textarea
          id="ai-prompt"
          className={`${inputClass} min-h-[120px]`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={8000}
          disabled={!keyConfigured || busy}
        />
      </div>
      <button
        type="button"
        disabled={!keyConfigured || busy}
        onClick={() => void onGenerate()}
        className="border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
      >
        {busy ? "Generuję…" : "Generuj"}
      </button>
      {result ? (
        <div>
          <p className={fieldLabel}>Wynik</p>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap border border-paper/15 bg-chrome/30 px-3 py-2 text-sm text-paper/80">
            {result}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
