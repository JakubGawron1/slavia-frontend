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
  hasRole,
  storeSession,
  syncSessionCookie,
  type AuthUser,
} from "@/lib/auth";
import { klubFetch } from "@/lib/klub-api";
import { canAccessAthletePanel } from "@/lib/panel-nav";
import {
  clearViewAsStorage,
  readViewAs,
  type ViewAsState,
} from "@/lib/view-as";
import { useInvalidateQueriesOnViewAs } from "@/lib/view-as-query";
import {
  EmailVerificationGate,
  needsEmailVerification,
} from "@/components/settings/EmailVerificationGate";

type PanelContextValue = {
  user: AuthUser | null;
  /** Prawdziwy actor (z sesji), gdy trwa podgląd. */
  actor: AuthUser | null;
  viewAs: ViewAsState;
  loading: boolean;
  error: string | null;
  logout: () => void;
  clearViewAs: () => Promise<void>;
  /** Bez argumentu — pobiera /me. Z obiektem — odświeża lokalny stan (np. po PATCH). */
  refreshUser: (next?: AuthUser) => Promise<void>;
};

const PanelContext = createContext<PanelContextValue | null>(null);

export function PanelProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [actor, setActor] = useState<AuthUser | null>(null);
  const [viewAs, setViewAsState] = useState<ViewAsState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cookieSyncedFor = useRef<string | null>(null);

  useInvalidateQueriesOnViewAs(viewAs?.userId ?? null);

  const clearViewAs = useCallback(async () => {
    try {
      await klubFetch("/api/admin/preview/stop", {
        method: "POST",
        body: {},
        viewAsUserId: null,
      });
    } catch {
      /* ignore */
    }
    clearViewAsStorage();
    setViewAsState(null);
    const token = getStoredToken();
    const real = getStoredUser();
    if (token && real) {
      setActor(real);
      setUser(real);
    }
    router.push("/klub/podglad");
  }, [router]);

  const refreshUser = useCallback(async (next?: AuthUser) => {
    const preview = readViewAs();
    if (next) {
      if (!preview) {
        const token = getStoredToken();
        if (token) storeSession(token, next);
        setActor(next);
      }
      setUser(next);
      return;
    }
    const token = getStoredToken();
    if (!token) {
      router.replace("/logowanie");
      return;
    }
    if (preview) {
      const me = await fetchMe(token);
      setUser(me);
      return;
    }
    const me = await fetchMe(token, { viewAsUserId: null });
    storeSession(token, me);
    setActor(me);
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
      const preview = readViewAs();
      if (!cancelled) {
        setViewAsState(preview);
        if (cached) setActor(cached);
        if (preview) {
          setUser({
            id: preview.userId,
            display_name: preview.displayName,
            email: preview.email,
            roles: preview.roles,
            is_active: true,
          });
        } else if (cached) {
          setUser(cached);
        }
      }

      try {
        if (preview) {
          const real =
            cached ?? (await fetchMe(token, { viewAsUserId: null }));
          if (cancelled) return;
          if (!hasRole(real, "superadmin")) {
            clearViewAsStorage();
            if (!cancelled) setLoading(false);
            router.replace("/logowanie");
            return;
          }
          storeSession(token, real);
          setActor(real);
          const target = await fetchMe(token);
          if (cancelled) return;
          setUser(target);
          setViewAsState(preview);
          setError(null);
        } else {
          const me = await fetchMe(token, { viewAsUserId: null });
          if (cancelled) return;
          if (!canAccessAthletePanel(me.roles)) {
            if (!cancelled) setLoading(false);
            router.replace("/logowanie");
            return;
          }
          storeSession(token, me);
          setActor(me);
          setUser(me);
          setViewAsState(null);
          setError(null);
        }
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
      clearViewAsStorage();
      router.push("/logowanie");
      router.refresh();
    });
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      actor,
      viewAs,
      loading,
      error,
      logout,
      clearViewAs,
      refreshUser,
    }),
    [user, actor, viewAs, loading, error, logout, clearViewAs, refreshUser],
  );

  const gateUser = viewAs ? null : user;

  return (
    <PanelContext.Provider value={value}>
      {children}
      {gateUser && !loading && needsEmailVerification(gateUser) ? (
        <EmailVerificationGate
          user={gateUser}
          onUpdated={(next) => void refreshUser(next)}
        />
      ) : null}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel musi być w PanelProvider");
  return ctx;
}
