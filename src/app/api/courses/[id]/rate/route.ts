import { NextRequest, NextResponse } from "next/server";
import { rateCourseService } from "@/services/rate-course-service";

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { nota, email } = body;

    console.log("body", body);

    // Aguardando os params de forma assíncrona
    const { id } = await context.params;
    const cursoId = id;

    if (!nota || typeof nota !== "number" || nota < 1 || nota > 10) {
      return NextResponse.json(
        { error: "Nota inválida. Envie um número de 1 a 10." },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Usuário não informado." },
        { status: 400 }
      );
    }

    // Chama o service para cadastrar a avaliação
    const avaliacao = await rateCourseService({ cursoId, email, nota });

    return NextResponse.json({
      success: true,
      data: avaliacao
    });

  } catch (error) {
    console.log("Erro ao cadastrar avaliação", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
