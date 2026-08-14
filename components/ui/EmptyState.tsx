import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={
        className ??
        "border border-paper/10 bg-paper/[0.03] px-4 py-6 text-sm text-paper/50"
      }
    >
      <p className="font-display text-xs tracking-[0.14em] text-paper/70 uppercase">
        {title}
      </p>
      {description ? (
        <p className="mt-2 leading-relaxed text-paper/50">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
