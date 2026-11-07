import { EmailRecipient } from "@/models/email.model";
import { IEmailRepository } from "@/repositories/interfaces/email-repository.interface";
import { IEmailService } from "./interfaces/email-service.interface";

export class EmailService implements IEmailService {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async sendVerificationEmail({ name, email }: EmailRecipient, url: string): Promise<void> {
    await this.emailRepository.send({
      to: email,
      subject: "Confirme seu e-mail - Study Lovers",
      text: `Olá, ${name}! Confirme seu e-mail acessando o link: ${url}`,
      html: `
        <p>Olá, ${escapeHtml(name)}!</p>
        <p>Obrigado por se cadastrar no Study Lovers. Clique no botão abaixo para confirmar seu e-mail:</p>
        <p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
            Confirmar e-mail
          </a>
        </p>
        <p>Se o botão não funcionar, copie e cole este link no navegador:<br />${url}</p>
        <p>Se você não criou uma conta, ignore este e-mail.</p>
      `,
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
