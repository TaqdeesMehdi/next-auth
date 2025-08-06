import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Enter a Valid email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
