import { NextResponse } from "next/server";
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
