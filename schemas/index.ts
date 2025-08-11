import { z } from "zod";
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["ADMIN", "USER"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "New Password is required",
      path: ["newPassword"],
    }
  );
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password is required of at least 6 characters",
  }),
});

export const ResetSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Enter a Valid email",
  }),
});

export const LoginSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Enter a Valid email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Enter a Valid email",
  }),
  password: z.string().min(6, {
    message: "Minimum password of 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
