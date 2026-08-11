import { groups } from "./data";

export function GroupsSection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Co Cię czeka na sali
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Trzy grupy, jeden klub
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
          Niezależnie czy masz 11 czy 41 lat — znajdziemy miejsce. Trenujemy
          razem, ale plan zawsze jest dopasowany do możliwości i celów.
        </p>

        <div className="mt-12 grid gap-0 border border-mist md:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.title}
              className="border-b border-mist px-5 py-8 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0 md:px-6 md:py-10"
            >
              <p className="font-display text-sm tracking-[0.16em] text-brand uppercase">
                {group.age}
              </p>
              <h3 className="mt-3 font-display text-2xl tracking-wide text-ink uppercase">
                {group.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-steel-soft md:text-base">
                {group.text}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-steel">
                {group.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-brand" aria-hidden="true">
                      —
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
