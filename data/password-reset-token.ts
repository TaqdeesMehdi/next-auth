import { db } from "@/db";
import { eq } from "drizzle-orm";
import { PasswordResetTokensTable } from "@/db/schema";
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const [passwordToken] = await db
      .select()
      .from(PasswordResetTokensTable)
      .where(eq(PasswordResetTokensTable.token, token));

    return passwordToken || null;
  } catch {
    return null;
  }
};
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const [passwordToken] = await db
      .select()
      .from(PasswordResetTokensTable)
      .where(eq(PasswordResetTokensTable.identifier, email));

    return passwordToken || null;
  } catch {
    return null;
  }
};
