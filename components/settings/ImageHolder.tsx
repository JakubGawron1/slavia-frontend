type Props = {
  /** Inicjały lub krótki tekst (opcjonalnie) */
  label?: string;
  className?: string;
  /** round = awatar koło; square = prostokąt (formularze) */
  shape?: "square" | "round";
};

/** Placeholder gdy brak zdjęcia profilowego / konta. */
export function ImageHolder({
  label,
  className = "",
  shape = "square",
}: Props) {
  const rounded = shape === "round" ? "rounded-full" : "";

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-paper/10 via-chrome/40 to-brand/15 ${rounded} ${className}`}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label ? `Brak zdjęcia — ${label}` : undefined}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-[42%] w-[42%] text-paper/30"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="24" cy="16" r="8" />
        <path d="M8 40c0-8.837 7.163-14 16-14s16 5.163 16 14v2H8v-2z" />
      </svg>
      {label ? (
        <span className="mt-1 max-w-[90%] truncate font-display text-[9px] tracking-[0.16em] text-paper/40 uppercase">
          {label}
        </span>
      ) : (
        <span className="mt-0.5 font-display text-[9px] tracking-[0.16em] text-paper/35 uppercase">
          Brak
        </span>
      )}
    </div>
  );
}
