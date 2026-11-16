import { NextResponse } from "next/server";
import { parseCourseForm } from "@/app/api/cursos/parse-course-form";
import { requireRole } from "@/lib/auth-guard";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = await modules.services.course.getById(Number(id));
    return NextResponse.json(course);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar detalhes do curso");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(request, "ADMIN");
    const { id } = await params;
    const data = await parseCourseForm(await request.formData());
    const course = await modules.services.course.update(Number(id), data, user.id);
    return NextResponse.json(course);
  } catch (error) {
    return toErrorResponse(error, "Erro ao atualizar curso");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(request, "ADMIN");
    const { id } = await params;
    await modules.services.course.delete(Number(id), user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error, "Erro ao excluir curso");
  }
}
