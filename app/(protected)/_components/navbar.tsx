"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary-background flex items-center justify-between p-4 rounded-xl shadow-sm w-[600px]">
      <div className="flex gap-x-4">
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "reverse"}
        >
          <Link href="/settings">SETTINGS</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "reverse"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "reverse"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "reverse"}>
          <Link href="/admin">ADMIN</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
