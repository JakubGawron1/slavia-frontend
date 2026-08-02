import { getApiBaseUrl, getStoredToken } from "@/lib/auth";

type UploadResponse = {
  url: string;
  provider: string;
  file_id?: string | null;
};

type DeleteResponse = {
  ok: boolean;
  deleted_remote: boolean;
};

async function parseError(response: Response): Promise<string> {
  let message = `Błąd serwera (${response.status})`;
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) message = body.error;
  } catch {
    /* ignore */
  }
  return message;
}

/**
 * Upload obrazu przez backend (ImageKit / docelowo Cloudinary).
 * Pole multipart: `file`.
 */
export async function uploadImageFile(file: File): Promise<string> {
  const token = getStoredToken();
  if (!token) throw new Error("Brak sesji.");

  const form = new FormData();
  form.append("file", file, file.name || "avatar.jpg");

  const response = await fetch(`${getApiBaseUrl()}/api/uploads/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as UploadResponse;
  if (!data.url) throw new Error("Brak URL w odpowiedzi uploadu.");
  return data.url;
}

/**
 * Usuwa obraz z providera (ImageKit), gdy URL należy do niego.
 * Zewnętrzne URL-e — OK bez remote delete.
 */
export async function deleteImageFile(url: string): Promise<DeleteResponse> {
  const token = getStoredToken();
  if (!token) throw new Error("Brak sesji.");

  const trimmed = url.trim();
  if (!trimmed) {
    return { ok: true, deleted_remote: false };
  }

  const response = await fetch(`${getApiBaseUrl()}/api/uploads/image`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: trimmed }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as DeleteResponse;
}
