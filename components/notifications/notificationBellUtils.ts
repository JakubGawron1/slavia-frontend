const PANEL_MARGIN = 12;
const PANEL_MAX_WIDTH = 22 * 16; // 22rem
const PANEL_MAX_HEIGHT = 24 * 16; // 24rem
const PANEL_GAP = 8;

export type PanelCoords = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

export function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "przed chwilą";
    if (mins < 60) return `${mins} min temu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} godz. temu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} dni temu`;
    return new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function computePanelCoords(anchor: DOMRect): PanelCoords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(PANEL_MAX_WIDTH, vw - PANEL_MARGIN * 2);

  let left = anchor.right - width;
  left = Math.max(PANEL_MARGIN, Math.min(left, vw - PANEL_MARGIN - width));

  const spaceBelow = vh - anchor.bottom - PANEL_MARGIN - PANEL_GAP;
  const spaceAbove = anchor.top - PANEL_MARGIN - PANEL_GAP;
  const preferred = Math.min(PANEL_MAX_HEIGHT, vh * 0.7);

  let top: number;
  let maxHeight: number;

  if (spaceBelow >= Math.min(preferred, 200) || spaceBelow >= spaceAbove) {
    top = anchor.bottom + PANEL_GAP;
    maxHeight = Math.max(140, Math.min(preferred, spaceBelow));
  } else {
    maxHeight = Math.max(140, Math.min(preferred, spaceAbove));
    top = anchor.top - PANEL_GAP - maxHeight;
    if (top < PANEL_MARGIN) {
      top = PANEL_MARGIN;
      maxHeight = Math.max(140, anchor.top - PANEL_MARGIN - PANEL_GAP);
    }
  }

  return { top, left, width, maxHeight };
}
