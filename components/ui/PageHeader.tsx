import type { ReactNode } from "react";
import { BackLink } from "@/components/ui/BackLink";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Tylko widoki zagnieżdżone (edytor, DevTools, baza) — nie top-level moduły. */
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  titleSize?: "default" | "hero";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  onBack,
  titleSize = "default",
  className,
}: PageHeaderProps) {
  const titleClass =
    titleSize === "hero"
      ? "font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
      : "font-display text-3xl font-semibold uppercase";
  const hasLead = Boolean(eyebrow || backHref || onBack);

  return (
    <div className={className}>
      {backHref || onBack ? (
        <BackLink fallbackHref={backHref ?? "/"} onBack={onBack}>
          {backLabel}
        </BackLink>
      ) : null}
      {eyebrow ? (
        <p
          className={`font-display text-sm tracking-[0.22em] text-brand uppercase ${
            backHref || onBack ? "mt-3" : ""
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1 className={hasLead ? `mt-2 ${titleClass}` : titleClass}>{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-paper/55">{description}</p>
      ) : null}
    </div>
  );
}
