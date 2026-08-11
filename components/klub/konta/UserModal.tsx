import type { FormEvent } from "react";
import type { Role } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/klub-nav";
import { PhotoUploadField } from "@/components/settings/PhotoUploadField";
import { Modal } from "@/components/ui/Modal";
import { formGridClass, inputClass, type UserCreateFormState } from "./shared";

type RoleCheckboxesProps = {
  roleOptions: Role[];
  selected: Role[];
  onToggle: (role: Role) => void;
};

function RoleCheckboxes({ roleOptions, selected, onToggle }: RoleCheckboxesProps) {
  return (
    <div className="flex flex-wrap gap-2 self-center sm:col-span-2">
      {roleOptions.map((role) => (
        <label key={role} className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={selected.includes(role)}
            onChange={() => onToggle(role)}
          />
          {ROLE_LABELS[role]}
        </label>
      ))}
    </div>
  );
}

type CreateUserModalProps = {
  open: boolean;
  error: string | null;
  form: UserCreateFormState;
  roleOptions: Role[];
  onFormChange: (form: UserCreateFormState) => void;
  onToggleRole: (role: Role) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function CreateUserModal({
  open,
  error,
  form,
  roleOptions,
  onFormChange,
  onToggleRole,
  onSubmit,
  onClose,
}: CreateUserModalProps) {
  return (
    <Modal open={open} title="Nowe konto" onClose={onClose} wide>
      {error ? (
        <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className={formGridClass}>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Nazwa
          </span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            E-mail
          </span>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => onFormChange({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Hasło
          </span>
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={(e) => onFormChange({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </label>
        <PhotoUploadField
          className="sm:col-span-2"
          value={form.photoUrl}
          onChange={(url) => onFormChange({ ...form, photoUrl: url })}
          label="Zdjęcie konta"
          hint="Opcjonalnie — możesz też dodać później."
          inputClassName={inputClass}
        />
        <RoleCheckboxes
          roleOptions={roleOptions}
          selected={form.roles}
          onToggle={onToggleRole}
        />
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            Dodaj konto
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

type EditUserModalProps = {
  open: boolean;
  error: string | null;
  name: string;
  email: string;
  password: string;
  photoUrl: string;
  roles: Role[];
  roleOptions: Role[];
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onPhotoUrlChange: (v: string) => void;
  onToggleRole: (role: Role) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function EditUserModal({
  open,
  error,
  name,
  email,
  password,
  photoUrl,
  roles,
  roleOptions,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPhotoUrlChange,
  onToggleRole,
  onSubmit,
  onClose,
}: EditUserModalProps) {
  return (
    <Modal open={open} title="Edycja konta" onClose={onClose} wide>
      {error ? (
        <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className={formGridClass}>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Nazwa
          </span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            E-mail
          </span>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Nowe hasło{" "}
            <span className="normal-case tracking-normal text-paper/35">
              (opcjonalnie)
            </span>
          </span>
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            minLength={6}
          />
        </label>
        <PhotoUploadField
          className="sm:col-span-2"
          value={photoUrl}
          onChange={onPhotoUrlChange}
          label="Zdjęcie konta"
          hint="Dla zawodnika synchronizowane z profilem publicznym."
          inputClassName={inputClass}
        />
        <RoleCheckboxes
          roleOptions={roleOptions}
          selected={roles}
          onToggle={onToggleRole}
        />
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            Zapisz konto
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
