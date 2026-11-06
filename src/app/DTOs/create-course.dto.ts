import { z } from "zod";

export const createCourseSchema = z.object({
  nome: z.string({ required_error: "O nome do curso é obrigatório" })
    .min(3, "O nome do curso deve ter pelo menos 3 caracteres")
    .max(100, "O nome do curso deve ter no máximo 100 caracteres"),
  descricao: z.string({ required_error: "A descrição é obrigatória" })
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(1000, "A descrição deve ter no máximo 1000 caracteres"),
  cargaHoraria: z.coerce.number({ invalid_type_error: "Carga horária inválida" })
    .int("A carga horária deve ser um número inteiro")
    .min(1, "A carga horária deve ser maior que 0")
    .max(1000, "A carga horária deve ser menor que 1000 horas"),
  nivel: z.enum(["iniciante", "intermediario", "avancado"], {
    errorMap: () => ({ message: "Nível inválido" })
  }),
  provider: z.string({ required_error: "O fornecedor do curso é obrigatório" })
    .min(1, "O fornecedor do curso é obrigatório"),
  url: z.string({ required_error: "A URL do curso é obrigatória" })
    .url("URL inválida"),
  categoria_id: z.coerce.number().int().nullable().default(null),
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;

export const validateCreateCourse = (data: unknown) => {
  return createCourseSchema.safeParse(data);
};
