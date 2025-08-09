import { currentUserServer } from "@/lib/auth";
import React from "react";
import { UserInfo } from "../_components/user-info";

const ServerPage = async () => {
  const user = await currentUserServer();
  return <UserInfo user={user} label="🤖Server Component" />;
};

export default ServerPage;
