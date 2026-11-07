import { EMAIL_FROM, getResend } from "@/lib/resend";
import { SendEmailData } from "@/models/email.model";
import { IEmailRepository } from "./interfaces/email-repository.interface";

export class EmailRepository implements IEmailRepository {
  async send(data: SendEmailData): Promise<void> {
    const { error } = await getResend().emails.send({ from: EMAIL_FROM, ...data });

    if (error) {
      throw error;
    }
  }
}
