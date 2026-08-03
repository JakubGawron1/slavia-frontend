"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  acceptAllConsent,
  COOKIE_SETTINGS_EVENT,
  defaultConsent,
  necessaryOnlyConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

type View = "hidden" | "banner" | "settings";

export function CookieConsentBanner() {
  const titleId = useId();
  const [view, setView] = useState<View>("hidden");
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = readCookieConsent();
    if (existing) {
      setFunctional(existing.functional);
      setAnalytics(existing.analytics);
      setView("hidden");
    } else {
      setView("banner");
    }

    function onOpenSettings() {
      const current = readCookieConsent();
      if (current) {
        setFunctional(current.functional);
        setAnalytics(current.analytics);
      }
      setView("settings");
    }

    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () =>
      window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  function persist(consent: CookieConsentPreferences) {
    writeCookieConsent(consent);
    setFunctional(consent.functional);
    setAnalytics(consent.analytics);
    setView("hidden");
  }

  function handleAcceptAll() {
    persist(acceptAllConsent());
  }

  function handleNecessaryOnly() {
    persist(necessaryOnlyConsent());
  }

  function handleSaveSettings() {
    persist(defaultConsent({ functional, analytics }));
  }

  if (view === "hidden") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent sm:from-black/40" />

      <div className="relative mx-auto max-w-3xl border border-paper/15 bg-chrome shadow-2xl">
        <div className="border-b border-paper/10 px-4 py-3 sm:px-5">
          <p className="font-display text-[0.65rem] tracking-[0.2em] text-brand uppercase">
            Pliki cookies
          </p>
          <h2
            id={titleId}
            className="mt-1 font-display text-lg tracking-wide text-paper uppercase sm:text-xl"
          >
            {view === "settings" ? "Ustawienia cookies" : "Zgoda na cookies"}
          </h2>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          {view === "banner" ? (
            <p className="text-sm leading-relaxed text-paper/70">
              Używamy niezbędnych plików cookies do działania strony i
              logowania. Za Twoją zgodą możemy też zapisać preferencje
              wyświetlania oraz zbierać anonimowe statystyki odwiedzin i
              wydajności (Vercel Analytics, Speed Insights). Zgodę zmienisz
              później w stopce witryny lub w ustawieniach konta. Szczegóły w{" "}
              <Link
                href="/polityka-prywatnosci"
                className="text-paper underline decoration-paper/30 underline-offset-2 hover:text-brand hover:decoration-brand"
              >
                Polityce prywatności
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-paper/70">
                Wybierz kategorie, na które wyrażasz zgodę. Zgodę możesz zmienić
                w stopce witryny lub w ustawieniach konta po zalogowaniu.
              </p>

              <ul className="space-y-3">
                <ConsentCategory
                  title="Niezbędne"
                  description="Sesja logowania, bezpieczeństwo i podstawowe działanie witryny. Zawsze aktywne."
                  checked
                  locked
                />
                <ConsentCategory
                  title="Funkcjonalne"
                  description="Zapamiętanie preferencji, np. motywu jasnego/ciemnego."
                  checked={functional}
                  onChange={setFunctional}
                />
                <ConsentCategory
                  title="Analityczne"
                  description="Vercel Analytics i Speed Insights — anonimowe pomiary odwiedzin i wydajności stron publicznych."
                  checked={analytics}
                  onChange={setAnalytics}
                />
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-paper/10 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:px-5">
          {view === "banner" ? (
            <>
              <button
                type="button"
                onClick={() => setView("settings")}
                className="order-3 border border-paper/20 px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper/75 uppercase transition-colors hover:border-paper/40 hover:text-paper sm:order-1 sm:mr-auto"
              >
                Ustawienia
              </button>
              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="order-2 border border-paper/20 px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:border-paper/40"
              >
                Tylko niezbędne
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="order-1 bg-brand px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand-deep sm:order-3"
              >
                Akceptuj wszystkie
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  setView(readCookieConsent() ? "hidden" : "banner")
                }
                className="border border-paper/20 px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper/75 uppercase transition-colors hover:border-paper/40 hover:text-paper sm:mr-auto"
              >
                Wróć
              </button>
              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="border border-paper/20 px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:border-paper/40"
              >
                Tylko niezbędne
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="bg-brand px-4 py-2.5 font-display text-xs tracking-[0.14em] text-paper uppercase transition-colors hover:bg-brand-deep"
              >
                Zapisz wybór
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsentCategory({
  title,
  description,
  checked,
  locked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <li className="flex items-start gap-3 border border-paper/10 bg-surface/40 px-3.5 py-3">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="font-display text-sm tracking-wide text-paper uppercase"
        >
          {title}
        </label>
        <p className="mt-1 text-xs leading-relaxed text-paper/55">
          {description}
        </p>
      </div>
      <input
        id={id}
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-[var(--brand)] disabled:opacity-60"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </li>
  );
}
