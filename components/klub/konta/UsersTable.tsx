import type { PublicUser } from "@/lib/api/generated/models";
import { ROLE_LABELS } from "@/lib/klub-nav";
import { ImageHolder } from "@/components/settings/ImageHolder";

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
      <div className="overflow-x-auto border border-paper/10">
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
                  <div className="h-8 w-8 overflow-hidden border border-paper/15">
                    {u.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.photo_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageHolder />
                    )}
                  </div>
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs text-paper/70 underline-offset-2 hover:underline"
                      onClick={() => onEdit(u)}
                    >
                      Edytuj
                    </button>
                    <button
                      type="button"
                      className="text-xs text-paper/70 underline-offset-2 hover:underline"
                      onClick={() => onToggleBan(u)}
                    >
                      {u.is_active ? "Banuj" : "Odbanuj"}
                    </button>
                    {canManageUsers ? (
                      <button
                        type="button"
                        className="text-xs text-paper/70 underline-offset-2 hover:underline disabled:opacity-40"
                        disabled={resetBusyId === u.id || !u.is_active}
                        onClick={() => onSendPasswordReset(u)}
                      >
                        {resetBusyId === u.id ? "Wysyłanie…" : "Reset hasła"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="text-xs text-brand underline-offset-2 hover:underline"
                      onClick={() => onRemove(u.id, u.display_name)}
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-paper/45">
                  Brak kont.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
