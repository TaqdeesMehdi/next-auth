"use server";

import { z } from "zod";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/schema";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedField = RegisterSchema.safeParse(values);
  if (!validatedField.success) {
    return { error: "Invalid Field!" };
  }
  const { email, password, name } = validatedField.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exist" };
  }
  await db.insert(usersTable).values({
    name,
    email,
    password: hashedPassword,
  });
  //TODO: Send verification Token Email
  return { success: "User Created" };
};
