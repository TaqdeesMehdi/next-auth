import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
  message?: string;
};
export const FormError = ({ message }: Props) => {
  if (!message) return null;
  return (
    <div className="bg-red-500/15 p-3 rounded-md flex items-center text-red-500 gap-x-2 text-sm ">
      <FaExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
