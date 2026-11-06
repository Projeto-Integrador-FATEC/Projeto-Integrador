import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ categoriaId: string }> }) {
  try {
    const { categoriaId } = await params;
    const courses = await modules.services.category.getCoursesByCategory(Number(categoriaId));
    return NextResponse.json(courses);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar cursos da categoria");
  }
}
