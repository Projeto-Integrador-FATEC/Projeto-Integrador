import { NextResponse } from "next/server";
import CreateUserService from "@/services/create-user-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const response = await CreateUserService(email, password, name);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Erro ao criar usuário -- servidor" },
      { status: error.response?.status || 500 }
    );
  }
} 