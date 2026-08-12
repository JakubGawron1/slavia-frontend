"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { inputClass } from "./shared";

export type DevCredentials = {
  email: string;
  password: string;
  displayName: string;
};

type DevCredentialsModalProps = {
  credentials: DevCredentials | null;
  onClose: () => void;
};

export function DevCredentialsModal({
  credentials,
  onClose,
}: DevCredentialsModalProps) {
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  async function copy(kind: "email" | "password", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <Modal
      open={credentials !== null}
      title="Hasło konta (dev)"
      onClose={onClose}
    >
      {credentials ? (
        <div className="space-y-4">
          <p className="text-sm text-paper/70">
            Konto{" "}
            <span className="text-paper">{credentials.displayName}</span> —
            zapisz hasło teraz. Później nie da się go odczytać z bazy (tylko
            hash).
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              E-mail
            </span>
            <div className="flex gap-2">
              <input
                className={`${inputClass} min-w-0 flex-1`}
                readOnly
                value={credentials.email}
              />
              <button
                type="button"
                className="shrink-0 border border-paper/20 px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase text-paper/70"
                onClick={() => void copy("email", credentials.email)}
              >
                {copied === "email" ? "OK" : "Kopiuj"}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              Hasło
            </span>
            <div className="flex gap-2">
              <input
                className={`${inputClass} min-w-0 flex-1 font-mono`}
                readOnly
                value={credentials.password}
              />
              <button
                type="button"
                className="shrink-0 border border-paper/20 px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase text-paper/70"
                onClick={() => void copy("password", credentials.password)}
              >
                {copied === "password" ? "OK" : "Kopiuj"}
              </button>
            </div>
          </label>
          <button
            type="button"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            onClick={onClose}
          >
            Zamknij
          </button>
        </div>
      ) : null}
    </Modal>
  );
}
