import type { Role } from "@/lib/auth";

export const ALL_ROLES: Role[] = ["zawodnik", "trener", "admin", "superadmin"];

export type AccountLinkMode = "existing" | "new" | "none";
export type ProfileSex = "" | "male" | "female";
export type UserModalMode = "closed" | "create" | "edit";
export type ProfileModalMode = "closed" | "create" | "edit";

export const inputClass =
  "border border-paper/20 bg-chrome/40 px-3 py-2 text-sm outline-none focus:border-brand";
export const formGridClass = "grid gap-3 sm:grid-cols-2";

export type ProfileFormState = {
  name: string;
  accountMode: AccountLinkMode;
  userId: string;
  accountEmail: string;
  accountPassword: string;
  category: string;
  weight: string;
  sex: ProfileSex;
  birthDate: string;
  photoUrl: string;
  notes: string;
};

export function emptyProfileForm(): ProfileFormState {
  return {
    name: "",
    accountMode: "existing",
    userId: "",
    accountEmail: "",
    accountPassword: "",
    category: "",
    weight: "",
    sex: "",
    birthDate: "",
    photoUrl: "",
    notes: "",
  };
}

export type UserCreateFormState = {
  email: string;
  password: string;
  name: string;
  photoUrl: string;
  roles: Role[];
};

export function emptyUserCreateForm(): UserCreateFormState {
  return {
    email: "",
    password: "",
    name: "",
    photoUrl: "",
    roles: ["zawodnik"],
  };
}

export type ConfirmDeleteTarget =
  | { kind: "user"; id: string; name: string }
  | { kind: "profile"; id: string; name: string };
