import { db } from "@/db";
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserById } from "./data/user";
import {
  accountsTable,
  usersTable,
  verificationTokensTable,
} from "./db/schema";
import { eq } from "drizzle-orm";
export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
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
      //TODO: Add 2fa check
      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
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
