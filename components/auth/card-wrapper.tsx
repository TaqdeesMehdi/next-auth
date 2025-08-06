"use client";

import { Header } from "./header";
import { Social } from "./social";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  HeaderLabel: string;
  BackButtonHref: string;
  BackButtonLabel: string;
  showSocial?: boolean;
}
export const CardWrapper = ({
  children,
  HeaderLabel,
  BackButtonHref,
  BackButtonLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={HeaderLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>back button</CardFooter>
    </Card>
  );
};
