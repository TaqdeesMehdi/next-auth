import { db } from "@/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { PasswordResetTokensTable, verificationTokensTable } from "@/db/schema";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(verificationTokensTable)
      .where(eq(verificationTokensTable.identifier, existingToken.identifier));
  }
  const verificationToken = await db
    .insert(verificationTokensTable)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning();

  return { ...verificationToken, email, token, expires };
};
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(PasswordResetTokensTable)
      .where(eq(PasswordResetTokensTable.identifier, existingToken.identifier));
  }
  const verificationToken = await db
    .insert(PasswordResetTokensTable)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning();

  return { ...verificationToken, email, token, expires };
};
