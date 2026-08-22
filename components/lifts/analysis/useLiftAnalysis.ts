import { useCallback, useRef, useState } from "react";
import type {
  AnalyzedLift,
  LiftAnalyzeFrame,
  LiftAnalyzeReport,
} from "@/lib/api/generated/models";
import { analyzeLift } from "@/lib/api/generated/lifts/lifts";
import { liftAnalyzeInputSchema } from "@/lib/validation/liftAnalysis";

const MAX_FILE_BYTES = 120 * 1024 * 1024;
const MAX_WINDOW_S = 20;
const MIN_WINDOW_S = 0.4;
const JPEG_QUALITY = 0.65;
const MAX_WIDTH = 768;
/** Groq vision (Llama 4 / Qwen 3.6) — max 3 obrazy na request. */
const FRAME_COUNT = 3;

export type LiftClip = {
  file: File;
  url: string;
  duration: number;
};

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () =>
      reject(new Error("Nie udało się wczytać filmu. Spróbuj mp4 lub webm."));
  });
}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reject(new Error("Nie udało się ustawić klatki filmu."));
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = Math.min(Math.max(t, 0), Math.max(video.duration - 0.04, 0));
  });
}

function captureJpeg(video: HTMLVideoElement): string {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 360;
  const scale = w > MAX_WIDTH ? MAX_WIDTH / w : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Brak canvas — nie da się wyciąć klatek.");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

async function extractFrames(
  url: string,
  start: number,
  end: number,
  count: number,
): Promise<LiftAnalyzeFrame[]> {
  const video = await loadVideo(url);
  try {
    const span = Math.max(end - start, MIN_WINDOW_S);
    const n = Math.min(FRAME_COUNT, Math.max(2, count));
    const frames: LiftAnalyzeFrame[] = [];
    for (let i = 0; i < n; i += 1) {
      const t = n === 1 ? start : start + (span * i) / (n - 1);
      await seekTo(video, t);
      frames.push({
        t_ms: Math.round(video.currentTime * 1000),
        data_url: captureJpeg(video),
      });
    }
    return frames;
  } finally {
    video.src = "";
    video.load();
  }
}

export function useLiftAnalysis() {
  const urlRef = useRef<string | null>(null);
  const [clip, setClip] = useState<LiftClip | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [lift, setLift] = useState<AnalyzedLift>("snatch");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<LiftAnalyzeReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearClip = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setClip(null);
    setReport(null);
    setStart(0);
    setEnd(0);
  }, []);

  const pickFile = useCallback(
    async (file: File) => {
      setError(null);
      setReport(null);
      if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov)$/i.test(file.name)) {
        setError("Wgraj film (mp4, webm albo mov).");
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError("Film jest za duży (max 120 MB). Przytnij go na telefonie.");
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      try {
        const video = await loadVideo(url);
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        video.src = "";
        video.load();
        if (duration <= 0) {
          URL.revokeObjectURL(url);
          urlRef.current = null;
          setError("Nie odczytano długości filmu.");
          return;
        }
        const windowEnd = Math.min(duration, MAX_WINDOW_S);
        setClip({ file, url, duration });
        setStart(0);
        setEnd(windowEnd);
      } catch (err) {
        URL.revokeObjectURL(url);
        urlRef.current = null;
        setError(err instanceof Error ? err.message : "Nie udało się wczytać filmu.");
      }
    },
    [],
  );

  const setWindow = useCallback(
    (nextStart: number, nextEnd: number) => {
      if (!clip) return;
      let s = Math.min(Math.max(nextStart, 0), clip.duration);
      let e = Math.min(Math.max(nextEnd, 0), clip.duration);
      if (e - s < MIN_WINDOW_S) e = Math.min(s + MIN_WINDOW_S, clip.duration);
      if (e - s > MAX_WINDOW_S) e = s + MAX_WINDOW_S;
      setStart(s);
      setEnd(e);
    },
    [clip],
  );

  const analyze = useCallback(async () => {
    setError(null);
    const parsed = liftAnalyzeInputSchema.safeParse({
      lift,
      note: note.trim() || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Sprawdź lift i notatkę.");
      return null;
    }
    if (!clip) {
      setError("Najpierw wgraj film.");
      return null;
    }
    setBusy(true);
    setReport(null);
    try {
      const frames = await extractFrames(clip.url, start, end, FRAME_COUNT);
      const res = await analyzeLift({
        lift: parsed.data.lift,
        note: parsed.data.note ?? null,
        frames,
      });
      setReport(res.data as LiftAnalyzeReport);
      return res.data as LiftAnalyzeReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analiza nieudana.");
      return null;
    } finally {
      setBusy(false);
    }
  }, [clip, end, lift, note, start]);

  return {
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
    maxWindow: MAX_WINDOW_S,
  };
}
