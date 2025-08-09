"use server";

import { currentRoleServer } from "@/lib/auth";

export const admin = async () => {
  const role = await currentRoleServer();

  if (role === "ADMIN") {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
};
