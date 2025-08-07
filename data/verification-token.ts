import { db } from "@/db";
import { verificationTokensTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokensTable)
      .where(eq(verificationTokensTable.identifier, email));

    return verificationToken || null;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokensTable)
      .where(eq(verificationTokensTable.token, token));

    return verificationToken || null;
  } catch {
    return null;
  }
};
