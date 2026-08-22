"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import {
  FLAG_AUDIENCE_LABELS,
  FLAG_KIND_LABELS,
  FLAG_ROLLOUT_LABELS,
} from "@/lib/feature-flags-meta";
import type { FeatureFlag, FlagModule } from "@/lib/api/generated/models";
import { FlagsLegend } from "@/components/klub/devtools/FlagsLegend";
import {
  canToggle,
  FlagRow,
} from "@/components/klub/devtools/FlagRow";
import { queryActive } from "@/components/klub/devtools/FlagBadges";

const MODULES: { id: FlagModule; label: string }[] = [
  { id: "witryna", label: "Witryna" },
  { id: "kalendarz", label: "Kalendarz" },
  { id: "trening", label: "Trening" },
  { id: "komunikacja", label: "Komunikacja" },
  { id: "ui", label: "UI" },
];

function flagSearchHaystack(flag: FeatureFlag): string {
  const rollout = FLAG_ROLLOUT_LABELS[flag.rollout_status];
  const moduleLabel =
    MODULES.find((m) => m.id === flag.module)?.label ?? flag.module;
  const parts = [
    flag.label,
    flag.key,
    flag.description,
    flag.module,
    moduleLabel,
    flag.kind,
    FLAG_KIND_LABELS[flag.kind].label,
    flag.audience,
    FLAG_AUDIENCE_LABELS[flag.audience].label,
    flag.rollout_status,
    rollout.label,
    flag.enabled ? "włączone" : "wyłączone",
  ];
  if (!canToggle(flag)) parts.push("w przygotowaniu");
  return parts.join(" ").toLowerCase();
}

type FlagsTabProps = {
  flags: FeatureFlag[];
  flagsLoading: boolean;
  onToggle: (flag: FeatureFlag) => void;
  pending: boolean;
};

export function FlagsTab({
  flags,
  flagsLoading,
  onToggle,
  pending,
}: FlagsTabProps) {
  const [moduleFilter, setModuleFilter] = useState<FlagModule | "all">("all");
  const [q, setQ] = useState("");

  function onBadgeSearch(term: string) {
    setQ((prev) => (queryActive(prev, term) ? "" : term));
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return flags.filter((f) => {
      if (moduleFilter !== "all" && f.module !== moduleFilter) return false;
      if (!needle) return true;
      return flagSearchHaystack(f).includes(needle);
    });
  }, [flags, moduleFilter, q]);

  const byModule = useMemo(() => {
    const map = new Map<FlagModule, FeatureFlag[]>();
    for (const mod of MODULES) map.set(mod.id, []);
    for (const flag of filtered) {
      const list = map.get(flag.module) ?? [];
      list.push(flag);
      map.set(flag.module, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-8">
      <FlagsLegend query={q} onBadgeSearch={onBadgeSearch} />

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={moduleFilter === "all"}
          onClick={() => setModuleFilter("all")}
          label="Wszystkie"
        />
        {MODULES.map((m) => (
          <FilterChip
            key={m.id}
            active={moduleFilter === m.id}
            onClick={() => setModuleFilter(m.id)}
            label={m.label}
          />
        ))}
        <label className="ml-auto text-sm text-paper/60">
          Szukaj
          <input
            className="mt-1 w-full min-w-[12rem] border border-paper/20 bg-chrome/60 px-3 py-1.5 text-sm outline-none focus:border-brand sm:w-56"
            value={q}
            placeholder="nazwa, klucz, badge…"
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      {flagsLoading ? (
        <p className="text-sm text-paper/45">Ładowanie flag…</p>
      ) : flags.length === 0 ? (
        <p className="text-sm text-paper/45">Brak flag w bazie.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-paper/45">
          Brak flag pasujących do wyszukiwania.
        </p>
      ) : (
        MODULES.filter(
          (m) => moduleFilter === "all" || moduleFilter === m.id,
        ).map((m) => {
          const items = byModule.get(m.id) ?? [];
          if (items.length === 0) return null;
          const live = items.filter(canToggle);
          const stable = live.filter((f) => f.kind !== "experimental");
          const experimental = live.filter((f) => f.kind === "experimental");
          const planned = items.filter((f) => !canToggle(f));
          return (
            <section key={m.id} className="space-y-3">
              <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
                {m.label}
              </h2>
              {stable.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-display text-[10px] tracking-[0.14em] text-paper/35 uppercase">
                    Stabilne
                  </p>
                  {stable.map((flag) => (
                    <FlagRow
                      key={flag.key}
                      flag={flag}
                      onToggle={onToggle}
                      pending={pending}
                      query={q}
                      onBadgeSearch={onBadgeSearch}
                    />
                  ))}
                </div>
              ) : null}
              {experimental.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-display text-[10px] tracking-[0.14em] text-paper/35 uppercase">
                    Eksperymentalne — testy na żywych kontach
                  </p>
                  {experimental.map((flag) => (
                    <FlagRow
                      key={flag.key}
                      flag={flag}
                      onToggle={onToggle}
                      pending={pending}
                      query={q}
                      onBadgeSearch={onBadgeSearch}
                    />
                  ))}
                </div>
              ) : null}
              {planned.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-display text-[10px] tracking-[0.14em] text-paper/35 uppercase">
                    W przygotowaniu
                  </p>
                  {planned.map((flag) => (
                    <FlagRow
                      key={flag.key}
                      flag={flag}
                      onToggle={onToggle}
                      pending={pending}
                      query={q}
                      onBadgeSearch={onBadgeSearch}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}
