import { SendEmailData } from "@/models/email.model";

export interface IEmailRepository {
  send(data: SendEmailData): Promise<void>;
}
