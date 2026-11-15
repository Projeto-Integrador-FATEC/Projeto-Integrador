import { NextResponse } from "next/server";
import { validateCreateAdminRequest } from "@/app/DTOs/admin-request.dto";
import { requireRole, requireUser } from "@/lib/auth-guard";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(request: Request) {
  try {
    await requireRole(request, "ADMIN");
    const requests = await modules.services.adminRequest.listAll();
    return NextResponse.json(requests);
  } catch (error) {
    return toErrorResponse(error, "Erro ao listar chamados");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const validation = validateCreateAdminRequest(body);

    if (!validation.success) {
      throw new HttpError(validation.error.errors[0].message, 400);
    }

    const created = await modules.services.adminRequest.create(user.id, validation.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Erro ao abrir chamado");
  }
}
