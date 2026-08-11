import type { PANEL_THEMES, PanelThemeId } from "@/lib/panel-themes";
import { CookieConsentSettings } from "@/components/settings/CookieConsentSettings";
import { SettingsCategory } from "@/components/settings/SettingsCategory";
import { ThemeGrid } from "./ThemeGrid";
import { subheadingClass } from "./styles";

type ThemeOption = (typeof PANEL_THEMES)[number];

type AppearanceSectionProps = {
  stableThemes: readonly ThemeOption[];
  experimentalThemes: readonly ThemeOption[];
  allowExperimental: boolean;
  uiTheme: PanelThemeId;
  saving: boolean;
  onSelectTheme: (id: PanelThemeId) => void;
};

export function AppearanceSection({
  stableThemes,
  experimentalThemes,
  allowExperimental,
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
        <p className={`mt-5 ${subheadingClass}`}>Motywy stable</p>
        <ThemeGrid
          themes={stableThemes}
          selectedId={uiTheme}
          saving={saving}
          onSelect={onSelectTheme}
        />
        {allowExperimental ? (
          <>
            <p className={`mt-6 ${subheadingClass}`}>Motywy experimental</p>
            <p className="mt-2 text-sm text-paper/55">
              Zmieniają też układ i geometrię UI. Dostępne przez flagę
              DevTools.
            </p>
            <ThemeGrid
              themes={experimentalThemes}
              selectedId={uiTheme}
              saving={saving}
              onSelect={onSelectTheme}
            />
          </>
        ) : null}
      </SettingsCategory>

      <SettingsCategory title="Prywatność" description="Zgody RODO i cookies">
        <CookieConsentSettings hideHeading />
      </SettingsCategory>
    </>
  );
}
