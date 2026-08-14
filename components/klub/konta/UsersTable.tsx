import type { PublicUser } from "@/lib/api/generated/models";
import { ROLE_LABELS } from "@/lib/klub-nav";
import { ImageHolder } from "@/components/settings/ImageHolder";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";

type UsersTableProps = {
  users: PublicUser[];
  loading: boolean;
  editingUserId: string | null;
  canManageUsers: boolean;
  resetBusyId: string | null;
  onAdd: () => void;
  onEdit: (u: PublicUser) => void;
  onToggleBan: (u: PublicUser) => void;
  onSendPasswordReset: (u: PublicUser) => void;
  onRemove: (id: string, name: string) => void;
};

function UserPhoto({ url }: { url?: string | null }) {
  return (
    <div className="h-8 w-8 shrink-0 overflow-hidden border border-paper/15">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <ImageHolder />
      )}
    </div>
  );
}

function UserActions({
  user,
  canManageUsers,
  resetBusyId,
  onEdit,
  onToggleBan,
  onSendPasswordReset,
  onRemove,
}: {
  user: PublicUser;
  canManageUsers: boolean;
  resetBusyId: string | null;
  onEdit: (u: PublicUser) => void;
  onToggleBan: (u: PublicUser) => void;
  onSendPasswordReset: (u: PublicUser) => void;
  onRemove: (id: string, name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="text-xs text-paper/70 underline-offset-2 hover:underline"
        onClick={() => onEdit(user)}
      >
        Edytuj
      </button>
      <button
        type="button"
        className="text-xs text-paper/70 underline-offset-2 hover:underline"
        onClick={() => onToggleBan(user)}
      >
        {user.is_active ? "Banuj" : "Odbanuj"}
      </button>
      {canManageUsers ? (
        <button
          type="button"
          className="text-xs text-paper/70 underline-offset-2 hover:underline disabled:opacity-40"
          disabled={resetBusyId === user.id || !user.is_active}
          onClick={() => onSendPasswordReset(user)}
        >
          {resetBusyId === user.id ? "Wysyłanie…" : "Reset hasła"}
        </button>
      ) : null}
      <button
        type="button"
        className="text-xs text-brand underline-offset-2 hover:underline"
        onClick={() => onRemove(user.id, user.display_name)}
      >
        Usuń
      </button>
    </div>
  );
}

export function UsersTable({
  users,
  loading,
  editingUserId,
  canManageUsers,
  resetBusyId,
  onAdd,
  onEdit,
  onToggleBan,
  onSendPasswordReset,
  onRemove,
}: UsersTableProps) {
  const actionProps = {
    canManageUsers,
    resetBusyId,
    onEdit,
    onToggleBan,
    onSendPasswordReset,
    onRemove,
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">
          Konta
        </h2>
        {canManageUsers ? (
          <button
            type="button"
            className="border border-brand/50 bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25"
            onClick={onAdd}
          >
            Dodaj konto
          </button>
        ) : null}
      </div>

      {loading && users.length === 0 ? (
        <InlineStatus kind="loading">Ładowanie kont…</InlineStatus>
      ) : users.length === 0 ? (
        <EmptyState
          title="Brak kont"
          description="Dodaj pierwsze konto, aby zawodnik lub kadra mogli się zalogować."
          action={
            canManageUsers ? (
              <button
                type="button"
                className="border border-brand/50 bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
                onClick={onAdd}
              >
                Dodaj konto
              </button>
            ) : null
          }
        />
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {users.map((u) => (
              <li
                key={u.id}
                className={`border border-paper/10 p-3 ${
                  editingUserId === u.id ? "bg-brand/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <UserPhoto url={u.photo_url} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{u.display_name}</p>
                    <p className="truncate text-xs text-paper/55">{u.email}</p>
                    <p className="mt-1 text-xs text-paper/45">
                      {u.roles.map((r) => ROLE_LABELS[r]).join(", ")} ·{" "}
                      {u.is_active ? "aktywne" : "zbanowane"}
                    </p>
                    <div className="mt-2">
                      <UserActions user={u} {...actionProps} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto border border-paper/10 md:block">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-paper/5 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                <tr>
                  <th className="px-3 py-2">Zdjęcie</th>
                  <th className="px-3 py-2">Nazwa</th>
                  <th className="px-3 py-2">E-mail</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-t border-paper/10 ${
                      editingUserId === u.id ? "bg-brand/5" : ""
                    }`}
                  >
                    <td className="px-3 py-2">
                      <UserPhoto url={u.photo_url} />
                    </td>
                    <td className="px-3 py-2">{u.display_name}</td>
                    <td className="px-3 py-2 text-paper/70">{u.email}</td>
                    <td className="px-3 py-2 text-paper/70">
                      {u.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                    </td>
                    <td className="px-3 py-2">
                      {u.is_active ? "Aktywne" : "Zbanowane"}
                    </td>
                    <td className="px-3 py-2">
                      <UserActions user={u} {...actionProps} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
