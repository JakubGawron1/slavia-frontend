type PrefToggleProps = {
  id: string;
  checked: boolean;
  title: string;
  description: string;
  onChange: (v: boolean) => void;
  disabled?: boolean;
};

export function PrefToggle({
  id,
  checked,
  title,
  description,
  onChange,
  disabled,
}: PrefToggleProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 border border-paper/10 bg-chrome/20 px-3 py-3"
    >
      <span>
        <span className="block text-sm text-paper">{title}</span>
        <span className="mt-0.5 block text-xs text-paper/50">{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-4 w-4 accent-brand"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
