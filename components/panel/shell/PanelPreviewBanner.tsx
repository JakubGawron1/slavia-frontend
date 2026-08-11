type PanelPreviewBannerProps = {
  displayName: string;
  email: string;
  onClear: () => void;
};

export function PanelPreviewBanner({
  displayName,
  email,
  onClear,
}: PanelPreviewBannerProps) {
  return (
    <div className="relative z-50 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-sm">
      <p>
        Tryb podglądu: <span className="font-medium text-paper">{displayName}</span>{" "}
        <span className="text-paper/55">({email})</span>
        <span className="ml-2 text-paper/45">· tylko odczyt</span>
      </p>
      <button
        type="button"
        onClick={onClear}
        className="panel-control border border-paper/30 px-3 py-1 font-display text-[11px] tracking-[0.12em] uppercase transition-colors hover:border-paper hover:bg-paper/10"
      >
        Zakończ podgląd
      </button>
    </div>
  );
}
