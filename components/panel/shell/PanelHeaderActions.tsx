import Link from "next/link";
import { NotificationBell } from "@/components/notifications/NotificationBell";

type PanelHeaderActionsProps = {
  isStaff: boolean;
  onLogout: () => void;
  bellVariant?: "default" | "onBrand";
};

export function PanelHeaderActions({
  isStaff,
  onLogout,
  bellVariant = "default",
}: PanelHeaderActionsProps) {
  return (
    <div className="flex max-w-full flex-wrap items-center justify-end gap-1.5 sm:gap-2">
      <NotificationBell variant={bellVariant} />
      {isStaff ? (
        <Link
          href="/klub"
          className="panel-control border border-paper/20 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] uppercase transition-colors hover:border-brand sm:px-3 sm:text-[11px]"
        >
          <span className="sm:hidden">Klub</span>
          <span className="hidden sm:inline">Panel klubowy</span>
        </Link>
      ) : null}
      <Link
        href="/"
        className="panel-control border border-paper/15 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] text-paper/70 uppercase sm:px-3 sm:text-[11px]"
      >
        Witryna
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="panel-control border border-paper/15 px-2.5 py-1.5 font-display text-[10px] tracking-[0.1em] text-paper/70 uppercase sm:px-3 sm:text-[11px]"
      >
        Wyloguj
      </button>
    </div>
  );
}
