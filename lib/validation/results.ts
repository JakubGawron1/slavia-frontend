import { z } from "zod";

const positiveKg = z
  .string()
  .trim()
  .min(1, "Podaj masę ciała (kg).")
  .refine((s) => {
    const n = Number(s);
    return Number.isFinite(n) && n > 0;
  }, "Podaj masę ciała (kg).");

const isoDate = z.string().trim().min(1, "Podaj datę.");

export const staffResultCreateSchema = z.object({
  hasProfile: z
    .boolean()
    .refine((v) => v, { message: "Wybierz profil zawodnika." }),
  bodyweight: positiveKg,
  eventDate: isoDate,
  eventName: z.string(),
  snatch: z.string(),
  cj: z.string(),
  venue: z.string(),
});

export const staffResultEditSchema = z
  .object({
    isCompetition: z.boolean(),
    eventDate: isoDate,
    eventName: z.string(),
    bodyweight: z.string(),
  })
  .superRefine((v, ctx) => {
    if (!v.isCompetition) return;
    if (!v.eventName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["eventName"],
        message: "Podaj nazwę zawodów.",
      });
    }
    const n = Number(v.bodyweight);
    if (!Number.isFinite(n) || n <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["bodyweight"],
        message: "Podaj masę ciała (kg).",
      });
    }
  });

export const panelResultCreateSchema = z
  .object({
    kind: z.enum(["competition", "training"]),
    eventDate: z.string().trim().min(1, "Podaj datę zawodów / treningu."),
    eventName: z.string(),
    bodyweight: z.string(),
    profileReady: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.kind !== "competition") return;
    if (!v.profileReady) {
      ctx.addIssue({
        code: "custom",
        path: ["profileReady"],
        message:
          "Uzupełnij w profilu datę urodzenia i płeć — kategoria wylicza się automatycznie.",
      });
    }
    const n = Number(v.bodyweight);
    if (!Number.isFinite(n) || n <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["bodyweight"],
        message: "Podaj masę ciała na zawodach (kg).",
      });
    }
  });

export const panelResultEditSchema = z
  .object({
    isCompetition: z.boolean(),
    eventDate: z.string().trim().min(1, "Podaj datę zawodów / treningu."),
    eventName: z.string(),
    bodyweight: z.string(),
    profileReady: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (!v.isCompetition) return;
    if (!v.profileReady) {
      ctx.addIssue({
        code: "custom",
        path: ["profileReady"],
        message:
          "Uzupełnij w profilu datę urodzenia i płeć — kategoria wylicza się automatycznie.",
      });
    }
    if (!v.eventName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["eventName"],
        message: "Podaj nazwę zawodów.",
      });
    }
    const n = Number(v.bodyweight);
    if (!Number.isFinite(n) || n <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["bodyweight"],
        message: "Podaj masę ciała na zawodach (kg).",
      });
    }
  });
