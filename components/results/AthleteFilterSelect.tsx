import { resultInputClass } from "./shared";

export type AthleteFilterOption = { value: string; label: string };

type AthleteFilterSelectProps = {
  options: AthleteFilterOption[];
  value: string;
  onChange: (value: string) => void;
};

export function AthleteFilterSelect({
  options,
  value,
  onChange,
}: AthleteFilterSelectProps) {
  return (
    <label className="flex max-w-md flex-col gap-1.5">
      <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
        Filtruj według zawodnika
      </span>
      <select
        className={resultInputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Wszyscy zawodnicy</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
