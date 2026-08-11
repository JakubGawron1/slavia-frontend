import type { ReactNode } from "react";
import type { ResultStatus } from "@/lib/api/generated/models";
import { RESULT_STATUS_LABELS } from "./shared";

type ResultStatusBadgeProps = {
  status: ResultStatus;
  /** "badge" — obramowany chip (lista do weryfikacji); "plain" — zwykły tekst. */
  variant?: "badge" | "plain";
  /** Dodatkowy tekst dopisany po etykiecie (np. rodzaj wyniku). */
  suffix?: ReactNode;
};

export function ResultStatusBadge({
  status,
  variant = "plain",
  suffix,
}: ResultStatusBadgeProps) {
  const className =
    variant === "badge"
      ? "border border-paper/20 px-2 py-1 font-display text-[10px] tracking-[0.12em] uppercase"
      : "font-display text-[10px] tracking-[0.12em] uppercase text-paper/50";

  return (
    <span className={className}>
      {RESULT_STATUS_LABELS[status] ?? status}
      {suffix ? <> · {suffix}</> : null}
    </span>
  );
}
