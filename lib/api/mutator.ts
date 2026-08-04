/**
 * Orval custom fetch — zwraca { data, status, headers } jak oczekuje generator.
 */
export const customFetch = async <T>(
  url: string,
  options: RequestInit & {
    data?: unknown;
    params?: Record<string, unknown>;
  },
): Promise<T> => {
  const { getApiBaseUrl, getStoredToken } = await import("@/lib/auth");

  const method = (options.method ?? "GET").toUpperCase();
  const isPublic =
    url.includes("/api/health") ||
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/forgot-password") ||
    url.includes("/api/auth/reset-password") ||
    url.includes("/api/auth/email/confirm") ||
    url.includes("/api/flags/public") ||
    url.includes("/api/public/") ||
    url.includes("/api/openapi") ||
    (method === "POST" &&
      !url.includes("/api/contact/messages") &&
      url.includes("/api/contact"));

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!isPublic) {
    const token = getStoredToken();
    if (!token) throw new Error("Brak sesji.");
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.data !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let fullUrl = url.startsWith("http") ? url : `${getApiBaseUrl()}${url}`;
  if (options.params && Object.keys(options.params).length > 0) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined || value === null) continue;
      search.set(key, String(value));
    }
    const qs = search.toString();
    if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body:
      options.data !== undefined
        ? JSON.stringify(options.data)
        : options.body,
    signal: options.signal,
  });

  if (!response.ok) {
    let message = `Błąd serwera (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const text =
    [204, 205, 304].includes(response.status) || !response.body
      ? ""
      : await response.text();
  const data = text ? JSON.parse(text) : {};

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export default customFetch;
