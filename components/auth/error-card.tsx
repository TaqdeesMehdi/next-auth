import { FaExclamationTriangle } from "react-icons/fa";
import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      HeaderLabel="Oops! Something went wrong!"
      BackButtonHref="/auth/login"
      BackButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-red-500" />
      </div>
    </CardWrapper>
  );
};
