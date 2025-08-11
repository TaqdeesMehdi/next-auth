"use server";
import { z } from "zod";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import { SettingsSchema } from "@/schemas";
import { currentUserServer } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getUserById } from "@/data/user";
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUserServer();
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (!user.id) {
    return { error: "User Id does not exist" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email is already in use" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.token,
      verificationToken.email
    );

    return { success: "Verification email is sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatcher = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatcher) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  await db
    .update(usersTable)
    .set({ ...values })
    .where(eq(usersTable.id, dbUser.id));
  return { success: "Settings updated" };
};
