import { NextResponse } from "next/server";
import { donationService } from "@/services/donationService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, valor, cursoId, mensagem } = body;

    // Validações básicas
    if (!nome || !email || !valor || !cursoId) {
      return NextResponse.json(
        { message: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    const donation = await donationService.create({
      nome,
      email,
      valor: parseFloat(valor),
      cursoId: parseInt(cursoId),
      mensagem: mensagem || "",
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Erro ao processar a doação" },
      { status: 500 }
    );
  }
} 