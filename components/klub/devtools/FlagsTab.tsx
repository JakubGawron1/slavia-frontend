import { FLAG_ROLLOUT_LABELS } from "@/lib/feature-flags-meta";
import type { FeatureFlag, FlagRolloutStatus } from "@/lib/api/generated/models";

function RolloutBadge({ status }: { status: FlagRolloutStatus }) {
  const meta = FLAG_ROLLOUT_LABELS[status];
  const tone =
    status === "wired"
      ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-100"
      : status === "partial"
        ? "border-amber-500/40 bg-amber-500/12 text-amber-100"
        : status === "planned"
          ? "border-paper/20 bg-paper/5 text-paper/55"
          : "border-paper/25 bg-paper/[0.04] text-paper/65";

  return (
    <span
      title={meta.hint}
      className={`inline-flex items-center border px-2 py-0.5 font-display text-[10px] tracking-[0.12em] uppercase ${tone}`}
    >
      {meta.label}
    </span>
  );
}

function FlagRow({
  flag,
  onToggle,
  pending,
}: {
  flag: FeatureFlag;
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border border-paper/10 px-4 py-4">
      <div className="min-w-0 max-w-xl space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-paper">{flag.label}</p>
          <RolloutBadge status={flag.rollout_status} />
        </div>
        <p className="text-sm leading-relaxed text-paper/60">
          {flag.description}
        </p>
        <p className="font-mono text-[11px] text-paper/35">
          {flag.key}
          {flag.client_visible ? " · client" : " · server"}
          {flag.updated_at
            ? ` · aktualizacja ${new Date(flag.updated_at).toLocaleString("pl-PL")}`
            : null}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onToggle(flag)}
        disabled={pending}
        className={
          flag.enabled
            ? "shrink-0 bg-brand px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
            : "shrink-0 border border-paper/25 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-50"
        }
      >
        {flag.enabled ? "Włączone" : "Wyłączone"}
      </button>
    </div>
  );
}

function FlagCategory({
  title,
  hint,
  flags,
  onToggle,
  pending,
}: {
  title: string;
  hint: string;
  flags: FeatureFlag[];
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
}) {
  return (
    <section className="flex min-h-0 flex-col space-y-3">
      <div className="shrink-0">
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          {title}
        </h2>
        <p className="mt-1 text-sm text-paper/50">{hint}</p>
      </div>
      {flags.length === 0 ? (
        <p className="text-sm text-paper/45">Brak flag w tej kategorii.</p>
      ) : (
        <div className="max-h-[min(50vh,28rem)] space-y-3 overflow-y-auto overscroll-contain border border-paper/10 bg-paper/[0.02] p-3">
          {flags.map((flag) => (
            <FlagRow
              key={flag.key}
              flag={flag}
              onToggle={onToggle}
              pending={pending}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type FlagsTabProps = {
  stableFlags: FeatureFlag[];
  experimentalFlags: FeatureFlag[];
  flagsLoading: boolean;
  totalFlags: number;
  rolloutStatuses: FlagRolloutStatus[];
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
};

export function FlagsTab({
  stableFlags,
  experimentalFlags,
  flagsLoading,
  totalFlags,
  rolloutStatuses,
  onToggle,
  pending,
}: FlagsTabProps) {
  return (
    <div className="space-y-8">
      <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
        <p>
          FE pyta backend o katalog flag (`GET /api/admin/flags`). Backend
          zwraca experimental + stable — UI buduje się z tej listy.
          Przełącznik zapisuje stan w DB (
          <span className="font-mono text-paper/80">
            PATCH /api/admin/flags/&#123;key&#125;
          </span>
          ). Flagi z <span className="font-mono text-paper/80">client_visible</span>{" "}
          trafiają też do witryny/paneli przez{" "}
          <span className="font-mono text-paper/80">/api/flags/public</span>.
        </p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {rolloutStatuses.map((status) => (
            <div key={status} className="flex items-start gap-2">
              <RolloutBadge status={status} />
              <span className="text-xs leading-snug text-paper/40">
                {FLAG_ROLLOUT_LABELS[status].hint}
              </span>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <FlagCategory
          title="Experimental"
          hint="Funkcje eksperymentalne / w trakcie rozwoju — domyślnie wyłączone."
          flags={experimentalFlags}
          onToggle={onToggle}
          pending={pending}
        />

        <FlagCategory
          title="Stable"
          hint="Funkcje produkcyjne — bezpieczne do włączania na żywo."
          flags={stableFlags}
          onToggle={onToggle}
          pending={pending}
        />
      </div>

      {totalFlags === 0 && !flagsLoading ? (
        <p className="text-sm text-paper/45">Brak flag w bazie.</p>
      ) : null}
    </div>
  );
}
