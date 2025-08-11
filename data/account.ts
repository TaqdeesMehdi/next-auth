import { db } from "@/db";
import { accountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getAccountByUserId = async (userId: string) => {
  try {
    const [account] = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId));
    return account;
  } catch {
    return null;
  }
};
