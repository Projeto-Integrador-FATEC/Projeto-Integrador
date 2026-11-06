import { NextResponse } from "next/server";
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
