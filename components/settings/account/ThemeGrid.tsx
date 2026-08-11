import type { PANEL_THEMES, PanelThemeId } from "@/lib/panel-themes";

type ThemeOption = (typeof PANEL_THEMES)[number];

type ThemeGridProps = {
  themes: readonly ThemeOption[];
  selectedId: PanelThemeId;
  saving: boolean;
  onSelect: (id: PanelThemeId) => void;
};

export function ThemeGrid({ themes, selectedId, saving, onSelect }: ThemeGridProps) {
  return (
    <div
      className="mt-4 grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Wybór motywu"
    >
      {themes.map((theme) => {
        const selected = selectedId === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={saving}
            onClick={() => onSelect(theme.id)}
            className={`settings-surface group text-left transition-colors disabled:cursor-wait disabled:opacity-60 ${
              selected
                ? "border border-brand bg-brand/10"
                : "border border-paper/15 bg-chrome/20 hover:border-paper/35"
            }`}
          >
            <div
              className="flex h-14 overflow-hidden border-b border-paper/10"
              aria-hidden="true"
            >
              <span className="w-[42%]" style={{ backgroundColor: theme.swatch.ink }} />
              <span className="w-[28%]" style={{ backgroundColor: theme.swatch.accent }} />
              <span className="w-[18%]" style={{ backgroundColor: theme.swatch.brand }} />
              <span className="w-[12%]" style={{ backgroundColor: theme.swatch.paper }} />
            </div>
            <div className="px-3 py-2.5">
              <p className="font-display text-[11px] tracking-[0.12em] text-paper uppercase">
                {theme.label}
                {theme.experimental ? (
                  <span className="ml-2 font-sans text-[10px] tracking-normal text-amber-400/90 normal-case">
                    experimental
                  </span>
                ) : null}
                {selected ? (
                  <span className="ml-2 text-brand normal-case tracking-normal">
                    · aktywny
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-paper/50">{theme.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
