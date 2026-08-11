import Link from "next/link";

type LocationSectionProps = {
  ogloszeniaEnabled: boolean;
  calendarEnabled: boolean;
};

export function LocationSection({
  ogloszeniaEnabled,
  calendarEnabled,
}: LocationSectionProps) {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
          <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
            Gdzie nas znaleźć
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Slavia. Ruda Śląska.
            <span className="mt-2 block text-steel-soft">
              Poniedziałek 15:00.
            </span>
          </h2>

          <div className="mt-10 space-y-8">
            <div>
              <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
                Adres sali
              </p>
              <address className="mt-3 text-base leading-relaxed text-steel not-italic">
                CKS Slavia Ruda Śląska
                <br />
                ul. Konopnickiej 13
                <br />
                41-700 Ruda Śląska
              </address>
            </div>

            <div>
              <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
                Godziny treningów
              </p>
              <ul className="mt-3 space-y-2 text-base text-steel">
                <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                  <span>Poniedziałek</span>
                  <span className="font-display tracking-wide">15:00 – 18:00</span>
                </li>
                <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                  <span>Środa</span>
                  <span className="font-display tracking-wide">15:00 – 18:00</span>
                </li>
                <li className="flex justify-between gap-6 border-b border-mist py-2 max-w-xs">
                  <span>Piątek</span>
                  <span className="font-display tracking-wide">15:00 – 18:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end bg-chrome px-6 py-10 text-paper md:px-8 md:py-12">
          <p className="font-display text-sm tracking-[0.2em] text-brand uppercase">
            Sprawdź, jak smakuje sztanga
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-paper/75">
            Pierwszy trening jest bez zobowiązań. Wpadnij na salę, poznaj
            trenerów i drużynę — pokażemy, że ciężary są dla każdego, kto chce
            trochę popracować.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ogloszeniaEnabled ? (
              <Link
                href="/ogloszenia"
                className="bg-brand px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:bg-brand-deep"
              >
                Umów pierwszy trening
              </Link>
            ) : null}
            {calendarEnabled ? (
              <Link
                href="/kalendarz"
                className="border border-paper/30 px-6 py-3 font-display text-sm tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
              >
                Zobacz kalendarz
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
