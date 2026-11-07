import { EmailRecipient } from "@/models/email.model";

export interface IEmailService {
  sendVerificationEmail(recipient: EmailRecipient, url: string): Promise<void>;
}
