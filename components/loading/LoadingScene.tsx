import { ClubMark } from "@/components/ClubMark";

type LoadingSceneProps = {
  /** Pełny ekran / sekcja witryny / obszar treści w panelu */
  variant?: "full" | "section" | "inline";
  label?: string;
  hint?: string;
};

function LiftingBarbell({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse
        className="animate-loading-shadow"
        cx="160"
        cy="102"
        rx="72"
        ry="8"
        fill="currentColor"
        opacity="0.18"
      />
      <g className="animate-barbell-lift origin-center">
        <rect x="118" y="48" width="84" height="12" rx="2" fill="currentColor" />
        <rect x="78" y="36" width="18" height="36" rx="2" fill="#c8102e" />
        <rect x="58" y="30" width="16" height="48" rx="2" fill="#d8d4ce" />
        <rect x="40" y="38" width="14" height="32" rx="2" fill="#4a5560" />
        <rect x="224" y="36" width="18" height="36" rx="2" fill="#c8102e" />
        <rect x="246" y="30" width="16" height="48" rx="2" fill="#d8d4ce" />
        <rect x="266" y="38" width="14" height="32" rx="2" fill="#4a5560" />
        <circle cx="34" cy="54" r="7" stroke="currentColor" strokeWidth="3" />
        <circle cx="286" cy="54" r="7" stroke="currentColor" strokeWidth="3" />
      </g>
    </svg>
  );
}

const VARIANT_SHELL: Record<NonNullable<LoadingSceneProps["variant"]>, string> = {
  full: "relative isolate flex min-h-svh flex-1 flex-col overflow-hidden bg-chrome text-paper",
  section:
    "relative isolate flex min-h-[calc(100svh-10rem)] flex-1 flex-col overflow-hidden bg-chrome text-paper",
  inline:
    "relative isolate flex min-h-[40vh] flex-1 flex-col items-center justify-center overflow-hidden py-16 text-paper",
};

export function LoadingScene({
  variant = "full",
  label = "Ładowanie",
  hint = "Przygotowujemy pomost…",
}: LoadingSceneProps) {
  const showAtmosphere = variant !== "inline";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={VARIANT_SHELL[variant]}
    >
      {showAtmosphere ? (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(200,16,46,0.28),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(74,85,96,0.35),transparent_50%),linear-gradient(180deg,#0e1014_0%,#14161a_45%,#1a1f26_100%)]" />
          <div className="texture-noise absolute inset-0 opacity-[0.14] mix-blend-overlay" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/50 to-transparent" />
          <div className="absolute top-[18%] left-1/2 h-px w-[min(90vw,42rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-brand/50 to-transparent animate-pulse-line" />
        </div>
      ) : null}

      <div
        className={
          showAtmosphere
            ? "mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-16 text-center md:px-8"
            : "relative z-10 flex w-full max-w-sm flex-col items-center text-center"
        }
      >
        <div className="animate-rise flex items-center gap-3">
          <ClubMark className="h-12 w-auto" />
          <div className="text-left">
            <p className="font-display text-sm tracking-[0.2em] text-paper uppercase">
              CKS Slavia
            </p>
            <p className="text-xs tracking-wide text-paper/45">Ruda Śląska</p>
          </div>
        </div>

        <LiftingBarbell className="animate-rise-delay-1 mt-10 w-full max-w-68 text-paper md:max-w-xs" />

        <p className="animate-rise-delay-2 mt-8 font-display text-xs tracking-[0.28em] text-brand uppercase md:text-sm">
          {label}
        </p>
        <div className="animate-bar mt-3 h-1 w-16 bg-brand" />
        <p className="animate-rise-delay-3 mt-5 text-sm leading-relaxed text-paper/65 md:text-base">
          {hint}
        </p>

        <div
          className="animate-rise-delay-3 mt-8 flex items-center gap-1.5"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot [animation-delay:160ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot [animation-delay:320ms]" />
        </div>

        <span className="sr-only">{hint}</span>
      </div>
    </div>
  );
}
