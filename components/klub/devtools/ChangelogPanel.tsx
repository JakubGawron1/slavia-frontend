import {
  CHANGELOG_CATEGORIES,
  changelogByCategory,
  type ChangelogEntry,
} from "@/lib/changelog";
import { SLAVIA_VERSION } from "@/lib/version";

function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
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
            month: "short",
            day: "numeric",
          })}
        </time>
        {entry.breakingApi ? (
          <span className="border border-amber-500/45 bg-amber-500/12 px-2 py-0.5 font-display text-[10px] tracking-[0.12em] text-amber-100 uppercase">
            Breaking API
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 font-medium text-paper">{entry.title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-paper/60">
        {entry.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </article>
  );
}

export function ChangelogPanel() {
  return (
    <div className="space-y-8">
      <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
        <p>
          Notatki z plików{" "}
          <span className="font-mono text-paper/80">CHANGELOG.md</span> każdego
          projektu. Wspólna wersja bez breaking API pochodzi z{" "}
          <span className="font-mono text-paper/80">Slavia.toml</span>{" "}
          (aktualnie{" "}
          <span className="font-mono text-brand">v{SLAVIA_VERSION}</span>). Po
          edycji MD: <span className="font-mono text-paper/80">pnpm sync:changelog</span>.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {CHANGELOG_CATEGORIES.map((cat) => {
          const entries = changelogByCategory(cat.id);
          return (
            <section key={cat.id} className="flex min-h-0 flex-col space-y-3">
              <div className="shrink-0">
                <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
                  {cat.label}
                </h2>
                <p className="mt-1 text-sm text-paper/50">{cat.hint}</p>
                <p className="mt-1 font-mono text-[11px] text-paper/35">
                  {cat.source}
                </p>
              </div>
              {entries.length === 0 ? (
                <p className="text-sm text-paper/45">Brak wpisów.</p>
              ) : (
                <div className="max-h-[min(60vh,36rem)] space-y-3 overflow-y-auto overscroll-contain">
                  {entries.map((entry) => (
                    <ChangelogEntryCard
                      key={`${entry.category}-${entry.date}-${entry.title}`}
                      entry={entry}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
