import { Resend } from "resend";

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Study Lovers <onboarding@resend.dev>";

let client: Resend | undefined;

export function getResend(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);

  return client;
}
