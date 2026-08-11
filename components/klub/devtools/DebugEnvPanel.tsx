"use client";

import { useEffect, useState } from "react";

type EnvSnapshot = {
  href: string;
  userAgent: string;
  language: string;
  languages: string;
  online: boolean;
  timezone: string;
  viewport: string;
  devicePixelRatio: number;
  cookiesEnabled: boolean;
  platform: string;
};

function readEnv(): EnvSnapshot {
  return {
    href: window.location.href,
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(", ") ?? navigator.language,
    online: navigator.onLine,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    cookiesEnabled: navigator.cookieEnabled,
    platform: navigator.platform,
  };
}

export function DebugEnvPanel() {
  const [env, setEnv] = useState<EnvSnapshot | null>(null);

  useEffect(() => {
    setEnv(readEnv());
    const onResize = () => setEnv(readEnv());
    const onOnline = () => setEnv(readEnv());
    window.addEventListener("resize", onResize);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOnline);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOnline);
    };
  }, []);

  if (!env) {
    return (
      <section className="border border-paper/10 bg-paper/[0.03] p-5">
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Środowisko przeglądarki
        </h2>
        <p className="mt-2 text-sm text-paper/45">Ładowanie…</p>
      </section>
    );
  }

  const rows: [string, string][] = [
    ["URL", env.href],
    ["Online", env.online ? "tak" : "nie"],
    ["Strefa", env.timezone],
    ["Język", env.language],
    ["Języki", env.languages],
    ["Viewport", env.viewport],
    ["DPR", String(env.devicePixelRatio)],
    ["Platforma", env.platform],
    ["Cookies", env.cookiesEnabled ? "włączone" : "wyłączone"],
    ["UA", env.userAgent],
  ];

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Środowisko przeglądarki
      </h2>
      <dl className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 border-b border-paper/5 pb-2 sm:grid-cols-[8rem_1fr] sm:gap-3"
          >
            <dt className="font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase">
              {label}
            </dt>
            <dd className="break-all font-mono text-[11px] text-paper/75">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
