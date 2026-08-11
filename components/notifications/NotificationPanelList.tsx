import Link from "next/link";
import type { RefObject } from "react";
import type { Notification } from "@/lib/api/generated/models";
import { formatRelative, type PanelCoords } from "./notificationBellUtils";

type NotificationPanelListProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  coords: PanelCoords;
  items: Notification[];
  loading: boolean;
  unread: number;
  markAllPending: boolean;
  deletingId: string | null;
  onMarkAll: () => void;
  onMarkRead: (n: Notification) => void;
  onDelete: (n: Notification) => void;
  onNavigate: () => void;
};

export function NotificationPanelList({
  panelRef,
  coords,
  items,
  loading,
  unread,
  markAllPending,
  deletingId,
  onMarkAll,
  onMarkRead,
  onDelete,
  onNavigate,
}: NotificationPanelListProps) {
  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Skrzynka powiadomień"
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: coords.width,
        maxHeight: coords.maxHeight,
        zIndex: 60,
      }}
      className="flex flex-col border border-paper/15 bg-chrome shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-paper/10 px-3 py-2.5">
        <p className="font-display text-[11px] tracking-[0.14em] text-paper uppercase">
          Powiadomienia
        </p>
        {unread > 0 ? (
          <button
            type="button"
            onClick={onMarkAll}
            disabled={markAllPending}
            className="font-display text-[10px] tracking-[0.1em] text-brand uppercase transition-colors hover:text-paper disabled:opacity-50"
          >
            Oznacz wszystkie
          </button>
        ) : null}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {loading ? (
          <li className="px-3 py-6 text-center text-sm text-paper/45">
            Ładowanie…
          </li>
        ) : items.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-paper/45">
            Brak powiadomień.
          </li>
        ) : (
          items.map((n) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={
                      n.read
                        ? "text-sm text-paper/70"
                        : "text-sm font-medium text-paper"
                    }
                  >
                    {n.title}
                  </p>
                  {!n.read ? (
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-paper/50">
                  {n.body}
                </p>
                <p className="mt-1.5 font-display text-[10px] tracking-[0.08em] text-paper/35 uppercase">
                  {formatRelative(n.created_at)}
                </p>
              </>
            );

            const itemClass = n.read
              ? "block min-w-0 flex-1 px-3 py-3 text-left transition-colors hover:bg-paper/5"
              : "block min-w-0 flex-1 bg-brand/5 px-3 py-3 text-left transition-colors hover:bg-brand/10";

            return (
              <li
                key={n.id}
                className="group flex items-stretch border-b border-paper/5"
              >
                {n.href ? (
                  <Link
                    href={n.href}
                    className={itemClass}
                    onClick={() => {
                      onMarkRead(n);
                      onNavigate();
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => onMarkRead(n)}
                  >
                    {content}
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Usuń powiadomienie"
                  title="Usuń"
                  disabled={deletingId === n.id}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete(n);
                  }}
                  className="flex w-9 shrink-0 items-start justify-center pt-3 text-paper/30 transition-colors hover:bg-paper/5 hover:text-paper/70 disabled:opacity-40"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
