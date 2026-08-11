"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { getApiBaseUrl, getStoredToken, getStoredUser } from "@/lib/auth";
import { KLUB_NAV, PUBLIC_ROUTE_MAP } from "@/lib/klub-nav";
import { FLAG_ROLLOUT_LABELS } from "@/lib/feature-flags-meta";
import { useKlub } from "@/components/klub/KlubProvider";
import { useToast } from "@/components/toast/ToastProvider";
import {
  getListFlagsQueryKey,
  getListPublicFlagsQueryKey,
  useListFlags,
  useSiteStats,
  useUpdateFlag,
} from "@/lib/api/generated/default/default";
import { useHealth } from "@/lib/api/generated/admin/admin";
import type {
  FeatureFlag,
  FlagKind,
  FlagRolloutStatus,
  SiteStats,
} from "@/lib/api/generated/models";
import {
  CHANGELOG_CATEGORIES,
  changelogByCategory,
  type ChangelogEntry,
} from "@/lib/changelog";
import { SLAVIA_VERSION } from "@/lib/version";

type Tab = "flags" | "stats" | "routes" | "debug" | "changelog";

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

function flagsByKind(flags: FeatureFlag[], kind: FlagKind): FeatureFlag[] {
  return flags.filter((f) => f.kind === kind);
}

