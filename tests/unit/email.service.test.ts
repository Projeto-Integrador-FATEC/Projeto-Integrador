import { EmailService } from "@/services/email.service";
import { describe, expect, it, vi } from "vitest";

describe("EmailService", () => {
  it("envia o e-mail de verificação com o nome escapado", async () => {
    const repository = { send: vi.fn().mockResolvedValue(undefined) };
    const service = new EmailService(repository);
    const url = "http://localhost/email-verificado?token=1";

    await service.sendVerificationEmail({ name: `Ana <script>alert("x")</script>`, email: "ana@fatec.sp.gov.br" }, url);

    expect(repository.send).toHaveBeenCalledTimes(1);
    const message = repository.send.mock.calls[0][0];
    expect(message.to).toBe("ana@fatec.sp.gov.br");
    expect(message.subject).toBe("Confirme seu e-mail - Study Lovers");
    expect(message.text).toContain(url);
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).not.toContain("<script>");
  });
});
