import React from "react";
import { Navbar } from "./_components/navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-10 bg-[url(/bg2.svg)] lg:bg-contain bg-cover">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
