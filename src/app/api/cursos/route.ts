import { NextResponse } from "next/server";
import { validateCreateCourse } from "@/app/DTOs/create-course.dto";
import { requireRole } from "@/lib/auth-guard";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

async function readPart(value: FormDataEntryValue | null): Promise<string | null> {
  if (value === null) {
    return null;
  }

  return typeof value === "string" ? value : value.text();
}

export async function GET() {
  try {
    const courses = await modules.services.course.getAll();
    return NextResponse.json(courses);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar cursos");
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(request, "ADMIN");

    const formData = await request.formData();
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

    const course = await modules.services.course.create({
      ...validation.data,
      image: imagem instanceof File ? imagem : null,
    });

    return NextResponse.json(course);
  } catch (error) {
    return toErrorResponse(error, "Erro ao cadastrar curso");
  }
}
