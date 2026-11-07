export interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  name: string;
  email: string;
}
