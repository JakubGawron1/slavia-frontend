"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_KEY,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";

/**
 * Vercel Analytics + Speed Insights — dopiero po zgodzie „analityczne”.
 * Panele `/klub` i `/panel` są pomijane w Analytics (ruch wewnętrzny).
 */
export function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      setEnabled(hasAnalyticsConsent());
    }

    sync();

    function onStorage(event: StorageEvent) {
      if (event.key === COOKIE_CONSENT_KEY || event.key === null) sync();
    }

    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Analytics
        beforeSend={(event: BeforeSendEvent) => {
          if (!hasAnalyticsConsent()) return null;
          try {
            const path = new URL(event.url, window.location.origin).pathname;
            if (path.startsWith("/klub") || path.startsWith("/panel")) {
              return null;
            }
          } catch {
            return null;
          }
          return event;
        }}
      />
      <SpeedInsights />
    </>
  );
}
