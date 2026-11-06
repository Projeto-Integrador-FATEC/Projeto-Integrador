import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET() {
  try {
    const users = await modules.services.user.getAll();
    return NextResponse.json(users);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar usuários");
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const user = await modules.services.user.create({ name, email, password });
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error, "Erro ao criar usuário");
  }
}
