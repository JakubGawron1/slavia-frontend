import { FormEvent, useMemo, useState } from "react";
import type { AthleteProfile, PublicUser } from "@/lib/api/generated/models";
import {
  createProfile,
  createUser as createUserApi,
  updateProfile,
} from "@/lib/api/generated/default/default";
import type { useToast } from "@/components/toast/ToastProvider";
import { isDevEmail } from "@/lib/email";
import { resolveWeightCategory } from "@/lib/weightlifting-categories";
import { profileFormSchema } from "@/lib/validation/konta";
import { parseOrMessage } from "@/lib/validation/parse";
import type { DevCredentials } from "./DevCredentialsModal";
import {
  type AccountLinkMode,
  emptyProfileForm,
  type ProfileModalMode,
  type ProfileSex,
} from "./shared";

type UseKontaProfilesArgs = {
  toast: ReturnType<typeof useToast>;
  setError: (msg: string | null) => void;
  load: () => Promise<void>;
  athleteUsers: PublicUser[];
  profiles: AthleteProfile[];
  usersById: Map<string, PublicUser>;
  onDevCredentials: (creds: DevCredentials) => void;
};

export function useKontaProfiles({
  toast,
  setError,
  load,
  athleteUsers,
  profiles,
  usersById,
  onDevCredentials,
}: UseKontaProfilesArgs) {
  const [profileModal, setProfileModal] = useState<ProfileModalMode>("closed");
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);

  const computedCategory = useMemo(() => {
    const bw = profileForm.weight ? Number(profileForm.weight) : NaN;
    if (!Number.isFinite(bw) || bw <= 0) return null;
    return resolveWeightCategory({
      birthDate: profileForm.birthDate || null,
      sex: profileForm.sex || null,
      bodyweightKg: bw,
    });
  }, [profileForm.weight, profileForm.birthDate, profileForm.sex]);

  const availableAthletes = useMemo(() => {
    const linked = new Set(
      profiles
        .filter((p) => p.id !== editingProfileId)
        .map((p) => p.user_id)
        .filter((id) => id && id !== "manual"),
    );
    return athleteUsers.filter((u) => !linked.has(u.id));
  }, [athleteUsers, profiles, editingProfileId]);

  function setProfileField<K extends keyof ReturnType<typeof emptyProfileForm>>(
    key: K,
    value: ReturnType<typeof emptyProfileForm>[K],
  ) {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  }

  function closeProfileModal() {
    setProfileModal("closed");
    setEditingProfileId(null);
    setProfileForm(emptyProfileForm());
  }

  function openCreateProfile() {
    setError(null);
    setEditingProfileId(null);
    setProfileForm(emptyProfileForm());
    setProfileModal("create");
  }

  function openEditProfile(p: AthleteProfile) {
    setError(null);
    setEditingProfileId(p.id);
    const linked =
      p.user_id && p.user_id !== "manual" ? ("existing" as const) : ("none" as const);
    setProfileForm({
      name: p.display_name,
      accountMode: linked,
      userId: linked === "existing" ? p.user_id : "",
      accountEmail: "",
      accountPassword: "",
      category: p.category ?? "",
      weight: p.bodyweight_kg != null ? String(p.bodyweight_kg) : "",
      sex: (p.sex === "male" || p.sex === "female" ? p.sex : "") as ProfileSex,
      birthDate: p.birth_date ?? "",
      photoUrl: p.photo_url ?? "",
      notes: p.notes ?? "",
    });
    setProfileModal("edit");
  }

  async function submitProfile(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = parseOrMessage(profileFormSchema, profileForm);
    if (!parsed.ok) {
      setError(parsed.message);
      toast.error("Profil", parsed.message);
      return;
    }
    const form = parsed.data;
    try {
      let userId = "manual";
      const mode = form.accountMode;

      if (mode === "existing") {
        userId = form.userId;
      } else if (mode === "new") {
        const email = form.accountEmail.trim();
        const password = form.accountPassword;
        const created = (
          await createUserApi({
            email,
            password: isDevEmail(email) ? password : null,
            display_name: form.name,
            roles: ["zawodnik"],
            photo_url: form.photoUrl.trim() || null,
          })
        ).data as PublicUser;
        userId = created.id;
        if (isDevEmail(email)) {
          onDevCredentials({
            email,
            password,
            displayName: form.name || email,
          });
        }
      }

      const body = {
        user_id: userId,
        display_name: form.name,
        bodyweight_kg: form.weight ? Number(form.weight) : null,
        category: computedCategory,
        notes: form.notes.trim() || null,
        photo_url: form.photoUrl.trim() || null,
        birth_date: form.birthDate || null,
        sex: form.sex || null,
      };

      if (editingProfileId) {
        await updateProfile(editingProfileId, body);
        toast.success("Zapisano profil", form.name);
      } else {
        await createProfile(body);
        toast.success("Dodano profil", form.name);
      }

      closeProfileModal();
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd profilu";
      setError(msg);
      toast.error("Profil", msg);
    }
  }

  function setProfileAccountMode(mode: AccountLinkMode) {
    setProfileForm((prev) => ({
      ...prev,
      accountMode: mode,
      userId: "",
      accountEmail: "",
      accountPassword: "",
    }));
  }

  function setProfileUserId(id: string) {
    const linked = usersById.get(id);
    setProfileForm((prev) => ({
      ...prev,
      userId: id,
      photoUrl:
        prev.photoUrl.trim() || linked?.photo_url?.trim() || prev.photoUrl,
    }));
  }

  function accountLabel(userId: string) {
    if (!userId || userId === "manual") return "Bez konta";
    const linked = usersById.get(userId);
    if (linked) return `${linked.display_name} (${linked.email})`;
    return userId;
  }

  return {
    profileModal,
    editingProfileId,
    profileForm,
    computedCategory,
    availableAthletes,
    setProfileField,
    setProfileAccountMode,
    setProfileUserId,
    closeProfileModal,
    openCreateProfile,
    openEditProfile,
    submitProfile,
    accountLabel,
  };
}
