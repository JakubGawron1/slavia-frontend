import { customFetch } from "@/lib/api/mutator";
import type { OkResponse } from "@/lib/api/generated/models";

/** Admin: wyślij mail z linkiem resetu hasła do użytkownika. */
export async function sendUserPasswordReset(userId: string) {
  return customFetch<{ data: OkResponse; status: number }>(
    `/api/users/${encodeURIComponent(userId)}/send-password-reset`,
    { method: "POST" },
  );
}
