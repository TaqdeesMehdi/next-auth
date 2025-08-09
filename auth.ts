import { db } from "@/db";
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserById } from "./data/user";
import {
  accountsTable,
  TwoFactorConfirmationTable,
  usersTable,
  verificationTokensTable,
} from "./db/schema";
import { eq } from "drizzle-orm";
import { getTwoFactorConfirmationByUserId } from "./data/twoFactor-confirmation";

// Update this type to include isTwoFactorEnabled
export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (!user.id) {
        throw new Error("User Id is required");
      }
      await db
        .update(usersTable)
        .set({ emailVerified: new Date() })
        .where(eq(usersTable.id, user.id));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) {
        throw new Error("Id Does not exist for this user");
      }
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;

        await db
          .delete(TwoFactorConfirmationTable)
          .where(eq(TwoFactorConfirmationTable.id, twoFactorConfirmation.id));
      }
      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"; // Fixed this line
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: usersTable,
    accountsTable: accountsTable,
    verificationTokensTable: verificationTokensTable,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
});
