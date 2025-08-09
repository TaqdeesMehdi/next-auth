"use server";

import z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/twoFactor-token";
import { db } from "@/db";
import { TwoFactorConfirmationTable, TwoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedField = LoginSchema.safeParse(values);
  if (!validatedField.success) {
    return { error: "Invalid Field!" };
  }
  const { email, password, code } = validatedField.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent" };
  }
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Token does not exist" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Code does not match" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Token has expired" };
      }

      await db
        .delete(TwoFactorToken)
        .where(eq(TwoFactorToken.identifier, twoFactorToken.identifier));

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db
          .delete(TwoFactorConfirmationTable)
          .where(eq(TwoFactorConfirmationTable.id, existingConfirmation.id));
      }

      await db.insert(TwoFactorConfirmationTable).values({
        userId: existingUser.id,
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    // Re-throw the error if it's not an AuthError
    // This allows NextAuth redirects to work properly
    throw error;
  }

  // This line should never be reached due to the redirect,
  // but return success just in case
  return { success: "Login successful!" };
};
