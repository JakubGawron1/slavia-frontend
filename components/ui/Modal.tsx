"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, onClose, children, wide }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeBtn = panelRef.current?.querySelector<HTMLElement>(
      "[data-modal-close]",
    );
    closeBtn?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Zamknij"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`relative z-10 max-h-[min(90vh,52rem)] w-full overflow-y-auto border border-paper/15 bg-chrome shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-paper/10 bg-chrome px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="font-display text-lg tracking-wide text-paper uppercase"
          >
            {title}
          </h2>
          <button
            type="button"
            data-modal-close
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
