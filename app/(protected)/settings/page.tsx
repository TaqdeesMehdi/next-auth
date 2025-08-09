"use client";

// import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
  const user = useCurrentUser();
  const onClick = () => {
    signOut();
  };
  return (
    <div>
      <Button onClick={onClick} type="submit" size="lg">
        Sign Out
      </Button>
    </div>
  );
};

export default SettingsPage;
