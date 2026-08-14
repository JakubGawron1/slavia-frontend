import Image from "next/image";

type ClubMarkProps = {
  className?: string;
  /** Dekoracyjny znak (domyślnie) — bez alt; inaczej dostępny opis. */
  alt?: string;
  /** Above-the-fold / LCP: `loading="eager"` + `fetchPriority="high"` (Next 16). */
  priority?: boolean;
};

/** Naturalne proporcje oryginalnego herbu (574×801). */
const HERB_W = 1148;
const HERB_H = 1600;

/** Oficjalny herb — przezroczyste tło + lekki cień pod ciemny chrome witryny. */
export function ClubMark({
  className = "h-10 w-auto",
  alt = "",
  priority = false,
}: ClubMarkProps) {
  return (
    <span className="inline-flex shrink-0 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.55))_drop-shadow(0_6px_14px_rgba(0,0,0,0.28))]">
      <Image
        src="/brand/cks-slavia-herb.png"
        alt={alt}
        width={HERB_W}
        height={HERB_H}
        sizes="(max-width: 768px) 56px, 72px"
        className={`object-contain ${className}`}
        style={{ width: "auto" }}
        aria-hidden={alt ? undefined : true}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </span>
  );
}
