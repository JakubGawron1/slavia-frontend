"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Po zmianie podglądu konta czyści cache React Query —
 * inaczej panel/klub zostają na danych poprzedniego użytkownika
 * (klucze Orval nie zawierają viewAsUserId).
 */
export function useInvalidateQueriesOnViewAs(viewAsUserId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
  }, [viewAsUserId, queryClient]);
}
