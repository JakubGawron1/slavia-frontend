"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getListNotificationsQueryKey,
  getUnreadCountQueryKey,
  useListNotifications,
  useMarkAllRead,
  useUnreadCount,
  useUpdateNotification,
} from "@/lib/api/generated/notifications/notifications";
import type { Notification } from "@/lib/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function formatRelative(iso: string): string {
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

type NotificationBellProps = {
  /** Dla layoutów na tle brand (np. ribbon) — jaśniejsza ramka. */
  variant?: "default" | "onBrand";
};

export function NotificationBell({ variant = "default" }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const unreadQuery = useUnreadCount({
    query: {
      refetchInterval: 30_000,
      staleTime: 10_000,
    },
  });
  const unread =
    (unreadQuery.data?.data as { count?: number } | undefined)?.count ?? 0;

  const listQuery = useListNotifications({
    query: {
      enabled: open,
      staleTime: 5_000,
    },
  });
  const items =
    (listQuery.data?.data as Notification[] | undefined) ?? [];

  const updateMutation = useUpdateNotification();
  const markAllMutation = useMarkAllRead();

  async function invalidate() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getUnreadCountQueryKey() }),
    ]);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function markRead(notification: Notification) {
    if (notification.read) return;
    try {
      await updateMutation.mutateAsync({
        id: notification.id,
        data: { read: true },
      });
      await invalidate();
    } catch {
      /* ignore — lista i tak się odświeży */
    }
  }

  async function markAll() {
    try {
      await markAllMutation.mutateAsync();
      await invalidate();
    } catch {
      /* ignore */
    }
  }

  const borderClass =
    variant === "onBrand"
      ? open
        ? "border-paper/50 bg-paper/15 text-paper"
        : "border-paper/30 text-paper/85 hover:border-paper/50 hover:text-paper"
      : open
        ? "border-brand bg-brand/20 text-paper"
        : "border-paper/15 text-paper/55 hover:border-paper/40 hover:text-paper";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={
          unread > 0
            ? `Powiadomienia (${unread} nieprzeczytanych)`
            : "Powiadomienia"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Powiadomienia"
        onClick={() => setOpen((v) => !v)}
        className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${borderClass}`}
      >
        <BellIcon className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-brand px-1 font-display text-[9px] leading-none text-paper">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Skrzynka powiadomień"
          className="absolute top-full right-0 z-50 mt-2 flex w-[min(100vw-2rem,22rem)] flex-col border border-paper/15 bg-ink shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-paper/10 px-3 py-2.5">
            <p className="font-display text-[11px] tracking-[0.14em] text-paper uppercase">
              Powiadomienia
            </p>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => void markAll()}
                disabled={markAllMutation.isPending}
                className="font-display text-[10px] tracking-[0.1em] text-brand uppercase transition-colors hover:text-paper disabled:opacity-50"
              >
                Oznacz wszystkie
              </button>
            ) : null}
          </div>

          <ul className="max-h-[min(70vh,24rem)] overflow-y-auto overscroll-contain">
            {listQuery.isLoading ? (
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
                  ? "block w-full border-b border-paper/5 px-3 py-3 text-left transition-colors hover:bg-paper/5"
                  : "block w-full border-b border-paper/5 bg-brand/5 px-3 py-3 text-left transition-colors hover:bg-brand/10";

                if (n.href) {
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        className={itemClass}
                        onClick={() => {
                          void markRead(n);
                          setOpen(false);
                        }}
                      >
                        {content}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={itemClass}
                      onClick={() => void markRead(n)}
                    >
                      {content}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
