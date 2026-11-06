import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ cursoId: string }> }) {
  try {
    const { cursoId } = await params;
    const comments = await modules.services.comment.getByCourseId(Number(cursoId));
    return NextResponse.json(comments);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar comentários");
  }
}
