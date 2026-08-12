"use client";

import { AiSettingsTab } from "@/components/klub/devtools/AiSettingsTab";
import { ChangelogPanel } from "@/components/klub/devtools/ChangelogPanel";
import { DebugTab } from "@/components/klub/devtools/DebugTab";
import { FlagsTab } from "@/components/klub/devtools/FlagsTab";
import { ReactQueryDevtoolsTab } from "@/components/klub/devtools/ReactQueryDevtoolsTab";
import { RoutesTab } from "@/components/klub/devtools/RoutesTab";
import { StatsTab } from "@/components/klub/devtools/StatsTab";
import { useDevTools } from "@/components/klub/devtools/useDevTools";
import { BackLink } from "@/components/ui/BackLink";

export default function DevToolsPage() {
  const d = useDevTools();

  return (
    <div className="animate-rise max-w-5xl space-y-6">
      <div>
        <BackLink fallbackHref="/klub" />
        <p className="mt-3 font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          DevTools
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {d.tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => d.setTab(t.id)}
            className={
              d.tab === t.id
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] uppercase"
                : "border border-paper/20 px-3 py-1.5 font-display text-[11px] tracking-[0.12em] text-paper/60 uppercase"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {d.error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {d.error}
        </p>
      ) : null}

      {d.tab === "flags" ? (
        <FlagsTab
          stableFlags={d.stableFlags}
          experimentalFlags={d.experimentalFlags}
          flagsLoading={d.flagsLoading}
          totalFlags={d.flags.length}
          rolloutStatuses={d.rolloutStatuses}
          onToggle={d.toggleFlag}
          pending={d.togglePending}
        />
      ) : null}

      {d.tab === "ai" ? <AiSettingsTab /> : null}

      {d.tab === "stats" && d.stats ? <StatsTab stats={d.stats} /> : null}

      {d.tab === "routes" ? (
        <RoutesTab publicRoutes={d.publicRoutes} klubRoutes={d.klubRoutes} />
      ) : null}

      {d.tab === "changelog" ? <ChangelogPanel /> : null}

      {d.tab === "rq" ? <ReactQueryDevtoolsTab /> : null}

      {d.tab === "debug" ? (
        <DebugTab
          apiBaseUrl={d.apiBaseUrl}
          health={d.health}
          healthLatencyMs={d.healthLatencyMs}
          activeRole={d.activeRole}
          viewAs={d.viewAs}
          user={d.user}
          storedUser={d.storedUser}
          tokenPresent={d.tokenPresent}
          platformVersion={d.platformVersion}
          onError={d.setActionError}
          onHealthUpdate={d.onHealthUpdate}
        />
      ) : null}
    </div>
  );
}
