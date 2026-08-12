"use client";

import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

/** Osadzony panel cache React Query w /klub/devtools. */
export function ReactQueryDevtoolsTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-paper/70">
        Podgląd zapytań, cache i invalidacji (TanStack Query). Przydatne przy
        view-as i debugowaniu list.
      </p>
      <div className="h-[480px] overflow-auto border border-paper/20 bg-chrome/40">
        <ReactQueryDevtoolsPanel style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
