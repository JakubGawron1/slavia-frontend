import type { ClubEvent, EventType } from "@/lib/events";

export const TYPE_STYLES: Record<EventType, string> = {
  zawody: "bg-brand text-paper",
  trening: "bg-[#2f6f7e] text-paper",
  zebranie: "bg-mist text-ink",
  inne: "bg-background text-ink ring-1 ring-mist",
};

export const EVENT_BAR: Record<EventType, string> = {
  zawody: "bg-brand text-paper",
  trening: "bg-[#2f6f7e] text-paper",
  zebranie: "bg-[#5a5248] text-paper",
  inne: "bg-[#4b5563] text-paper",
};

export type CalendarTone = "site" | "panel";

export type ToneClasses = {
  rootBorder: string;
  rootBg: string;
  title: string;
  muted: string;
  chipIdle: string;
  chipActive: string;
  headerBg: string;
  cellIn: string;
  cellOut: string;
  cellSelected: string;
  dayNum: string;
  asideDark: string;
  asideLight: string;
  asideTitle: string;
};

export const TONES: Record<CalendarTone, ToneClasses> = {
  site: {
    rootBorder: "border-mist",
    rootBg: "bg-surface",
    title: "text-ink",
    muted: "text-steel",
    chipIdle: "border border-mist text-steel hover:border-steel-soft hover:text-ink",
    chipActive: "bg-brand text-paper",
    headerBg: "bg-background/80",
    cellIn: "bg-surface text-ink hover:bg-background",
    cellOut: "bg-background/70 text-steel-soft/60",
    cellSelected: "bg-brand/[0.08] ring-2 ring-inset ring-brand",
    dayNum: "text-ink",
    asideDark: "border-mist bg-chrome text-paper",
    asideLight: "border-mist bg-surface",
    asideTitle: "text-ink",
  },
  panel: {
    rootBorder: "border-paper/15",
    rootBg: "bg-chrome/55",
    title: "text-paper",
    muted: "text-paper/55",
    chipIdle:
      "border border-paper/20 text-paper/60 hover:border-paper/40 hover:text-paper",
    chipActive: "bg-brand text-paper",
    headerBg: "bg-paper/[0.04]",
    cellIn: "bg-chrome/40 text-paper hover:bg-paper/[0.06]",
    cellOut: "bg-chrome/20 text-paper/30",
    cellSelected: "bg-brand/15 ring-2 ring-inset ring-brand",
    dayNum: "text-paper",
    asideDark: "border-paper/15 bg-chrome/80 text-paper",
    asideLight: "border-paper/15 bg-chrome/50",
    asideTitle: "text-paper",
  },
};

/** Handler wyboru wydarzenia — wspólny dla widoku kalendarza i agendy. */
export type SelectEventHandler = (
  event: ClubEvent,
  anchor?: DOMRect,
  source?: "calendar" | "agenda" | "aside",
) => void;
