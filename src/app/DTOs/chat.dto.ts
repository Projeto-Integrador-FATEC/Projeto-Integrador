import { z } from "zod";

export const chatRequestSchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"], {
            errorMap: () => ({ message: "Papel da mensagem inválido" }),
          }),
          content: z
            .string({ required_error: "A mensagem é obrigatória" })
            .trim()
            .min(1, "A mensagem não pode ficar vazia")
            .max(2000, "A mensagem deve ter no máximo 2000 caracteres"),
        }),
      )
      .min(1, "Envie uma mensagem")
      .max(20, "A conversa passou do limite de mensagens"),
  })
  .refine((data) => data.messages.at(-1)?.role === "user", {
    message: "A última mensagem deve ser a pergunta",
  });

export const validateChatRequest = (data: unknown) => {
  return chatRequestSchema.safeParse(data);
};
