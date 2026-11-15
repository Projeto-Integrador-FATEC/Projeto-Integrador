import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const mine = await modules.services.adminRequest.getMine(user.id);
    return NextResponse.json(mine);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar chamado");
  }
}
