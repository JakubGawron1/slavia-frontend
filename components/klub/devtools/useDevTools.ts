"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { SLAVIA_VERSION } from "@/lib/version";

export type DevToolsTab = "flags" | "stats" | "routes" | "debug" | "changelog";

export function flagsByKind(flags: FeatureFlag[], kind: FlagKind): FeatureFlag[] {
  return flags.filter((f) => f.kind === kind);
}

export function useDevTools() {
  const toast = useToast();
  const { user, activeRole, viewAs } = useKlub();
  const [tab, setTab] = useState<DevToolsTab>("flags");
  const [actionError, setActionError] = useState<string | null>(null);
  const [healthOverride, setHealthOverride] = useState<string | null>(null);
  const [healthLatencyMs, setHealthLatencyMs] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const flagsQuery = useListFlags({ query: { enabled: tab === "flags" } });
  const statsQuery = useSiteStats({ query: { enabled: tab === "stats" } });
  const healthQuery = useHealth({ query: { enabled: tab === "debug" } });
  const updateFlagMutation = useUpdateFlag();

  const flags = (flagsQuery.data?.data as FeatureFlag[] | undefined) ?? [];
  const stableFlags = flagsByKind(flags, "stable");
  const experimentalFlags = flagsByKind(flags, "experimental");
  const stats = (statsQuery.data?.data as SiteStats | undefined) ?? null;
  const health =
    healthOverride ??
    (healthQuery.data
      ? JSON.stringify(healthQuery.data.data)
      : healthQuery.isError
        ? "Błąd połączenia"
        : "—");

  function onHealthUpdate(payload: { latencyMs: number; body: string }) {
    setHealthOverride(payload.body);
    setHealthLatencyMs(payload.latencyMs);
  }

  const queryError = flagsQuery.error ?? statsQuery.error ?? healthQuery.error;
  const error =
    actionError ?? (queryError instanceof Error ? queryError.message : null);

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

  const tabs: { id: DevToolsTab; label: string }[] = [
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

  return {
    user,
    activeRole,
    viewAs,
    tab,
    setTab,
    tabs,
    error,
    setActionError,
    stableFlags,
    experimentalFlags,
    flags,
    flagsLoading: flagsQuery.isLoading,
    stats,
    health,
    healthLatencyMs,
    onHealthUpdate,
    publicRoutes: PUBLIC_ROUTE_MAP,
    klubRoutes,
    rolloutStatuses,
    toggleFlag: (flag: FeatureFlag) => void toggleFlag(flag),
    togglePending: updateFlagMutation.isPending,
    platformVersion: SLAVIA_VERSION,
    apiBaseUrl: getApiBaseUrl(),
    tokenPresent: Boolean(getStoredToken()),
    storedUser: getStoredUser(),
  };
}
