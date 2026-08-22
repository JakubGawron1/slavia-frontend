"use client";

import { AiSettingsTab } from "@/components/klub/devtools/AiSettingsTab";
import { ChangelogPanel } from "@/components/klub/devtools/ChangelogPanel";
import { DebugTab } from "@/components/klub/devtools/DebugTab";
import { FlagsTab } from "@/components/klub/devtools/FlagsTab";
import { ReactQueryDevtoolsTab } from "@/components/klub/devtools/ReactQueryDevtoolsTab";
import { RoutesTab } from "@/components/klub/devtools/RoutesTab";
import { StatsTab } from "@/components/klub/devtools/StatsTab";
import { useDevTools } from "@/components/klub/devtools/useDevTools";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DevToolsPage() {
  const d = useDevTools();

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Narzędzia"
        title="DevTools"
        backHref="/klub"
      />

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
          flags={d.flags}
          flagsLoading={d.flagsLoading}
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
