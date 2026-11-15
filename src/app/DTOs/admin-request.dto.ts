import { z } from "zod";

export const createAdminRequestSchema = z.object({
  justificativa: z
    .string({ required_error: "A justificativa é obrigatória" })
    .trim()
    .min(20, "A justificativa deve ter pelo menos 20 caracteres")
    .max(1000, "A justificativa deve ter no máximo 1000 caracteres"),
});

export const reviewAdminRequestSchema = z.object({
  status: z.enum(["APROVADA", "RECUSADA"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
});

export const validateCreateAdminRequest = (data: unknown) => {
  return createAdminRequestSchema.safeParse(data);
};

export const validateReviewAdminRequest = (data: unknown) => {
  return reviewAdminRequestSchema.safeParse(data);
};
