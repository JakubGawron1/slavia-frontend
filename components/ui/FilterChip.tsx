type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  swatch?: string;
  idle?: string;
  activeClass?: string;
};

const DEFAULT_IDLE =
  "border border-paper/20 text-paper/60 hover:border-paper/40";
const DEFAULT_ACTIVE = "bg-brand text-paper";

export function FilterChip({
  active,
  onClick,
  label,
  swatch,
  idle = DEFAULT_IDLE,
  activeClass = DEFAULT_ACTIVE,
}: FilterChipProps) {
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
