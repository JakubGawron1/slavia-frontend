import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=80"
          alt="Trening podnoszenia ciężarów — pomost i sztanga"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <div className="texture-noise absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="animate-rise font-display text-sm tracking-[0.28em] text-brand uppercase md:text-base">
          CKS Slavia Ruda Śląska
        </p>
        <div className="animate-bar mt-4 h-1 w-24 bg-brand" />
        <h1 className="animate-rise-delay-1 mt-6 max-w-4xl font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Sztanga, drużyna,{" "}
          <span className="text-brand">Slavia.</span>
        </h1>
        <p className="animate-rise-delay-2 mt-6 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">
          Klub podnoszenia ciężarów z tradycją i pasją. Trenujemy młodzież i
          dorosłych — od pierwszych kroków na platformie po starty w zawodach
          ogólnopolskich.
        </p>
        <div className="animate-rise-delay-3 mt-10 flex flex-wrap gap-3 md:gap-4">
          <Link
            href="/kalendarz"
            className="bg-brand px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep"
          >
            Kalendarz
          </Link>
          <Link
            href="/blog"
            className="border border-paper/40 px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/10"
          >
            Aktualności
          </Link>
          <Link
            href="/logowanie"
            className="border border-paper/25 px-7 py-3.5 font-display text-sm tracking-[0.12em] text-paper/90 uppercase transition-colors hover:border-paper hover:bg-paper/10"
          >
            Dołącz / Zaloguj
          </Link>
        </div>
      </div>
    </section>
  );
}
