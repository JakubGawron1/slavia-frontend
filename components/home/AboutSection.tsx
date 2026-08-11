import { pillars } from "./data";

export function AboutSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Kim jesteśmy
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-ink md:text-5xl">
          Sport, ludzie i zdrowy progres
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
          Slavia to nie tylko medalowe nazwiska — to codzienna praca i
          bezpieczna nauka techniki, która ma służyć zdrowiu na lata.
        </p>

        <div className="mt-12 grid gap-10 border-t border-mist pt-10 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title}>
              <div className="h-1 w-10 bg-brand" />
              <h3 className="mt-4 font-display text-2xl tracking-wide text-ink uppercase">
                {pillar.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-steel-soft">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
