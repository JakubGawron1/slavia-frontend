import { z } from "zod";

export const analyzedLiftSchema = z.enum([
  "snatch",
  "power_snatch",
  "clean",
  "power_clean",
  "jerk",
  "clean_and_jerk",
  "accessory",
]);

export type AnalyzedLiftValue = z.infer<typeof analyzedLiftSchema>;

export const liftAnalyzeInputSchema = z
  .object({
    lift: analyzedLiftSchema,
    note: z.string().trim().max(400, "Notatka max 400 znaków.").optional(),
  })
  .superRefine((val, ctx) => {
    if (val.lift === "accessory" && !val.note) {
      ctx.addIssue({
        code: "custom",
        message: "Przy akcesorium dopisz nazwę ruchu (np. hang snatch).",
        path: ["note"],
      });
    }
  });
