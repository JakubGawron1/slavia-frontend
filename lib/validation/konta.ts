import { z } from "zod";
import { isDevEmail } from "@/lib/email";

const emailField = z
  .string()
  .trim()
  .min(1, "Podaj e-mail.")
  .email("Podaj poprawny e-mail.");

export const createUserFormSchema = z
  .object({
    name: z.string(),
    email: emailField,
    password: z.string(),
    roles: z.array(z.string()).min(1, "Wybierz co najmniej jedną rolę."),
    photoUrl: z.string(),
  })
  .superRefine((v, ctx) => {
    if (isDevEmail(v.email) && v.password.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message:
          "Dla adresów .dev / .local hasło musi mieć co najmniej 6 znaków.",
      });
    }
  });

export const updateUserFormSchema = z
  .object({
    name: z.string().trim().min(1, "Podaj nazwę wyświetlaną."),
    email: emailField,
    password: z.string(),
    roles: z.array(z.string()).min(1, "Wybierz co najmniej jedną rolę."),
    photoUrl: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.password && isDevEmail(v.email) && v.password.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message:
          "Dla adresów .dev / .local hasło musi mieć co najmniej 6 znaków.",
      });
    }
  });

export const profileFormSchema = z
  .object({
    name: z.string().trim().min(1, "Podaj imię i nazwisko / nazwę profilu."),
    accountMode: z.enum(["none", "existing", "new"]),
    userId: z.string(),
    accountEmail: z.string(),
    accountPassword: z.string(),
    weight: z.string(),
    birthDate: z.string(),
    sex: z.string(),
    photoUrl: z.string(),
    notes: z.string(),
    category: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.accountMode === "existing" && !v.userId) {
      ctx.addIssue({
        code: "custom",
        path: ["userId"],
        message: "Wybierz konto zawodnika z listy.",
      });
    }
    if (v.accountMode === "new") {
      const email = v.accountEmail.trim();
      if (!email) {
        ctx.addIssue({
          code: "custom",
          path: ["accountEmail"],
          message: "Podaj e-mail dla nowego konta.",
        });
      } else if (!z.string().email().safeParse(email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["accountEmail"],
          message: "Podaj poprawny e-mail.",
        });
      } else if (isDevEmail(email) && v.accountPassword.length < 6) {
        ctx.addIssue({
          code: "custom",
          path: ["accountPassword"],
          message: "Dla adresów .dev / .local podaj hasło (min. 6 znaków).",
        });
      }
    }
    if (v.weight.trim()) {
      const n = Number(v.weight);
      if (!Number.isFinite(n) || n <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["weight"],
          message: "Masa ciała musi być liczbą > 0.",
        });
      }
    }
  });
