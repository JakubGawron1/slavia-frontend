"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearSession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  hasAnyRole,
  storeSession,
  type AuthUser,
  type Role,
} from "@/lib/auth";
import {
  canAccessPath,
  defaultActiveRole,
  STAFF_ROLES,
} from "@/lib/klub-nav";

const ACTIVE_ROLE_KEY = "slavia_klub_active_role";
const VIEW_AS_KEY = "slavia_klub_view_as";
const NAV_COLLAPSE_KEY = "slavia_klub_nav_collapse";

export type ViewAsState = {
  userId: string;
  displayName: string;
  email: string;
  roles: Role[];
} | null;

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
  clearViewAs: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
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

function readViewAs(): ViewAsState {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(VIEW_AS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ViewAsState;
  } catch {
    return null;
  }
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

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/logowanie");
      return;
    }
    const me = await fetchMe(token);
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
        const me = await fetchMe(token);
        if (cancelled) return;
        if (!hasAnyRole(me, STAFF_ROLES)) {
          router.replace("/panel");
          return;
        }
        storeSession(token, me);
        setUser(me);
        setActiveRoleState(readActiveRole(me.roles));
        setCollapsed(readCollapsed());
        setViewAsState(readViewAs());
        setError(null);
      } catch (err) {
        if (cancelled) return;
        clearSession();
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
    if (!canAccessPath(pathname, user.roles)) {
      router.replace("/klub");
    }
  }, [user, loading, pathname, router]);

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
    if (value) {
      localStorage.setItem(VIEW_AS_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(VIEW_AS_KEY);
    }
  }, []);

  const clearViewAs = useCallback(() => {
    setViewAs(null);
  }, [setViewAs]);

  const logout = useCallback(() => {
    clearSession();
    localStorage.removeItem(ACTIVE_ROLE_KEY);
    localStorage.removeItem(VIEW_AS_KEY);
    router.push("/logowanie");
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

  return <KlubContext.Provider value={value}>{children}</KlubContext.Provider>;
}

export function useKlub() {
  const ctx = useContext(KlubContext);
  if (!ctx) throw new Error("useKlub musi być użyty wewnątrz KlubProvider");
  return ctx;
}
