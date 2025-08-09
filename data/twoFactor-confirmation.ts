import { db } from "@/db";
import { TwoFactorConfirmationTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const [twoFactorConfirmation] = await db
      .select()
      .from(TwoFactorConfirmationTable)
      .where(eq(TwoFactorConfirmationTable.userId, userId));

    return twoFactorConfirmation || null;
  } catch {
    return null;
  }
};
