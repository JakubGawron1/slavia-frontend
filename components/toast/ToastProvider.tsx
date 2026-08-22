"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  useListPanelFlags,
  useListPublicFlags,
} from "@/lib/api/generated/default/default";
import { isFlagEnabled, UI_TOASTS_FLAG } from "@/lib/public-flags";

export type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  title: string;
  message?: string;
  tone?: ToastTone;
  /** Domyślnie 5000 ms */
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
  tone: ToastTone;
  durationMs: number;
  createdAt: number;
};

type ToastContextValue = {
  push: (toast: ToastInput) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;
const MAX_VISIBLE = 4;

const TONE_ACCENT: Record<ToastTone, string> = {
  success: "bg-[#6CCB5F]",
  error: "bg-brand",
  info: "bg-[#60CDFF]",
};

const TONE_ICON: Record<ToastTone, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    leaveTimer.current = setTimeout(() => onClose(toast.id), 220);
  }, [onClose, toast.id]);

  useEffect(() => {
    closeTimer.current = setTimeout(dismiss, toast.durationMs);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, [dismiss, toast.durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative w-[min(100vw-1.5rem,22.5rem)] overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f]/95 text-white shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200 ease-out ${
        leaving ? "translate-x-4 opacity-0" : "animate-toast-in"
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${TONE_ACCENT[toast.tone]}`} />
      <div className="flex gap-3 px-3.5 py-3 pl-4">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white ${TONE_ACCENT[toast.tone]}`}
          aria-hidden
        >
          {TONE_ICON[toast.tone]}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-display text-[0.8rem] leading-snug tracking-wide uppercase">
            {toast.title}
          </p>
          {toast.message ? (
            <p className="mt-1 text-sm leading-snug text-white/70">
              {toast.message}
            </p>
          ) : null}
          <p className="mt-1.5 text-[0.65rem] tracking-wide text-white/35 uppercase">
            CKS Slavia
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="h-7 w-7 shrink-0 rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zamknij powiadomienie"
        >
          ×
        </button>
      </div>
      <div className="h-0.5 w-full bg-white/5">
        <div
          className={`animate-toast-progress h-full ${TONE_ACCENT[toast.tone]} opacity-70`}
          style={{ animationDuration: `${toast.durationMs}ms` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const pathname = usePathname() ?? "";
  const inPanels =
    pathname.startsWith("/klub") || pathname.startsWith("/panel");
  const publicFlags = useListPublicFlags({
    query: { enabled: !inPanels, staleTime: 60_000 },
  });
  const panelFlags = useListPanelFlags({
    query: { enabled: inPanels, staleTime: 60_000 },
  });
  const toastsEnabled = isFlagEnabled(
    inPanels ? panelFlags.data?.data : publicFlags.data?.data,
    UI_TOASTS_FLAG,
    true,
  );
  const enabledRef = useRef(toastsEnabled);
  enabledRef.current = toastsEnabled;

  useEffect(() => {
    if (!toastsEnabled) setItems([]);
  }, [toastsEnabled]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast: ToastInput) => {
    if (!enabledRef.current) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = {
      id,
      title: toast.title,
      message: toast.message,
      tone: toast.tone ?? "info",
      durationMs: toast.durationMs ?? DEFAULT_DURATION,
      createdAt: Date.now(),
    };
    setItems((prev) => [...prev, item].slice(-MAX_VISIBLE));
  }, []);

  // Stała referencja API — bez tego toast w deps useCallback(load) odpalał nieskończone refetch.
  const apiRef = useRef({ push });
  apiRef.current.push = push;

  const value = useMemo<ToastContextValue>(
    () => ({
      push: (toast) => apiRef.current.push(toast),
      success: (title, message) =>
        apiRef.current.push({ title, message, tone: "success" }),
      error: (title, message) =>
        apiRef.current.push({ title, message, tone: "error" }),
      info: (title, message) =>
        apiRef.current.push({ title, message, tone: "info" }),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastsEnabled ? (
        <div
          className="pointer-events-none fixed right-3 bottom-3 z-[80] flex max-w-full flex-col-reverse gap-2 sm:right-4 sm:bottom-4"
          aria-label="Powiadomienia akcji"
        >
          {items.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onClose={remove} />
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast musi być użyty wewnątrz ToastProvider.");
  }
  return ctx;
}
