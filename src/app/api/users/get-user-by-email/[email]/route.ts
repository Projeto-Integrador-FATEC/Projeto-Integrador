import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;
    const user = await modules.services.user.getByEmail(decodeURIComponent(email));
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar usuário");
  }
}
