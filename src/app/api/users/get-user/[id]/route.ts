import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await modules.services.user.getById(Number(id));
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar usuário");
  }
}
