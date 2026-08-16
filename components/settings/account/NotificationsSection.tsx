import type { NotificationPrefs } from "@/lib/api/generated/models";
import { SettingsCategory } from "@/components/settings/SettingsCategory";
import { PrefToggle } from "./PrefToggle";

type NotificationsSectionProps = {
  prefs: NotificationPrefs;
  saving: boolean;
  isStaff: boolean;
  onSavePrefs: (next: NotificationPrefs) => void;
};

export function NotificationsSection({
  prefs,
  saving,
  isStaff,
  onSavePrefs,
}: NotificationsSectionProps) {
  return (
    <SettingsCategory
      title="Powiadomienia"
      description="Maile o składzie i kontakcie"
    >
      <p className="text-sm text-paper/55">
        Powiadomienia w aplikacji (dzwonek) działają zawsze. Poniżej —
        dodatkowe wiadomości na zweryfikowany e-mail.
      </p>
      <div className="mt-4 space-y-2">
        <PrefToggle
          id="pref-squad"
          checked={prefs.email_squad ?? true}
          title="Skład zawodów"
          description="Przypisanie lub wypisanie ze składu zawodów."
          disabled={saving}
          onChange={(v) => onSavePrefs({ ...prefs, email_squad: v })}
        />
        {isStaff ? (
          <PrefToggle
            id="pref-contact"
            checked={prefs.email_contact ?? true}
            title="Formularz kontaktowy"
            description="Nowa wiadomość ze strony kontaktu."
            disabled={saving}
            onChange={(v) => onSavePrefs({ ...prefs, email_contact: v })}
          />
        ) : null}
      </div>
    </SettingsCategory>
  );
}
