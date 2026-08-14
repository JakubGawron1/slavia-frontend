"use client";

import Link from "next/link";
import {
  sortedUserChangelog,
  type UserChangelogEntry,
} from "@/lib/user-changelog";
import { SLAVIA_VERSION } from "@/lib/version";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

function EntryCard({ entry }: { entry: UserChangelogEntry }) {
  return (
    <article className="border border-paper/10 bg-paper/[0.03] px-4 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm text-brand">v{entry.version}</span>
        <time
          dateTime={entry.date}
          className="font-display text-[10px] tracking-[0.12em] text-paper/40 uppercase"
        >
          {new Date(entry.date).toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <h2 className="mt-2 text-base font-medium text-paper">{entry.title}</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-paper/65">
        {entry.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </article>
  );
}

type UserChangelogViewProps = {
  /** Link do pełniejszej listy — opcjonalny kontekst (panel vs klub). */
  homeHref: string;
};

export function UserChangelogView({ homeHref }: UserChangelogViewProps) {
  const entries = sortedUserChangelog();

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Aktualizacje"
        title="Co nowego"
        description={
          <>
            Krótko i po ludzku — co zmieniło się w platformie. Aktualna wersja:{" "}
            <span className="font-mono text-paper/80">v{SLAVIA_VERSION}</span>.
          </>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Brak opublikowanych zmian"
          description={
            <>
              Wróć do{" "}
              <Link href={homeHref} className="text-brand hover:underline">
                pulpitu
              </Link>
              .
            </>
          }
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard
              key={`${entry.version}-${entry.date}-${entry.title}`}
              entry={entry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
