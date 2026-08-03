import Link from "next/link";
import type { ReactNode } from "react";
import { ClubMark } from "@/components/ClubMark";

type ErrorSceneProps = {
  code: string;
  eyebrow: string;
  title: string;
  joke: string;
  hint?: string;
  technical?: {
    message?: string;
    digest?: string;
  };
  actions?: ReactNode;
};

function FailedBarbell({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="animate-barbell-wobble origin-center">
        <rect x="118" y="34" width="84" height="12" rx="2" fill="#f7f5f2" />
        <rect x="78" y="22" width="18" height="36" rx="2" fill="#c8102e" />
        <rect x="58" y="16" width="16" height="48" rx="2" fill="#d8d4ce" />
        <rect x="40" y="24" width="14" height="32" rx="2" fill="#4a5560" />
        <rect x="224" y="22" width="18" height="36" rx="2" fill="#c8102e" />
        <rect x="246" y="16" width="16" height="48" rx="2" fill="#d8d4ce" />
        <rect x="266" y="24" width="14" height="32" rx="2" fill="#4a5560" />
        <circle cx="34" cy="40" r="7" stroke="#f7f5f2" strokeWidth="3" />
        <circle cx="286" cy="40" r="7" stroke="#f7f5f2" strokeWidth="3" />
      </g>
      <path
        d="M148 62c8 10 16 10 24 0"
        stroke="#c8102e"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function ErrorScene({
  code,
  eyebrow,
  title,
  joke,
  hint,
  technical,
  actions,
}: ErrorSceneProps) {
  const hasTechnical =
    Boolean(technical?.message?.trim()) || Boolean(technical?.digest?.trim());

  return (
    <div className="relative isolate flex min-h-[100svh] flex-1 flex-col overflow-hidden bg-chrome text-paper">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(200,16,46,0.28),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(74,85,96,0.35),transparent_50%),linear-gradient(180deg,#0e1014_0%,#14161a_45%,#1a1f26_100%)]" />
        <div className="texture-noise absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-[18%] left-1/2 h-px w-[min(90vw,42rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/50 to-transparent animate-pulse-line" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-16 md:px-8 md:py-20">
        <div className="animate-rise flex items-center gap-3">
          <ClubMark className="h-10 w-10 text-brand" />
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-paper uppercase">
              CKS Slavia
            </p>
            <p className="text-xs tracking-wide text-paper/45">Ruda Śląska</p>
          </div>
        </div>

        <p className="animate-rise-delay-1 mt-10 font-display text-xs tracking-[0.28em] text-brand uppercase md:text-sm">
          {eyebrow}
        </p>
        <div className="animate-bar mt-3 h-1 w-20 bg-brand" />

        <p
          className="animate-rise-delay-1 mt-6 font-display text-[clamp(4.5rem,18vw,8.5rem)] leading-none font-extrabold tracking-tight text-paper/12 select-none"
          aria-hidden="true"
        >
          {code}
        </p>

        <FailedBarbell className="animate-rise-delay-2 -mt-6 w-full max-w-xs text-paper md:-mt-8 md:max-w-sm" />

        <h1 className="animate-rise-delay-2 mt-8 max-w-2xl font-display text-3xl leading-[1.05] font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="animate-rise-delay-3 mt-5 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
          {joke}
        </p>
        {hint ? (
          <p className="animate-rise-delay-3 mt-3 max-w-xl text-sm text-paper/50">
            {hint}
          </p>
        ) : null}

        <div className="animate-rise-delay-3 mt-10 flex flex-wrap gap-3">
          {actions ?? (
            <Link
              href="/"
              className="bg-brand px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep"
            >
              Wróć na pomost
            </Link>
          )}
        </div>

        {hasTechnical ? (
          <details className="animate-rise-delay-3 group mt-12 border-t border-paper/10 pt-6">
            <summary className="cursor-pointer list-none font-display text-xs tracking-[0.18em] text-paper/45 uppercase transition-colors hover:text-paper/70 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                Dane techniczne
                <span className="text-brand transition-transform group-open:rotate-90">
                  ›
                </span>
              </span>
            </summary>
            <div className="mt-4 space-y-3 rounded-sm bg-paper/5 px-4 py-4 font-mono text-xs leading-relaxed text-paper/65">
              {technical?.message ? (
                <p>
                  <span className="text-paper/40">message: </span>
                  {technical.message}
                </p>
              ) : null}
              {technical?.digest ? (
                <p>
                  <span className="text-paper/40">digest: </span>
                  {technical.digest}
                </p>
              ) : null}
            </div>
          </details>
        ) : null}
      </div>
    </div>
  );
}
