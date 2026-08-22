import { z } from "zod";

export const wizardMetaSchema = z.object({
  title: z.string().trim().min(1, "Podaj tytuł planu."),
  weeks: z.number().int().min(4, "Min. 4 tygodnie.").max(16, "Max. 16 tygodni."),
  starts_on: z.string().optional(),
  notes: z.string().optional(),
});

export const wizardDaysSchema = z.object({
  weekdays: z.array(z.number().int().min(1).max(7)).min(1, "Wybierz co najmniej jeden dzień."),
});

export const wizardMainsSchema = z.object({
  days: z
    .array(
      z.object({
        weekday: z.number(),
        mains: z
          .array(z.object({ name: z.string().trim().min(1) }))
          .min(1, "Każdy dzień potrzebuje ćwiczenia."),
      }),
    )
    .min(1),
});

export const exerciseRecordSchema = z.object({
  exercise_id: z.string().trim().min(1, "Wybierz ćwiczenie."),
  kg: z.number().positive("Podaj ciężar w kg."),
  reps: z.number().int().min(1).max(12),
  achieved_on: z.string().trim().min(1, "Podaj datę."),
  kind: z.enum(["test", "training"]),
  notes: z.string().optional(),
});
