import type { AthleteProfile } from "@/lib/api/generated/models";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";

type ProfilesTableProps = {
  profiles: AthleteProfile[];
  loading: boolean;
  editingProfileId: string | null;
  onAdd: () => void;
  onEdit: (p: AthleteProfile) => void;
  onRemove: (id: string, name: string) => void;
  accountLabel: (userId: string) => string;
};

function ProfileActions({
  profile,
  onEdit,
  onRemove,
}: {
  profile: AthleteProfile;
  onEdit: (p: AthleteProfile) => void;
  onRemove: (id: string, name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="text-xs text-paper/70 underline-offset-2 hover:underline"
        onClick={() => onEdit(profile)}
      >
        Edytuj
      </button>
      <button
        type="button"
        className="text-xs text-brand underline-offset-2 hover:underline"
        onClick={() => onRemove(profile.id, profile.display_name)}
      >
        Usuń
      </button>
    </div>
  );
}

export function ProfilesTable({
  profiles,
  loading,
  editingProfileId,
  onAdd,
  onEdit,
  onRemove,
  accountLabel,
}: ProfilesTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-sm tracking-[0.14em] uppercase">
          Profile zawodników
        </h2>
        <button
          type="button"
          className="border border-brand/50 bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25"
          onClick={onAdd}
        >
          Dodaj profil
        </button>
      </div>

      {loading && profiles.length === 0 ? (
        <InlineStatus kind="loading">Ładowanie profili…</InlineStatus>
      ) : profiles.length === 0 ? (
        <EmptyState
          title="Brak profili"
          description="Dodaj profil zawodnika, żeby dało się wpisywać wyniki i przypisywać plany."
          action={
            <button
              type="button"
              className="border border-brand/50 bg-brand/15 px-3 py-2 font-display text-[11px] tracking-[0.12em] text-paper uppercase"
              onClick={onAdd}
            >
              Dodaj profil
            </button>
          }
        />
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {profiles.map((p) => (
              <li
                key={p.id}
                className={`border border-paper/10 p-3 ${
                  editingProfileId === p.id ? "bg-brand/5" : ""
                }`}
              >
                <p className="font-medium">{p.display_name}</p>
                <p className="mt-1 text-xs text-paper/55">
                  {p.category ?? "bez kategorii"}
                  {p.bodyweight_kg != null ? ` · ${p.bodyweight_kg} kg` : ""}
                </p>
                <p className="mt-0.5 text-xs text-paper/40">
                  {accountLabel(p.user_id)}
                </p>
                <div className="mt-2">
                  <ProfileActions
                    profile={p}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto border border-paper/10 md:block">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-paper/5 font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
                <tr>
                  <th className="px-3 py-2">Imię</th>
                  <th className="px-3 py-2">Kategoria</th>
                  <th className="px-3 py-2">Masa</th>
                  <th className="px-3 py-2">Konto</th>
                  <th className="px-3 py-2">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t border-paper/10 ${
                      editingProfileId === p.id ? "bg-brand/5" : ""
                    }`}
                  >
                    <td className="px-3 py-2">{p.display_name}</td>
                    <td className="px-3 py-2 text-paper/70">
                      {p.category ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-paper/70">
                      {p.bodyweight_kg != null ? `${p.bodyweight_kg} kg` : "—"}
                    </td>
                    <td className="px-3 py-2 text-paper/70">
                      {accountLabel(p.user_id)}
                    </td>
                    <td className="px-3 py-2">
                      <ProfileActions
                        profile={p}
                        onEdit={onEdit}
                        onRemove={onRemove}
                      />
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
