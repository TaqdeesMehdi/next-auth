import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const reset_link = `http://localhost:3000/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${reset_link}">here</a> to change your password</p>`,
  });
};
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirm_link = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Click <a href="${confirm_link}">here</a> to confirm email</p>`,
  });
};
