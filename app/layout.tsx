import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { db } from "@/db/index";
import { usersTable } from "@/db/schema";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Next Auth ",
  description: "Practice of the Next Auth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await db.select().from(usersTable);
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
