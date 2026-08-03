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
import { useRouter } from "next/navigation";
import {
  clearSession,
  destroySession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  storeSession,
  syncSessionCookie,
  type AuthUser,
} from "@/lib/auth";
import { canAccessAthletePanel } from "@/lib/panel-nav";

type PanelContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  /** Bez argumentu — pobiera /me. Z obiektem — odświeża lokalny stan (np. po PATCH). */
  refreshUser: (next?: AuthUser) => Promise<void>;
};

const PanelContext = createContext<PanelContextValue | null>(null);

export function PanelProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cookieSyncedFor = useRef<string | null>(null);

  const refreshUser = useCallback(async (next?: AuthUser) => {
    if (next) {
      const token = getStoredToken();
      if (token) storeSession(token, next);
      setUser(next);
      return;
    }
    const token = getStoredToken();
    if (!token) {
      router.replace("/logowanie");
      return;
    }
    const me = await fetchMe(token);
    storeSession(token, me);
    setUser(me);
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getStoredToken();
      if (!token) {
        clearSession();
        try {
          await destroySession();
        } catch {
          /* ignore */
        }
        if (!cancelled) setLoading(false);
        router.replace("/logowanie");
        return;
      }

      const cached = getStoredUser();
      if (cached && !cancelled) setUser(cached);

      try {
        const me = await fetchMe(token);
        if (cancelled) return;
        if (!canAccessAthletePanel(me.roles)) {
          if (!cancelled) setLoading(false);
          router.replace("/logowanie");
          return;
        }
        storeSession(token, me);
        setUser(me);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        clearSession();
        try {
          await destroySession();
        } catch {
          /* ignore */
        }
        setError(err instanceof Error ? err.message : "Sesja wygasła.");
        router.replace("/logowanie");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!user || loading) return;
    const token = getStoredToken();
    if (!token || cookieSyncedFor.current === token) return;
    cookieSyncedFor.current = token;
    void syncSessionCookie(token).catch(() => {
      cookieSyncedFor.current = null;
    });
  }, [user, loading]);

  const logout = useCallback(() => {
    void destroySession().then(() => {
      router.push("/logowanie");
      router.refresh();
    });
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, error, logout, refreshUser }),
    [user, loading, error, logout, refreshUser],
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}

export function usePanel() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel musi być w PanelProvider");
  return ctx;
}
