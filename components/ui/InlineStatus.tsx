import type { ReactNode } from "react";

type InlineStatusProps = {
  kind: "loading" | "error";
  children: ReactNode;
  className?: string;
};

/** Kompaktowy status listy — loading nie myli się z pustką; błąd w alercie brand. */
export function InlineStatus({ kind, children, className }: InlineStatusProps) {
  if (kind === "error") {
    return (
      <p
        className={
          className ??
          "border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
        }
        role="alert"
      >
        {children}
      </p>
    );
  }

  return (
    <p
      className={
        className ??
        "flex items-center gap-2 py-4 text-sm text-paper/50"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="flex items-center gap-1" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot [animation-delay:160ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-loading-dot [animation-delay:320ms]" />
      </span>
      {children}
    </p>
  );
}
