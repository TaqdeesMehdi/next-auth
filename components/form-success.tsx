import { CheckCircleIcon } from "lucide-react";

type Props = {
  message?: string;
};
export const FormSuccess = ({ message }: Props) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center text-emerald-500 gap-x-2 text-sm ">
      <CheckCircleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
