"use client";

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";
import { LoadingScene } from "@/components/loading/LoadingScene";
import { InlineStatus } from "@/components/ui/InlineStatus";

/** Ukrywa stronę (404), gdy publiczna flaga jest wyłączona. */
export function RequirePublicFlag({
  flag,
  children,
}: {
  flag: string;
  children: ReactNode;
}) {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const flags = flagsQuery.data?.data;

  if (flagsQuery.isPending) {
    return (
      <LoadingScene
        variant="inline"
        label="Moduł"
        hint="Sprawdzamy, czy ta sekcja jest włączona…"
      />
    );
  }

  if (flagsQuery.isError) {
    return (
      <InlineStatus kind="error">
        Nie udało się sprawdzić dostępu do modułu. Odśwież stronę.
      </InlineStatus>
    );
  }

  if (flags !== undefined && !isFlagEnabled(flags, flag)) {
    notFound();
  }

  return children;
}
