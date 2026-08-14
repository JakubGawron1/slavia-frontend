"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  getListNotificationsQueryKey,
  getUnreadCountQueryKey,
  useDeleteAllNotifications,
  useDeleteNotification,
  useListNotifications,
  useMarkAllRead,
  useUnreadCount,
  useUpdateNotification,
} from "@/lib/api/generated/notifications/notifications";
import type { Notification } from "@/lib/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/toast/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BellIcon } from "./BellIcon";
import { computePanelCoords, type PanelCoords } from "./notificationBellUtils";
import { NotificationPanelList } from "./NotificationPanelList";

type NotificationBellProps = {
  /** Dla layoutów na tle brand (np. ribbon) — jaśniejsza ramka. */
  variant?: "default" | "onBrand";
};

export function NotificationBell({ variant = "default" }: NotificationBellProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [coords, setCoords] = useState<PanelCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
  const items = (listQuery.data?.data as Notification[] | undefined) ?? [];

  const updateMutation = useUpdateNotification();
  const markAllMutation = useMarkAllRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  async function invalidate() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getUnreadCountQueryKey() }),
    ]);
  }

  const updatePosition = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    setCoords(computePanelCoords(el.getBoundingClientRect()));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (confirmClear) return;
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (confirmClear) return;
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, confirmClear]);

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
      toast.success("Oznaczono wszystkie jako przeczytane");
    } catch (err) {
      toast.error(
        "Powiadomienia",
        err instanceof Error ? err.message : "Nie udało się oznaczyć",
      );
    }
  }

  async function removeNotification(notification: Notification) {
    setDeletingId(notification.id);
    try {
      await deleteMutation.mutateAsync({ id: notification.id });
      await invalidate();
    } catch (err) {
      toast.error(
        "Powiadomienia",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function removeAll() {
    try {
      await deleteAllMutation.mutateAsync();
      await invalidate();
      setConfirmClear(false);
      toast.success("Usunięto wszystkie powiadomienia");
    } catch (err) {
      toast.error(
        "Powiadomienia",
        err instanceof Error ? err.message : "Nie udało się usunąć",
      );
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

  const panel =
    open && coords && mounted
      ? createPortal(
          <>
            <NotificationPanelList
              panelRef={panelRef}
              coords={coords}
              items={items}
              loading={listQuery.isLoading}
              unread={unread}
              markAllPending={markAllMutation.isPending}
              deleteAllPending={deleteAllMutation.isPending}
              deletingId={deletingId}
              onMarkAll={() => void markAll()}
              onDeleteAll={() => setConfirmClear(true)}
              onMarkRead={(n) => void markRead(n)}
              onDelete={(n) => void removeNotification(n)}
              onNavigate={() => setOpen(false)}
            />
            <ConfirmModal
              open={confirmClear}
              title="Usunąć wszystkie powiadomienia?"
              message="Skrzynka zostanie wyczyszczona. Tej operacji nie można cofnąć."
              confirmLabel="Usuń wszystkie"
              busy={deleteAllMutation.isPending}
              onClose={() => setConfirmClear(false)}
              onConfirm={() => void removeAll()}
            />
          </>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative shrink-0">
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
        onClick={() => {
          if (confirmClear) return;
          setOpen((v) => !v);
        }}
        className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${borderClass}`}
      >
        <BellIcon className="h-4 w-4" />
        {unread > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-brand px-1 font-display text-[9px] leading-none text-paper">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>
      {panel}
    </div>
  );
}
