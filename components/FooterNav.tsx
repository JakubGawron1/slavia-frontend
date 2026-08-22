"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useListPublicFlags } from "@/lib/api/generated/default/default";
import { visibleSiteNav } from "@/lib/site-nav";

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
  const links = visibleSiteNav(flags, "footer");

  return (
    <ul className="mt-4 space-y-2 text-sm text-paper/75">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="hover:text-paper">
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/logowanie" className="hover:text-paper">
          Zaloguj się
        </Link>
      </li>
    </ul>
  );
}
