"use server";
import { db } from "@/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { usersTable, verificationTokensTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist" };
  }
  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    return { error: "Token has expired" };
  }
  const existingUser = await getUserByEmail(existingToken.identifier);
  if (!existingUser) {
    return { error: "User with this email does not exist" };
  }

  await db
    .update(usersTable)
    .set({
      emailVerified: new Date(),
      email: existingToken.identifier,
    })
    .where(eq(usersTable.id, existingUser.id));

  await db
    .delete(verificationTokensTable)
    .where(eq(verificationTokensTable.identifier, existingToken.identifier));

  return { success: "Email verified" };
};
