import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  href: string;
  label: string;
};
export const BackButton = ({ href, label }: Props) => {
  return (
    <Button variant="reverse" size="sm" className="font-normal w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
