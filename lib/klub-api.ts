import { getApiBaseUrl, getStoredToken } from "@/lib/auth";
import { readViewAsUserId } from "@/lib/view-as";

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

export type ApiMutatorOptions = {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Gdy false — nie wymagaj Bearer (endpointy publiczne). */
  auth?: boolean;
  /**
   * `undefined` — automatycznie z localStorage (aktywny podgląd).
   * `null` — wymuś brak nagłówka (np. /me actora w KlubProvider).
   * string — konkretny target.
   */
  viewAsUserId?: string | null;
};

/**
 * Mutator Orval — fetch + opcjonalny Bearer / X-View-As-User.
 */
export async function apiMutator<T>(options: ApiMutatorOptions): Promise<T> {
  const {
    url,
    method,
    params,
    data,
    headers: extraHeaders,
    signal,
    auth = true,
    viewAsUserId,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (auth) {
    const token = getStoredToken();
    if (!token) throw new Error("Brak sesji.");
    headers.Authorization = `Bearer ${token}`;
  }

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const resolvedViewAs =
    viewAsUserId === undefined ? readViewAsUserId() : viewAsUserId;
  if (resolvedViewAs) {
    headers["X-View-As-User"] = resolvedViewAs;
  }

  let fullUrl = url.startsWith("http") ? url : `${getApiBaseUrl()}${url}`;
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      search.set(key, String(value));
    }
    const qs = search.toString();
    if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** @deprecated Używaj apiMutator / klienta Orval. */
export type KlubFetchOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  viewAsUserId?: string | null;
  auth?: boolean;
};

/** @deprecated Używaj wygenerowanych funkcji Orval. */
export async function klubFetch<T>(
  path: string,
  options: KlubFetchOptions = {},
): Promise<T> {
  return apiMutator<T>({
    url: path,
    method:
      options.method ??
      (options.body !== undefined ? "POST" : "GET"),
    data: options.body,
    auth: options.auth ?? true,
    viewAsUserId: options.viewAsUserId,
  });
}
