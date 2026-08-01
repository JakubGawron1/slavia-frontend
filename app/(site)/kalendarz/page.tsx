import type { Metadata } from "next";
import { ClubCalendar } from "@/components/ClubCalendar";
import { toDateKey } from "@/lib/calendar";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Kalendarz",
  description:
    "Kalendarz treningów, zawodów i wydarzeń CKS Slavia Ruda Śląska.",
};

export default async function CalendarPage() {
  const todayKey = toDateKey(new Date());
  const events = await getEvents();

  return (
    <section className="relative isolate bg-background pb-8">
      <div className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(200,16,46,0.18)_0%,transparent_45%),linear-gradient(160deg,#0e1014_0%,#1a1f26_100%)]"
          aria-hidden="true"
        />
        <div
          className="texture-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[90rem] px-4 pt-24 pb-8 sm:px-6 md:pt-28 md:pb-10 lg:px-8">
          <p className="animate-rise font-display text-sm tracking-[0.28em] text-brand uppercase">
            Terminarz
          </p>
          <div className="animate-bar mt-3 h-1 w-16 bg-brand" />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1 className="animate-rise-delay-1 font-display text-4xl leading-none font-semibold tracking-tight uppercase sm:text-5xl md:text-6xl">
              Kalendarz
            </h1>
            <p className="animate-rise-delay-2 max-w-md text-sm leading-relaxed text-paper/70 md:text-base">
              Treningi, zawody i wydarzenia klubowe — wybierz dzień, żeby zobaczyć
              szczegóły.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 pt-5 pb-2 sm:px-6 lg:px-8 lg:pt-6">
        <ClubCalendar initialEvents={events} todayKey={todayKey} />
        <p className="mt-4 text-xs text-steel-soft">
          Dane przykładowe — po podłączeniu backendu:{" "}
          <code className="text-ink">NEXT_PUBLIC_API_URL/api/events</code>
        </p>
      </div>
    </section>
  );
}
