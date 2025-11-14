import { NextRequest, NextResponse } from "next/server";
import { createCommentsService } from "@/services/create-comments-service";

export async function POST(request: NextRequest) {
  
    try {
    const body = await request.json();
    const { texto, email, cursoId } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Usuário não informado." },
        { status: 400 }
      );
    }

    if (!cursoId) {
      return NextResponse.json(
        { error: "ID do curso não informado." },
        { status: 400 }
      );
    }

    if (!texto) {
      return NextResponse.json(
        { error: "Texto do comentário não informado." },
        { status: 400 }
      );
    }
            
    // Chama o service para cadastrar o comentário
    const comentario = await createCommentsService({ cursoId, emailUsuario : email, texto });

    return NextResponse.json({
      success: true,
      data: comentario
    });

  } catch (error) {
    console.log("Erro ao cadastrar comentário", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
