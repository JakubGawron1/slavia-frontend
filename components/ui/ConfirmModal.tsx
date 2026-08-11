"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

/** Potwierdzenie destrukcyjnej akcji — zamiast `window.confirm`. */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Usuń",
  cancelLabel = "Anuluj",
  busy = false,
  busyLabel = "Usuwanie…",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <div className="text-sm text-paper/70">{message}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase disabled:opacity-50"
        >
          {busy ? busyLabel : confirmLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] text-paper/70 uppercase hover:border-paper/40 hover:text-paper disabled:opacity-50"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
