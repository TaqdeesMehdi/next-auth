import { CardWrapper } from "./card-wrapper";

export const LoginForm = () => {
  return (
    <CardWrapper
      HeaderLabel="Welcome Back!"
      BackButtonHref="/auth/register"
      BackButtonLabel="Don't have an account yet?"
      showSocial
    >
      Login Form
    </CardWrapper>
  );
};
