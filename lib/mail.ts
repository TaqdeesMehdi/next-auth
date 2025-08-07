import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirm_link = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onBoarding@resend.dev",
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Click <a href="${confirm_link}">here</a> to confirm email</p>`,
  });
};
