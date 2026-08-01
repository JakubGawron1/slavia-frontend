import { getApiBaseUrl, getStoredToken } from "@/lib/auth";

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

export type KlubFetchOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  viewAsUserId?: string | null;
};

export async function klubFetch<T>(
  path: string,
  options: KlubFetchOptions = {},
): Promise<T> {
  const token = options.token ?? getStoredToken();
  if (!token) throw new Error("Brak sesji.");

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.viewAsUserId) {
    headers["X-View-As-User"] = options.viewAsUserId;
  }

  const method =
    options.method ??
    (options.body !== undefined ? "POST" : "GET");

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
