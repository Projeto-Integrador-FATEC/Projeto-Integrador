import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ cursoId: string }> }) {
  try {
    const { cursoId } = await params;
    const average = await modules.services.rating.getAverageByCourseId(Number(cursoId));
    return NextResponse.json(average);
  } catch (error) {
    return toErrorResponse(error, "Erro ao calcular média das avaliações");
  }
}
