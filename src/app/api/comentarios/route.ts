import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function POST(request: Request) {
  try {
    const { texto, cursoId, emailUsuario } = await request.json();

    const comment = await modules.services.comment.create({
      texto,
      cursoId: Number(cursoId),
      emailUsuario,
    });

    return NextResponse.json(comment);
  } catch (error) {
    return toErrorResponse(error, "Erro ao cadastrar comentário");
  }
}
