"use client";

import { useState } from "react";
import type { AuthUser, Role } from "@/lib/auth";
import type { ViewAsState } from "@/components/klub/KlubProvider";
import { getStoredToken } from "@/lib/auth";
import { DebugActionsPanel } from "./DebugActionsPanel";
import { DebugEnvPanel } from "./DebugEnvPanel";
import { DebugStoragePanel } from "./DebugStoragePanel";
import { TestEmailPanel } from "./TestEmailPanel";
import { maskToken } from "./debugCopy";

type DebugTabProps = {
  apiBaseUrl: string;
  health: string;
  healthLatencyMs: number | null;
  activeRole: Role;
  viewAs: ViewAsState;
  user: AuthUser | null;
  storedUser: AuthUser | null;
  tokenPresent: boolean;
  platformVersion: string;
  onError: (msg: string | null) => void;
  onHealthUpdate: (payload: { latencyMs: number; body: string }) => void;
};

export function DebugTab({
  apiBaseUrl,
  health,
  healthLatencyMs,
  activeRole,
  viewAs,
  user,
  storedUser,
  tokenPresent,
  platformVersion,
  onError,
  onHealthUpdate,
}: DebugTabProps) {
  const [tokenPeek] = useState(() => maskToken(getStoredToken()));

  const sessionDump = {
    api: apiBaseUrl,
    health,
    healthLatencyMs,
    activeRole,
    viewAs,
    user: user ?? storedUser,
    tokenPresent,
    tokenPeek,
    platformVersion,
  };

  return (
    <div className="space-y-6">
      <pre className="overflow-x-auto border border-paper/10 bg-chrome/50 p-4 text-xs leading-relaxed text-paper/75">
        {JSON.stringify(sessionDump, null, 2)}
      </pre>

      <DebugActionsPanel
        sessionDump={sessionDump}
        onError={onError}
        onHealthPing={onHealthUpdate}
      />

      <DebugStoragePanel onError={onError} />

      <DebugEnvPanel />

      <TestEmailPanel
        defaultEmail={user?.email ?? storedUser?.email ?? ""}
        onError={onError}
      />
    </div>
  );
}
