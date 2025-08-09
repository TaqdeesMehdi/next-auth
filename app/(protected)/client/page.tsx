"use client";
import React from "react";
import { UserInfo } from "../_components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ServerPage = () => {
  const user = useCurrentUser();
  return <UserInfo user={user} label="🥸Client Component" />;
};

export default ServerPage;
