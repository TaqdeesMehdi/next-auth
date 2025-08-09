import { db } from "@/db";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getTwoFactorTokenByEmail } from "@/data/twoFactor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import {
  PasswordResetTokensTable,
  TwoFactorToken,
  verificationTokensTable,
} from "@/db/schema";

export const generateTwoFactorToken = async (email: string) => {
  const token = await crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(TwoFactorToken)
      .where(eq(TwoFactorToken.identifier, existingToken.identifier));
  }

  const twoFactorToken = await db
    .insert(TwoFactorToken)
    .values({
      identifier: email,
      token,
      expires,
    })
    .returning();

  return { ...twoFactorToken, email, token, expires };
};

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
