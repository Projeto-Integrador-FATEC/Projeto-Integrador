import { validateCreateCourse } from "@/app/DTOs/create-course.dto";
import { HttpError } from "@/lib/http-error";
import { CreateCourseData } from "@/models/course.model";

async function readPart(value: FormDataEntryValue | null): Promise<string | null> {
  if (value === null) {
    return null;
  }

  return typeof value === "string" ? value : value.text();
}

export async function parseCourseForm(formData: FormData): Promise<CreateCourseData> {
  const cursoPart = await readPart(formData.get("curso"));

  if (!cursoPart) {
    throw new HttpError("Dados do curso não informados", 400);
  }

  let curso: Record<string, unknown>;

  try {
    curso = JSON.parse(cursoPart);
  } catch {
    throw new HttpError("Dados do curso inválidos", 400);
  }

  const categoriaPart = await readPart(formData.get("categoria_id"));
  const categoriaId = categoriaPart?.trim() ? categoriaPart.trim() : curso.categoria_id ?? null;
  const validation = validateCreateCourse({ ...curso, categoria_id: categoriaId });

  if (!validation.success) {
    throw new HttpError(validation.error.errors[0].message, 400);
  }

  const imagem = formData.get("imagem");

  return {
    ...validation.data,
    image: imagem instanceof File ? imagem : null,
  };
}
