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
  })
  .superRefine((v, ctx) => {
    if (v.end_date && v.end_date < v.date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Data końca nie może być wcześniejsza niż data startu.",
      });
    }
  });
