"use client";

import { DevCredentialsModal } from "@/components/klub/konta/DevCredentialsModal";
import { ProfileModal } from "@/components/klub/konta/ProfileModal";
import { ProfilesTable } from "@/components/klub/konta/ProfilesTable";
import { CreateUserModal, EditUserModal } from "@/components/klub/konta/UserModal";
import { UsersTable } from "@/components/klub/konta/UsersTable";
import { useKontaPage } from "@/components/klub/konta/useKontaPage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

export default function KontaPage() {
  const kp = useKontaPage();

  return (
    <div className="animate-rise space-y-10">
      <PageHeader
        eyebrow="Ludzie"
        title="Konta i profile"
        description={
          kp.showUsersSection
            ? "Zarządzanie kontami użytkowników oraz profilami zawodników."
            : "Zarządzanie profilami zawodników (bez tworzenia kont staff)."
        }
      />

      {kp.error && kp.userModal === "closed" && kp.profileModal === "closed" ? (
        <InlineStatus kind="error">{kp.error}</InlineStatus>
      ) : null}

      {kp.loading ? (
        <InlineStatus kind="loading">Ładowanie kont i profili…</InlineStatus>
      ) : null}

      {kp.showUsersSection ? (
        <UsersTable
          users={kp.users}
          loading={kp.loading}
          editingUserId={kp.editingUserId}
          canManageUsers={kp.canManageUsers}
          resetBusyId={kp.resetBusyId}
          onAdd={kp.openCreateUser}
          onEdit={kp.openEditUser}
          onToggleBan={(u) => void kp.toggleBan(u)}
          onSendPasswordReset={(u) => void kp.sendPasswordReset(u)}
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

      <DevCredentialsModal
        credentials={kp.devCredentials}
        onClose={() => kp.setDevCredentials(null)}
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
