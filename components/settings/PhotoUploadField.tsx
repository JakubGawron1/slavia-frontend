"use client";

import { useId, useRef, useState } from "react";
import { deleteImageFile, uploadImageFile } from "@/lib/upload-image";
import { ImageHolder } from "@/components/settings/ImageHolder";
import { useToast } from "@/components/toast/ToastProvider";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  /** Klasy pola URL (fallback) */
  inputClassName?: string;
  className?: string;
};

export function PhotoUploadField({
  value,
  onChange,
  label = "Zdjęcie",
  hint,
  disabled = false,
  inputClassName,
  className,
}: Props) {
  const toast = useToast();
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileSelected(file: File | null) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
      toast.success("Wgrano zdjęcie");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wgrać zdjęcia.";
      setError(msg);
      toast.error("Zdjęcie", msg);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onRemove() {
    if (!value.trim()) {
      onChange("");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await deleteImageFile(value);
      onChange("");
      toast.success("Usunięto zdjęcie");
    } catch (err) {
      // Lokalnie i tak czyścimy — remote delete jest best-effort.
      onChange("");
      toast.info("Usunięto zdjęcie lokalnie");
      console.warn("delete image remote failed", err);
    } finally {
      setBusy(false);
    }
  }

  const field =
    inputClassName ??
    "w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-brand";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-paper/20 bg-chrome/50">
          {value.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageHolder />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            {label}
          </p>
          {hint ? <p className="text-xs text-paper/45">{hint}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => fileRef.current?.click()}
              className="border border-brand/50 bg-brand/15 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Proszę czekać…" : "Wgraj zdjęcie"}
            </button>
            {value.trim() ? (
              <button
                type="button"
                disabled={disabled || busy}
                onClick={() => void onRemove()}
                className="border border-paper/20 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper/70 uppercase transition-colors hover:border-paper/40 disabled:opacity-40"
              >
                Usuń
              </button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={disabled || busy}
            onChange={(e) => void onFileSelected(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
          URL zdjęcia (fallback)
        </span>
        <input
          type="text"
          className={field}
          value={value}
          disabled={disabled || busy}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          inputMode="url"
          autoComplete="off"
        />
      </label>

      {error ? (
        <p className="mt-2 text-xs text-brand" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