export default function DevToolsPage() {
  const toast = useToast();
  const { user, activeRole, viewAs } = useKlub();
  const [tab, setTab] = useState<Tab>("flags");
  const [actionError, setActionError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const flagsQuery = useListFlags({ query: { enabled: tab === "flags" } });
  const statsQuery = useSiteStats({ query: { enabled: tab === "stats" } });
  const healthQuery = useHealth({ query: { enabled: tab === "debug" } });
  const updateFlagMutation = useUpdateFlag();

  const flags = (flagsQuery.data?.data as FeatureFlag[] | undefined) ?? [];
  const stableFlags = flagsByKind(flags, "stable");
  const experimentalFlags = flagsByKind(flags, "experimental");
  const stats = (statsQuery.data?.data as SiteStats | undefined) ?? null;
  const health = healthQuery.data
    ? JSON.stringify(healthQuery.data.data)
    : healthQuery.isError
      ? "Błąd połączenia"
      : "—";

  const queryError = flagsQuery.error ?? statsQuery.error ?? healthQuery.error;
  const error =
    actionError ??
    (queryError instanceof Error ? queryError.message : null);

  async function toggleFlag(flag: FeatureFlag) {
    setActionError(null);
    try {
      await updateFlagMutation.mutateAsync({
        key: flag.key,
        data: { enabled: !flag.enabled },
      });
      await queryClient.invalidateQueries({
        queryKey: getListFlagsQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getListPublicFlagsQueryKey(),
      });
      toast.success(
        flag.enabled ? "Wyłączono flagę" : "Włączono flagę",
        flag.label,
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się przełączyć";
      setActionError(msg);
      toast.error("Flaga", msg);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "flags", label: "Flagi" },
    { id: "stats", label: "Statystyki" },
    { id: "routes", label: "Mapa tras" },
    { id: "changelog", label: "Changelog" },
    { id: "debug", label: "Debug" },
  ];

  const klubRoutes = [
    { path: "/klub", label: "Pulpit" },
    ...KLUB_NAV.flatMap((c) =>
      c.items.map((i) => ({ path: i.href, label: i.label })),
    ),
  ];

  const rolloutStatuses = Object.keys(FLAG_ROLLOUT_LABELS) as FlagRolloutStatus[];

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          DevTools
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/60 uppercase"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {tab === "flags" ? (
        <div className="space-y-8">
          <div className="border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/60">
            <p>
              FE pyta backend o katalog flag (`GET /api/admin/flags`). Backend
              zwraca experimental + stable — UI buduje się z tej listy.
              Przełącznik zapisuje stan w DB (
              <span className="font-mono text-paper/80">
                PATCH /api/admin/flags/&#123;key&#125;
              </span>
              ). Flagi z{" "}
              <span className="font-mono text-paper/80">client_visible</span>{" "}
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
              onToggle={(f) => void toggleFlag(f)}
              pending={updateFlagMutation.isPending}
            />

            <FlagCategory
              title="Stable"
              hint="Funkcje produkcyjne — bezpieczne do włączania na żywo."
              flags={stableFlags}
              onToggle={(f) => void toggleFlag(f)}
              pending={updateFlagMutation.isPending}
            />
          </div>

          {flags.length === 0 && !flagsQuery.isLoading ? (
            <p className="text-sm text-paper/45">Brak flag w bazie.</p>
          ) : null}
        </div>
      ) : null}

      {tab === "stats" && stats ? (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Konta", stats.users],
              ["Aktywne konta", stats.active_users],
              ["Profile zawodników", stats.athlete_profiles],
              ["Strony CMS", stats.cms_pages],
              ["CMS opublikowane", stats.cms_published],
              ["Wyniki (łącznie)", stats.results_total],
              ["Wyniki oczekujące", stats.results_pending],
              ["Flagi", stats.feature_flags],
              ["Logi", stats.system_logs],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border border-paper/10 bg-paper/[0.03] px-4 py-3">
              <dt className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                {label}
              </dt>
              <dd className="mt-1 font-display text-2xl">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {tab === "routes" ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
              Publiczne
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {PUBLIC_ROUTE_MAP.map((r) => (
                <li key={r.path} className="font-mono text-paper/70">
                  {r.path}{" "}
                  <span className="font-sans text-paper/40">— {r.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
              Panel /klub
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {klubRoutes.map((r) => (
                <li key={r.path} className="font-mono text-paper/70">
                  {r.path}{" "}
                  <span className="font-sans text-paper/40">— {r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "changelog" ? <ChangelogPanel /> : null}

      {tab === "debug" ? (
        <div className="space-y-6">
          <pre className="overflow-x-auto border border-paper/10 bg-chrome/50 p-4 text-xs leading-relaxed text-paper/75">
            {JSON.stringify(
              {
                api: getApiBaseUrl(),
                health,
                activeRole,
                viewAs,
                user: user ?? getStoredUser(),
                tokenPresent: Boolean(getStoredToken()),
                platformVersion: SLAVIA_VERSION,
              },
              null,
              2,
            )}
          </pre>

          <TestEmailPanel
            defaultEmail={user?.email ?? getStoredUser()?.email ?? ""}
            onError={setActionError}
          />
        </div>
      ) : null}
    </div>
  );
}

function TestEmailPanel({
  defaultEmail,
  onError,
}: {
  defaultEmail: string;
  onError: (msg: string | null) => void;
}) {
  const toast = useToast();
  const [email, setEmail] = useState(defaultEmail);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function sendTest(e: FormEvent) {
    e.preventDefault();
    onError(null);
    setResult(null);
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      onError("Podaj poprawny adres e-mail.");
      return;
    }
    setPending(true);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Brak sesji.");
      const response = await fetch(
        `${getApiBaseUrl()}/api/admin/debug/send-test-email`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: trimmed }),
        },
      );
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        delivered?: boolean;
        to?: string;
      };
      if (!response.ok) {
        throw new Error(body.error ?? `Błąd serwera (${response.status})`);
      }
      const msg = body.message ?? `Wysłano na ${body.to ?? trimmed}`;
      setResult(msg);
      toast.success("Test e-mail", msg);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się wysłać testu.";
      onError(msg);
      toast.error("Test e-mail", msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Test e-mail (Brevo)
      </h2>
      <p className="mt-2 text-sm text-paper/55">
        Wysyła prostą wiadomość testową przez Brevo (flaga{" "}
        <span className="font-mono text-paper/70">email_test</span>).{" "}
        <span className="font-mono text-paper/70">EMAIL_FROM</span> musi być
        zweryfikowanym senderem w Brevo (bez domeny zwykle Twój Gmail z konta).
        Przy{" "}
        <span className="font-mono text-paper/70">EMAIL_ENABLED=false</span>{" "}
        backend tylko loguje treść.
      </p>
      <form
        onSubmit={(ev) => void sendTest(ev)}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="debug-test-email"
            className="mb-1.5 block font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase"
          >
            Adres odbiorcy
          </label>
          <input
            id="debug-test-email"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            disabled={pending}
            required
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 text-sm text-paper outline-none focus:border-brand disabled:opacity-60"
            placeholder="twoj@email.pl"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:opacity-50"
        >
          {pending ? "Wysyłanie…" : "Wyślij test"}
        </button>
      </form>
      {result ? (
        <p className="mt-3 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-paper">
          {result}
        </p>
      ) : null}
    </section>
  );
}

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

function ChangelogPanel() {
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
