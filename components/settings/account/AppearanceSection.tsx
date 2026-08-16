import type { PANEL_THEMES, PanelThemeId } from "@/lib/panel-themes";
import { CookieConsentSettings } from "@/components/settings/CookieConsentSettings";
import { SettingsCategory } from "@/components/settings/SettingsCategory";
import { ThemeGrid } from "./ThemeGrid";
import { subheadingClass } from "./styles";

type ThemeOption = (typeof PANEL_THEMES)[number];

type AppearanceSectionProps = {
  colorThemes: readonly ThemeOption[];
  layoutThemes: readonly ThemeOption[];
  uiTheme: PanelThemeId;
  saving: boolean;
  onSelectTheme: (id: PanelThemeId) => void;
};

export function AppearanceSection({
  colorThemes,
  layoutThemes,
  uiTheme,
  saving,
  onSelectTheme,
}: AppearanceSectionProps) {
  return (
    <>
      <SettingsCategory
        title="Wygląd"
        description="Kolorystyka paneli na wszystkich urządzeniach"
        defaultOpen
      >
        <p className="text-sm text-paper/55">
          Wybór jest zapisany na koncie i działa na każdym urządzeniu.
        </p>
        <p className={`mt-5 ${subheadingClass}`}>Kolorystyka</p>
        <ThemeGrid
          themes={colorThemes}
          selectedId={uiTheme}
          saving={saving}
          onSelect={onSelectTheme}
        />
        <p className={`mt-6 ${subheadingClass}`}>Układy</p>
        <p className="mt-2 text-sm text-paper/55">
          Zmieniają też geometrię UI — kapsuła, studio, dok, ramka albo wstęga.
        </p>
        <ThemeGrid
          themes={layoutThemes}
          selectedId={uiTheme}
          saving={saving}
          onSelect={onSelectTheme}
        />
      </SettingsCategory>

      <SettingsCategory title="Prywatność" description="Zgody RODO i cookies">
        <CookieConsentSettings hideHeading />
      </SettingsCategory>
    </>
  );
}
