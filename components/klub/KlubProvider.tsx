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
import { usePathname, useRouter } from "next/navigation";
import {
  clearSession,
  destroySession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  hasAnyRole,
  storeSession,
  syncSessionCookie,
  type AuthUser,
  type Role,
} from "@/lib/auth";
import {
  canAccessPath,
  defaultActiveRole,
  STAFF_ROLES,
} from "@/lib/klub-nav";
import { previewStop } from "@/lib/api/generated/default/default";
import {
  clearViewAsStorage,
  readViewAs,
  writeViewAs,
  type ViewAsState,
} from "@/lib/view-as";
import { useInvalidateQueriesOnViewAs } from "@/lib/view-as-query";
import {
  EmailVerificationGate,
  needsEmailVerification,
} from "@/components/settings/EmailVerificationGate";

const ACTIVE_ROLE_KEY = "slavia_klub_active_role";
const NAV_COLLAPSE_KEY = "slavia_klub_nav_collapse";

export type { ViewAsState };

type KlubContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  collapsedCategories: Record<string, boolean>;
  toggleCategory: (id: string) => void;
  viewAs: ViewAsState;
  setViewAs: (value: ViewAsState) => void;
  clearViewAs: () => Promise<void>;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  logout: () => void;
  /** Bez argumentu — pobiera /me. Z obiektem — odświeża lokalny stan (np. po PATCH). */
  refreshUser: (next?: AuthUser) => Promise<void>;
};

const KlubContext = createContext<KlubContextValue | null>(null);

function readActiveRole(roles: Role[]): Role {
  if (typeof window === "undefined") return defaultActiveRole(roles);
  const raw = localStorage.getItem(ACTIVE_ROLE_KEY) as Role | null;
  if (raw && (roles.includes(raw) || roles.includes("superadmin"))) {
    return raw;
  }
  return defaultActiveRole(roles);
}

function readCollapsed(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(NAV_COLLAPSE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function KlubProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role>("admin");
  const [collapsedCategories, setCollapsed] = useState<Record<string, boolean>>(
    {},
  );
  const [viewAs, setViewAsState] = useState<ViewAsState>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cookieSyncedFor = useRef<string | null>(null);

  useInvalidateQueriesOnViewAs(viewAs?.userId ?? null);

  const refreshUser = useCallback(async (next?: AuthUser) => {
    if (next) {
      const token = getStoredToken();
      if (token) storeSession(token, next);
      setUser(next);
      setActiveRoleState(readActiveRole(next.roles));
      setError(null);
      return;
    }
    const token = getStoredToken();
    if (!token) {
      router.replace("/logowanie");
      return;
    }
    // Zawsze prawdziwy actor — bez X-View-As-User.
    const me = await fetchMe(token, { viewAsUserId: null });
    storeSession(token, me);
    setUser(me);
    setActiveRoleState(readActiveRole(me.roles));
    setError(null);
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
      if (cached && !cancelled) {
        setUser(cached);
        setActiveRoleState(readActiveRole(cached.roles));
        setCollapsed(readCollapsed());
        setViewAsState(readViewAs());
      }

      try {
        const me = await fetchMe(token, { viewAsUserId: null });
        if (cancelled) return;
        if (!hasAnyRole(me, STAFF_ROLES)) {
          if (!cancelled) setLoading(false);
          router.replace("/panel");
          return;
        }
        storeSession(token, me);
        setUser(me);
        setActiveRoleState(readActiveRole(me.roles));
        setCollapsed(readCollapsed());
        const preview = readViewAs();
        setViewAsState(preview);
        if (preview?.roles.length) {
          const pick =
            preview.roles.find((r) => r === localStorage.getItem(ACTIVE_ROLE_KEY)) ??
            preview.roles.find((r) => r !== "superadmin") ??
            preview.roles[0];
          if (pick) {
            setActiveRoleState(pick);
            localStorage.setItem(ACTIVE_ROLE_KEY, pick);
          }
        }
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
    if (pathname === "/klub" || pathname === "/klub/") return;
    if (!canAccessPath(pathname, user.roles)) {
      router.replace("/klub");
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    if (!user || loading) return;
    const token = getStoredToken();
    if (!token || cookieSyncedFor.current === token) return;
    cookieSyncedFor.current = token;
    void syncSessionCookie(token).catch(() => {
      cookieSyncedFor.current = null;
    });
  }, [user, loading]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(NAV_COLLAPSE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setViewAs = useCallback((value: ViewAsState) => {
    setViewAsState(value);
    writeViewAs(value);
  }, []);

  const clearViewAs = useCallback(async () => {
    try {
      await previewStop({ viewAsUserId: null });
    } catch {
      /* ignore — i tak czyścimy lokalnie */
    }
    setViewAsState(null);
    clearViewAsStorage();
    const real = getStoredUser();
    if (real) {
      const role = defaultActiveRole(real.roles);
      setActiveRoleState(role);
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    }
  }, []);

  const logout = useCallback(() => {
    void destroySession().then(() => {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
      clearViewAsStorage();
      router.push("/logowanie");
      router.refresh();
    });
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      activeRole,
      setActiveRole,
      collapsedCategories,
      toggleCategory,
      viewAs,
      setViewAs,
      clearViewAs,
      mobileNavOpen,
      setMobileNavOpen,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      error,
      activeRole,
      setActiveRole,
      collapsedCategories,
      toggleCategory,
      viewAs,
      setViewAs,
      clearViewAs,
      mobileNavOpen,
      logout,
      refreshUser,
    ],
  );

  return (
    <KlubContext.Provider value={value}>
      {children}
      {user && !loading && needsEmailVerification(user) ? (
        <EmailVerificationGate
          user={user}
          onUpdated={(next) => void refreshUser(next)}
        />
      ) : null}
    </KlubContext.Provider>
  );
}

export function useKlub() {
  const ctx = useContext(KlubContext);
  if (!ctx) throw new Error("useKlub musi być użyty wewnątrz KlubProvider");
  return ctx;
}
