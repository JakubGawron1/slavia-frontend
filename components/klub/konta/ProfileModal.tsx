import type { FormEvent } from "react";
import type { PublicUser } from "@/lib/api/generated/models";
import { isDevEmail } from "@/lib/email";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { Modal } from "@/components/ui/Modal";
import {
  type AccountLinkMode,
  formGridClass,
  inputClass,
  type ProfileFormState,
  type ProfileModalMode,
  type ProfileSex,
} from "./shared";

type ProfileModalProps = {
  mode: ProfileModalMode;
  error: string | null;
  form: ProfileFormState;
  computedCategory: string | null;
  availableAthletes: PublicUser[];
  onAccountModeChange: (mode: AccountLinkMode) => void;
  onUserIdChange: (id: string) => void;
  onFieldChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function ProfileModal({
  mode,
  error,
  form,
  computedCategory,
  availableAthletes,
  onAccountModeChange,
  onUserIdChange,
  onFieldChange,
  onSubmit,
  onClose,
}: ProfileModalProps) {
  return (
    <Modal
      open={mode !== "closed"}
      title={mode === "edit" ? "Edycja profilu" : "Nowy profil zawodnika"}
      onClose={onClose}
      wide
    >
      {error ? (
        <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className={formGridClass}>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Imię i nazwisko
          </span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Powiązanie z kontem
          </span>
          <select
            className={inputClass}
            value={form.accountMode}
            onChange={(e) => onAccountModeChange(e.target.value as AccountLinkMode)}
          >
            <option value="existing">Połącz z istniejącym kontem</option>
            {mode === "create" ? (
              <option value="new">Utwórz nowe konto zawodnika</option>
            ) : null}
            <option value="none">Bez konta</option>
          </select>
        </label>

        {form.accountMode === "existing" ? (
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
              Konto zawodnika
            </span>
            <select
              className={inputClass}
              value={form.userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              required
            >
              <option value="">— Wybierz konto —</option>
              {availableAthletes.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.display_name} ({u.email})
                </option>
              ))}
            </select>
            {availableAthletes.length === 0 ? (
              <span className="text-xs text-paper/45">
                Brak wolnych kont z rolą zawodnik. Utwórz nowe konto albo wybierz
                „Bez konta”.
              </span>
            ) : null}
          </label>
        ) : null}

        {form.accountMode === "new" && mode === "create" ? (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                E-mail konta
              </span>
              <input
                className={inputClass}
                type="email"
                value={form.accountEmail}
                onChange={(e) => onFieldChange("accountEmail", e.target.value)}
                required
              />
            </label>
            {isDevEmail(form.accountEmail) ? (
              <label className="flex flex-col gap-1.5">
                <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                  Hasło konta
                </span>
                <input
                  className={inputClass}
                  type="password"
                  value={form.accountPassword}
                  onChange={(e) => onFieldChange("accountPassword", e.target.value)}
                  required
                  minLength={6}
                />
              </label>
            ) : (
              <p className="text-xs text-paper/45 self-end">
                Link do ustawienia hasła pójdzie na e-mail.
              </p>
            )}
            <p className="text-xs text-paper/45 sm:col-span-2">
              Zostanie utworzone konto z rolą zawodnik i powiązane z tym
              profilem
              {isDevEmail(form.accountEmail)
                ? " (adres .dev / .local — bez weryfikacji)."
                : "."}
            </p>
          </>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Masa ciała (kg)
          </span>
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={form.weight}
            onChange={(e) => onFieldChange("weight", e.target.value)}
          />
        </label>
        <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
          {computedCategory ? (
            <>
              Kategoria:{" "}
              <span className="font-medium text-paper">{computedCategory}</span>
            </>
          ) : form.weight && (!form.birthDate.trim() || !form.sex) ? (
            <span className="text-paper/50">
              Podaj płeć i datę urodzenia, by wyliczyć kategorię
            </span>
          ) : (
            <span className="text-paper/50">
              Kategoria po podaniu wagi, płci i daty urodzenia
            </span>
          )}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Płeć (Sinclair)
          </span>
          <select
            className={inputClass}
            value={form.sex}
            onChange={(e) => onFieldChange("sex", e.target.value as ProfileSex)}
          >
            <option value="">—</option>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Data urodzenia
          </span>
          <input
            className={inputClass}
            type="date"
            value={form.birthDate}
            onChange={(e) => onFieldChange("birthDate", e.target.value)}
          />
        </label>
        <PhotoUploadField
          className="sm:col-span-2"
          value={form.photoUrl}
          onChange={(url) => onFieldChange("photoUrl", url)}
          label="Zdjęcie profilowe"
          hint="Przy powiązanym koncie zawodnika synchronizowane ze zdjęciem konta."
          inputClassName={inputClass}
        />
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Opis
          </span>
          <textarea
            className={`min-h-[4.5rem] ${inputClass}`}
            placeholder="Widoczny na stronie Zawodnicy"
            value={form.notes}
            onChange={(e) => onFieldChange("notes", e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            {mode === "edit" ? "Zapisz profil" : "Dodaj profil"}
          </button>
          <button
            type="button"
            className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase text-paper/70"
            onClick={onClose}
          >
            Anuluj
          </button>
        </div>
      </form>
    </Modal>
  );
}
