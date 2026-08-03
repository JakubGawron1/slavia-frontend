"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  shouldShowWhatsNewModal,
  userChangelogForVersion,
  writeSeenChangelogVersion,
} from "@/lib/user-changelog";
import { SLAVIA_VERSION } from "@/lib/version";

type WhatsNewModalProps = {
  /** Superadmin nie dostaje user-friendly modala (ma DevTools). */
  isSuperadmin: boolean;
  /** Ścieżka do strony „Co nowego”. */
  changelogHref: string;
};

export function WhatsNewModal({
  isSuperadmin,
  changelogHref,
}: WhatsNewModalProps) {
  const [open, setOpen] = useState(false);
  const entries = userChangelogForVersion(SLAVIA_VERSION);

  useEffect(() => {
    if (!shouldShowWhatsNewModal({ isSuperadmin })) return;
    // Lekkie opóźnienie — nie nachodzić na loading shell.
    const t = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(t);
  }, [isSuperadmin]);

  const dismiss = useCallback(() => {
    writeSeenChangelogVersion(SLAVIA_VERSION);
    setOpen(false);
  }, []);

  if (entries.length === 0) return null;

  return (
    <Modal open={open} title="Co nowego" onClose={dismiss} wide>
      <p className="text-sm text-paper/60">
        Platforma została zaktualizowana do wersji{" "}
        <span className="font-mono text-brand">v{SLAVIA_VERSION}</span>. Oto
        najważniejsze nowości:
      </p>

      <div className="mt-4 space-y-4">
        {entries.map((entry) => (
          <div key={`${entry.date}-${entry.title}`}>
            <h3 className="font-medium text-paper">{entry.title}</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-paper/65">
              {entry.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={dismiss}
          className="bg-brand px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
        >
          Rozumiem
        </button>
        <Link
          href={changelogHref}
          onClick={dismiss}
          className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper/70 uppercase hover:border-paper/45 hover:text-paper"
        >
          Pełna lista zmian
        </Link>
      </div>
    </Modal>
  );
}
