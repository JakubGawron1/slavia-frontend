import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Podaj tytuł wydarzenia."),
    event_type: z.enum(["trening", "zawody"]),
    date: z.string().trim().min(1, "Podaj datę."),
    end_date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string(),
    plan_id: z.string(),
    plan_week: z.string(),
    plan_day: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.end_date && v.end_date < v.date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Data końca nie może być wcześniejsza niż data startu.",
      });
    }
    if (v.plan_week.trim()) {
      const n = Number(v.plan_week);
      if (!Number.isFinite(n) || n < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["plan_week"],
          message: "Tydzień planu musi być liczbą ≥ 1.",
        });
      }
    }
    if (v.plan_day.trim()) {
      const n = Number(v.plan_day);
      if (!Number.isFinite(n) || n < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["plan_day"],
          message: "Dzień planu musi być liczbą ≥ 1.",
        });
      }
    }
  });
