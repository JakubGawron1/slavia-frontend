export type Role = "zawodnik" | "trener" | "admin" | "superadmin";

export type AuthUser = {
  id: string;
  email: string;
  display_name: string;
  roles: Role[];
};

export type LoginResponse = {
  token: string;
  token_type: string;
  expires_in_hours: number;
  user: AuthUser;
};

const TOKEN_KEY = "slavia_auth_token";
const USER_KEY = "slavia_auth_user";

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8080"
  );
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasRole(user: AuthUser | null, role: Role): boolean {
  if (!user) return false;
  return user.roles.includes("superadmin") || user.roles.includes(role);
}

export function hasAnyRole(user: AuthUser | null, roles: Role[]): boolean {
  if (!user) return false;
  if (user.roles.includes("superadmin")) return true;
  return roles.some((role) => user.roles.includes(role));
}

type ApiErrorBody = { error?: string };

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body.error) return body.error;
  } catch {
    /* ignore */
  }
  return `Błąd serwera (${response.status})`;
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as LoginResponse;
}

export async function fetchMe(token?: string): Promise<AuthUser> {
  const authToken = token ?? getStoredToken();
  if (!authToken) {
    throw new Error("Brak sesji.");
  }

  const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as AuthUser;
}
