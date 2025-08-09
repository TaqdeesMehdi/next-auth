import { db } from "@/db";
import { TwoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const [twoFactorToken] = await db
      .select()
      .from(TwoFactorToken)
      .where(eq(TwoFactorToken.token, token));

    return twoFactorToken || null;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const [twoFactorToken] = await db
      .select()
      .from(TwoFactorToken)
      .where(eq(TwoFactorToken.identifier, email));

    return twoFactorToken || null;
  } catch {
    return null;
  }
};
