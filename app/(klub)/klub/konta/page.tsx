"use client";

import { ProfileModal } from "@/components/klub/konta/ProfileModal";
import { ProfilesTable } from "@/components/klub/konta/ProfilesTable";
import { CreateUserModal, EditUserModal } from "@/components/klub/konta/UserModal";
import { UsersTable } from "@/components/klub/konta/UsersTable";
import { useKontaPage } from "@/components/klub/konta/useKontaPage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function KontaPage() {
  const kp = useKontaPage();

  return (
    <div className="animate-rise max-w-5xl space-y-10">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Ludzie
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Konta i profile
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          {kp.showUsersSection
            ? "Zarządzanie kontami użytkowników oraz profilami zawodników."
            : "Zarządzanie profilami zawodników (bez tworzenia kont staff)."}
        </p>
      </div>

      {kp.error && kp.userModal === "closed" && kp.profileModal === "closed" ? (
        <p
          className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm"
          role="alert"
        >
          {kp.error}
        </p>
      ) : null}

      {kp.loading ? <p className="text-paper/50">Ładowanie…</p> : null}

      {kp.showUsersSection ? (
        <UsersTable
          users={kp.users}
          loading={kp.loading}
          editingUserId={kp.editingUserId}
          canManageUsers={kp.canManageUsers}
          onAdd={kp.openCreateUser}
          onEdit={kp.openEditUser}
          onToggleBan={(u) => void kp.toggleBan(u)}
          onRemove={kp.removeUser}
        />
      ) : null}

      <ProfilesTable
        profiles={kp.profiles}
        loading={kp.loading}
        editingProfileId={kp.editingProfileId}
        onAdd={kp.openCreateProfile}
        onEdit={kp.openEditProfile}
        onRemove={kp.removeProfile}
        accountLabel={kp.accountLabel}
      />

      <CreateUserModal
        open={kp.userModal === "create"}
        error={kp.error}
        form={kp.createUserForm}
        roleOptions={kp.roleOptions}
        onFormChange={kp.setCreateUserForm}
        onToggleRole={kp.toggleCreateRole}
        onSubmit={(e) => void kp.createUser(e)}
        onClose={kp.closeUserModal}
      />

      <EditUserModal
        open={kp.userModal === "edit"}
        error={kp.error}
        name={kp.editName}
        email={kp.editEmail}
        password={kp.editPassword}
        photoUrl={kp.editPhotoUrl}
        roles={kp.editRoles}
        roleOptions={kp.roleOptions}
        onNameChange={kp.setEditName}
        onEmailChange={kp.setEditEmail}
        onPasswordChange={kp.setEditPassword}
        onPhotoUrlChange={kp.setEditPhotoUrl}
        onToggleRole={kp.toggleEditRole}
        onSubmit={(e) => void kp.saveUser(e)}
        onClose={kp.closeUserModal}
      />

      <ProfileModal
        mode={kp.profileModal}
        error={kp.error}
        form={kp.profileForm}
        computedCategory={kp.computedCategory}
        availableAthletes={kp.availableAthletes}
        onAccountModeChange={kp.setProfileAccountMode}
        onUserIdChange={kp.setProfileUserId}
        onFieldChange={kp.setProfileField}
        onSubmit={(e) => void kp.submitProfile(e)}
        onClose={kp.closeProfileModal}
      />

      <ConfirmModal
        open={kp.confirmDelete !== null}
        title={kp.confirmDelete?.kind === "user" ? "Usuń konto" : "Usuń profil"}
        message={
          kp.confirmDelete?.kind === "user"
            ? `Na pewno usunąć konto „${kp.confirmDelete.name}”?`
            : `Na pewno usunąć profil zawodnika „${kp.confirmDelete?.name ?? ""}”?`
        }
        busy={kp.confirmBusy}
        onConfirm={() => void kp.runConfirmDelete()}
        onClose={() => kp.setConfirmDelete(null)}
      />
    </div>
  );
}
