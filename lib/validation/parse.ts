import { z } from "zod";

export function zodErrorMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Nieprawidłowe dane";
}

export function parseOrMessage<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
): { ok: true; data: z.infer<S> } | { ok: false; message: string } {
  const r = schema.safeParse(data);
  if (r.success) return { ok: true, data: r.data };
  return { ok: false, message: zodErrorMessage(r.error) };
}
