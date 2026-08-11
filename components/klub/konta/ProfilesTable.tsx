import type { AthleteProfile } from "@/lib/api/generated/models";

type ProfilesTableProps = {
  profiles: AthleteProfile[];
  loading: boolean;
  editingProfileId: string | null;
  onAdd: () => void;
  onEdit: (p: AthleteProfile) => void;
  onRemove: (id: string, name: string) => void;
  accountLabel: (userId: string) => string;
};

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
      <div className="overflow-x-auto border border-paper/10">
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs text-paper/70 underline-offset-2 hover:underline"
                      onClick={() => onEdit(p)}
                    >
                      Edytuj
                    </button>
                    <button
                      type="button"
                      className="text-xs text-brand underline-offset-2 hover:underline"
                      onClick={() => onRemove(p.id, p.display_name)}
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-paper/45">
                  Brak profili.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
