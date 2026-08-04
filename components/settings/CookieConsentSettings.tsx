"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_KEY,
  defaultConsent,
  necessaryOnlyConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";
import { useToast } from "@/components/toast/ToastProvider";

function formatDecidedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusLabel(consent: CookieConsentPreferences | null): string {
  if (!consent) return "Brak decyzji — baner pojawi się przy następnym wejściu";
  if (consent.functional && consent.analytics) return "Zaakceptowano wszystkie";
  if (!consent.functional && !consent.analytics) return "Tylko niezbędne";
  const parts: string[] = ["Niezbędne"];
  if (consent.functional) parts.push("funkcjonalne");
  if (consent.analytics) parts.push("analityczne");
  return parts.join(", ");
}

/**
 * Zarządzanie zgodą RODO / cookies w ustawieniach panelu.
 * Wycofanie opcjonalnych zgód = tylko niezbędne (analityka wyłączona).
 */
export function CookieConsentSettings({
  className,
  hideHeading = false,
}: {
  className?: string;
  /** Gdy true — bez własnego h2 (np. wewnątrz SettingsCategory). */
  hideHeading?: boolean;
}) {
  const toast = useToast();
  const functionalId = useId();
  const analyticsId = useId();
  const [consent, setConsent] = useState<CookieConsentPreferences | null>(null);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      const current = readCookieConsent();
      setConsent(current);
      setFunctional(current?.functional ?? false);
      setAnalytics(current?.analytics ?? false);
      setReady(true);
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

  function persist(next: CookieConsentPreferences, message: string) {
    writeCookieConsent(next);
    setConsent(next);
    setFunctional(next.functional);
    setAnalytics(next.analytics);
    toast.success(message);
  }

  function handleSave() {
    persist(
      defaultConsent({ functional, analytics }),
      "Zapisano preferencje prywatności.",
    );
  }

  function handleWithdraw() {
    persist(
      necessaryOnlyConsent(),
      "Wycofano zgody opcjonalne — pozostają tylko niezbędne.",
    );
  }

  const dirty =
    ready &&
    (functional !== (consent?.functional ?? false) ||
      analytics !== (consent?.analytics ?? false));

  const checkbox =
    "mt-1 size-4 shrink-0 accent-[var(--brand)] disabled:opacity-60";

  return (
    <section className={className}>
      {hideHeading ? null : (
        <h2 className="font-display text-sm tracking-[0.16em] text-paper/70 uppercase">
          Prywatność i cookies
        </h2>
      )}
      <p className={hideHeading ? "text-sm text-paper/55" : "mt-2 text-sm text-paper/55"}>
        Zarządzaj zgodami RODO. Analityka i preferencje opcjonalne możesz
        wycofać w każdej chwili. Szczegóły w{" "}
        <Link
          href="/polityka-prywatnosci"
          className="text-paper underline decoration-paper/30 underline-offset-2 hover:text-brand hover:decoration-brand"
        >
          Polityce prywatności
        </Link>
        .
      </p>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-paper/40">Status</dt>
          <dd className="mt-0.5 text-paper">
            {ready ? statusLabel(consent) : "…"}
          </dd>
        </div>
        <div>
          <dt className="text-paper/40">Ostatnia decyzja</dt>
          <dd className="mt-0.5 text-paper">
            {ready && consent ? formatDecidedAt(consent.decidedAt) : "—"}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-3">
        <li className="flex items-start gap-3 border border-paper/10 bg-chrome/20 px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[11px] tracking-[0.12em] text-paper uppercase">
              Niezbędne
            </p>
            <p className="mt-1 text-xs leading-relaxed text-paper/55">
              Sesja logowania i bezpieczeństwo paneli. Zawsze aktywne.
            </p>
          </div>
          <input type="checkbox" className={checkbox} checked disabled />
        </li>
        <li className="flex items-start gap-3 border border-paper/10 bg-chrome/20 px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={functionalId}
              className="font-display text-[11px] tracking-[0.12em] text-paper uppercase"
            >
              Funkcjonalne
            </label>
            <p className="mt-1 text-xs leading-relaxed text-paper/55">
              Preferencje wyświetlania witryny publicznej (motyw).
            </p>
          </div>
          <input
            id={functionalId}
            type="checkbox"
            className={checkbox}
            checked={functional}
            onChange={(e) => setFunctional(e.target.checked)}
          />
        </li>
        <li className="flex items-start gap-3 border border-paper/10 bg-chrome/20 px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={analyticsId}
              className="font-display text-[11px] tracking-[0.12em] text-paper uppercase"
            >
              Analityczne
            </label>
            <p className="mt-1 text-xs leading-relaxed text-paper/55">
              Vercel Analytics i Speed Insights — pomiary stron publicznych
              (panele nie są śledzone w Analytics).
            </p>
          </div>
          <input
            id={analyticsId}
            type="checkbox"
            className={checkbox}
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
        </li>
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={!dirty}
          onClick={handleSave}
          className="panel-control border border-brand/50 bg-brand/15 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Zapisz zgody
        </button>
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={
            ready &&
            consent !== null &&
            !consent.functional &&
            !consent.analytics
          }
          className="panel-control border border-paper/20 px-4 py-2 font-display text-[11px] tracking-[0.12em] text-paper/80 uppercase transition-colors hover:border-paper/40 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Wycofaj zgody opcjonalne
        </button>
      </div>
    </section>
  );
}
