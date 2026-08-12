"use client";

import { useState } from "react";
import { inputClass } from "./shared";

type DevPasswordInputProps = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  hint?: string;
};

/** Hasło przy tworzeniu kont .dev / .local — z przełącznikiem Pokaż. */
export function DevPasswordInput({
  value,
  onChange,
  className,
  hint = "Adresy .dev / .local nie wymagają weryfikacji — ustaw hasło od razu. Po utworzeniu zobaczysz je jeszcze raz do skopiowania.",
}: DevPasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
        Hasło
      </span>
      <div className="flex gap-2">
        <input
          className={`${inputClass} min-w-0 flex-1`}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="shrink-0 border border-paper/20 px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase text-paper/70"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Ukryj" : "Pokaż"}
        </button>
      </div>
      {hint ? <span className="text-xs text-paper/45">{hint}</span> : null}
    </label>
  );
}
