import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await modules.services.user.login(email, password);

    if (!result) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, "Erro ao fazer login");
  }
}
