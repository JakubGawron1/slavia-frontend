import type { AthleteProfile } from "@/lib/api/generated/models";

export function CompetitionEntriesSection({
  assignedAthleteIds,
  profiles,
  missingForDetail,
}: {
  assignedAthleteIds: string[];
  profiles: AthleteProfile[];
  missingForDetail: AthleteProfile[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="font-display text-sm uppercase">Skład</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {assignedAthleteIds.length === 0 ? (
            <li className="text-paper/45">Skład nieogłoszony</li>
          ) : (
            assignedAthleteIds.map((id) => {
              const p = profiles.find((x) => x.id === id);
              return <li key={id}>{p?.display_name ?? id}</li>;
            })
          )}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-sm uppercase">Nieprzypisani</h3>
        <ul className="mt-2 space-y-1 text-sm text-paper/55">
          {missingForDetail.length === 0 ? (
            <li>Wszyscy aktywni są na składzie</li>
          ) : (
            missingForDetail.map((p) => <li key={p.id}>{p.display_name}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
