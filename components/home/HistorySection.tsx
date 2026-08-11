import { history } from "./data";

export function HistorySection() {
  return (
    <section className="bg-chrome py-16 text-paper md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          O nas
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight uppercase md:text-5xl">
          Historia klubu
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70 md:text-lg">
          Od pierwszych treningów na śląskiej sali po kadrę startującą w całej
          Polsce — kamienie milowe CKS Slavia.
        </p>

        <ol className="mt-12 space-y-0 border-l border-paper/15">
          {history.map((item) => (
            <li key={item.year} className="relative pl-8 pb-10 last:pb-0">
              <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 bg-brand" />
              <p className="font-display text-sm tracking-[0.16em] text-brand uppercase">
                {item.year} · {item.tag}
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-wide uppercase">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/65 md:text-base">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
