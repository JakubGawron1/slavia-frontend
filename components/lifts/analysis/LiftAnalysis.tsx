"use client";

import { useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { AnalysisReport } from "@/components/lifts/analysis/AnalysisReport";
import { useLiftAnalysis } from "@/components/lifts/analysis/useLiftAnalysis";
import { useToast } from "@/components/toast/ToastProvider";
import { ANALYZED_LIFT_OPTIONS, LIFT_ANALYZE_BTN } from "@/lib/lifts/labels";
import { PLAN_BTN_GHOST, PLAN_FIELD } from "@/lib/plans/labels";

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, "0")}`;
}

export function LiftAnalysis() {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    clip,
    start,
    end,
    lift,
    note,
    busy,
    report,
    error,
    pickFile,
    clearClip,
    setWindow,
    setLift,
    setNote,
    analyze,
    maxWindow,
  } = useLiftAnalysis();

  async function onAnalyze() {
    const result = await analyze();
    if (result) {
      toast.success(
        "Analiza",
        result.verdict === "good" ? "Świetna technika." : "Raport gotowy.",
      );
    }
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        title="Analiza techniki"
        description="Wgraj film liftu. Na serwer idą tylko klatki JPEG — sam film zostaje na Twoim urządzeniu. Bez rysowania toru na obrazie."
      />

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pickFile(file);
          e.target.value = "";
        }}
      />

      {!clip ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) void pickFile(file);
          }}
          className="flex min-h-40 w-full flex-col items-center justify-center border border-dashed border-paper/25 bg-chrome/30 px-6 py-10 text-center hover:border-brand/50"
        >
          <span className="font-display text-xs tracking-[0.14em] text-brand uppercase">
            Wgraj film
          </span>
          <span className="mt-2 max-w-md text-sm text-paper/55">
            mp4, webm albo mov. Najlepiej z boku, 2–8 s samego liftu. Max 120 MB.
          </span>
        </button>
      ) : (
        <div className="space-y-3 border border-paper/10 bg-paper/3 p-4">
          <video
            src={clip.url}
            controls
            playsInline
            className="aspect-video w-full bg-chrome object-contain"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                Od {fmtTime(start)}
              </span>
              <input
                type="range"
                min={0}
                max={clip.duration}
                step={0.05}
                value={start}
                onChange={(e) => setWindow(Number(e.target.value), end)}
                className="mt-1 w-full"
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                Do {fmtTime(end)}
              </span>
              <input
                type="range"
                min={0}
                max={clip.duration}
                step={0.05}
                value={end}
                onChange={(e) => setWindow(start, Number(e.target.value))}
                className="mt-1 w-full"
              />
            </label>
          </div>
          <p className="text-xs text-paper/45">
            Zaznacz sam lift (max {maxWindow} s). Reszta filmu nie idzie do analizy.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={PLAN_BTN_GHOST}
              onClick={() => inputRef.current?.click()}
            >
              Inny film
            </button>
            <button type="button" className={PLAN_BTN_GHOST} onClick={clearClip}>
              Usuń
            </button>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
          Jaki lift
        </h2>
        <div className="flex flex-wrap gap-2">
          {ANALYZED_LIFT_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              active={lift === opt.value}
              onClick={() => setLift(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
        <label className="block text-sm">
          <span className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            {lift === "accessory" ? "Nazwa akcesorium" : "Notatka (opcjonalnie)"}
          </span>
          <input
            className={PLAN_FIELD}
            value={note}
            maxLength={400}
            placeholder={
              lift === "accessory"
                ? "np. hang snatch z kolan"
                : "np. 80 kg, druga próba"
            }
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
      </section>

      <button
        type="button"
        className={LIFT_ANALYZE_BTN}
        disabled={busy || !clip}
        onClick={() => void onAnalyze()}
      >
        {busy ? "Analizuję…" : "Analizuj"}
      </button>

      {busy ? (
        <InlineStatus kind="loading">
          Wycinam klatki i czekam na ocenę trenera AI — to może chwilę potrwać.
        </InlineStatus>
      ) : null}
      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}
      {report ? <AnalysisReport report={report} /> : null}
    </div>
  );
}
