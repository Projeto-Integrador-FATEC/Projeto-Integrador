import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function POST(request: Request) {
  try {
    const { nota, email, cursoId } = await request.json();

    const rating = await modules.services.rating.create({
      nota: Number(nota),
      email,
      cursoId: Number(cursoId),
    });

    return NextResponse.json(rating);
  } catch (error) {
    return toErrorResponse(error, "Erro ao cadastrar avaliação");
  }
}
