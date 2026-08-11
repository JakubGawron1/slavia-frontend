import Link from "next/link";
import { BASE_TOOLS } from "./data";

type ToolsSectionProps = {
  blogEnabled: boolean;
  ogloszeniaEnabled: boolean;
  calendarEnabled: boolean;
};

export function ToolsSection({
  blogEnabled,
  ogloszeniaEnabled,
  calendarEnabled,
}: ToolsSectionProps) {
  const tools = BASE_TOOLS.filter((tool) => {
    if (tool.flag === "blog") return blogEnabled;
    if (tool.flag === "ogloszenia") return ogloszeniaEnabled;
    if (tool.flag === "calendar") return calendarEnabled;
    return true;
  });

  return (
    <section className="bg-steel-panel py-16 text-paper md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight uppercase md:text-5xl">
          Wszystko w jednym miejscu
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70 md:text-lg">
          Ranking Sinclair, blog i kalendarz — trenuj mądrzej i bądź na
          bieżąco z życiem klubu.
        </p>

        <div className="mt-12 grid gap-px bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-steel-panel px-5 py-8 transition-colors hover:bg-chrome md:px-6"
            >
              <h3 className="font-display text-xl tracking-wide uppercase transition-colors group-hover:text-brand">
                {tool.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/65">
                {tool.text}
              </p>
              <span className="mt-6 inline-block font-display text-xs tracking-[0.14em] text-brand uppercase">
                Otwórz →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
