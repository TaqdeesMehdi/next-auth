import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return user || null;
  } catch {
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return user || null;
  } catch {
    return null;
  }
};
