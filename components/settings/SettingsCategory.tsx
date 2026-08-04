"use client";

import { useState } from "react";

type Props = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

/** Zwijana kategoria ustawień (native details/summary). */
export function SettingsCategory({
  title,
  description,
  defaultOpen = false,
  children,
}: Props) {
  // React DOM types for <details> expose `open`, not `defaultOpen`.
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className="settings-surface group border border-paper/10 bg-chrome/30"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-chrome/20 md:px-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase group-open:text-paper">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-paper/45">
              {description}
            </p>
          ) : null}
        </div>
        <span
          className="shrink-0 text-lg leading-none text-brand transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        >
          ›
        </span>
      </summary>
      <div className="border-t border-paper/10 px-5 pb-5 pt-4 md:px-6 md:pb-6">
        {children}
      </div>
    </details>
  );
}
