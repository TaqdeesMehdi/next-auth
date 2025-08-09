import { z } from "zod";

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
