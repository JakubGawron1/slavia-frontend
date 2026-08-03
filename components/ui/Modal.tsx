"use client";

import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ open, title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Zamknij"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[min(90vh,52rem)] w-full overflow-y-auto border border-paper/15 bg-chrome shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-paper/10 bg-chrome px-4 py-3 sm:px-5">
          <h2
            id="calendar-modal-title"
            className="font-display text-lg tracking-wide text-paper uppercase"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="border border-paper/20 px-3 py-1.5 font-display text-xs tracking-wide text-paper/70 uppercase hover:border-paper/40 hover:text-paper"
          >
            Zamknij
          </button>
        </div>
        <div className="px-4 py-4 text-paper sm:px-5 sm:py-5">{children}</div>
      </div>
    </div>
  );
}
