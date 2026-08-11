type RouteEntry = { path: string; label: string };

type RoutesTabProps = {
  publicRoutes: readonly RouteEntry[];
  klubRoutes: readonly RouteEntry[];
};

export function RoutesTab({ publicRoutes, klubRoutes }: RoutesTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Publiczne
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {publicRoutes.map((r) => (
            <li key={r.path} className="font-mono text-paper/70">
              {r.path} <span className="font-sans text-paper/40">— {r.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Panel /klub
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {klubRoutes.map((r) => (
            <li key={r.path} className="font-mono text-paper/70">
              {r.path} <span className="font-sans text-paper/40">— {r.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
