"use server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { z } from "zod";
import { db } from "@/db";
import { PasswordResetTokensTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Fields are missing!" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    return { error: "Token has expired" };
  }
  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "User email does not exist" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, existingUser.id));

  await db
    .delete(PasswordResetTokensTable)
    .where(eq(PasswordResetTokensTable.identifier, existingToken.identifier));

  return { success: "Password updated successfully" };
};
