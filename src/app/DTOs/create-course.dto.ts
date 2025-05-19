import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string()
    .min(3, "O nome do curso deve ter pelo menos 3 caracteres")
    .max(100, "O nome do curso deve ter no máximo 100 caracteres"),
  description: z.string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(1000, "A descrição deve ter no máximo 1000 caracteres"),
  workload: z.number()
    .min(1, "A carga horária deve ser maior que 0")
    .max(1000, "A carga horária deve ser menor que 1000 horas"),
  level: z.enum(["iniciante", "intermediario", "avancado"], {
    errorMap: () => ({ message: "Nível inválido" })
  }),
  image: z.instanceof(File).optional(),
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;

export const validateCreateCourse = (data: unknown) => {
  return createCourseSchema.safeParse(data);
}; 