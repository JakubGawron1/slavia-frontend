export function FilterChip({
  active,
  onClick,
  label,
  swatch,
  idle,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  swatch?: string;
  idle: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 font-display text-xs tracking-[0.1em] uppercase transition-colors sm:text-sm ${
        active ? activeClass : idle
      }`}
    >
      {swatch && !active ? (
        <span className={`h-2.5 w-2.5 shrink-0 ${swatch}`} aria-hidden />
      ) : null}
      {label}
    </button>
  );
}
