import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await modules.services.user.authenticate(email, password);

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = await modules.services.token.generate(user.email, user.role);

    return NextResponse.json({ ...user, token });
  } catch (error) {
    return toErrorResponse(error, "Erro ao fazer login");
  }
}
