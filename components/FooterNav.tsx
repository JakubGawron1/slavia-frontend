"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";

/** Nawigacja stopki zależna od flag — Client Component (unikamy mismatch SSR). */
export function FooterNav() {
  const flagsQuery = useListPublicFlags({ query: { staleTime: 60_000 } });
  const [flagsReady, setFlagsReady] = useState(false);

  useEffect(() => {
    if (flagsQuery.isFetched || flagsQuery.isError) {
      setFlagsReady(true);
    }
  }, [flagsQuery.isFetched, flagsQuery.isError]);

  const flags = flagsReady ? flagsQuery.data?.data : undefined;
  const blogEnabled = isFlagEnabled(flags, "public_blog");
  const announcementsEnabled = isFlagEnabled(flags, "announcements_board");
  const calendarEnabled = isFlagEnabled(flags, "public_calendar");

  return (
    <ul className="mt-4 space-y-2 text-sm text-paper/75">
      {blogEnabled ? (
        <li>
          <Link href="/blog" className="hover:text-paper">
            Aktualności
          </Link>
        </li>
      ) : null}
      <li>
        <Link href="/zawodnicy" className="hover:text-paper">
          Zawodnicy
        </Link>
      </li>
      {calendarEnabled ? (
        <li>
          <Link href="/kalendarz" className="hover:text-paper">
            Kalendarz
          </Link>
        </li>
      ) : null}
      {announcementsEnabled ? (
        <li>
          <Link href="/ogloszenia" className="hover:text-paper">
            Tablica ogłoszeń
          </Link>
        </li>
      ) : null}
      <li>
        <Link href="/kontakt" className="hover:text-paper">
          Kontakt
        </Link>
      </li>
      <li>
        <Link href="/logowanie" className="hover:text-paper">
          Zaloguj się
        </Link>
      </li>
    </ul>
  );
}
