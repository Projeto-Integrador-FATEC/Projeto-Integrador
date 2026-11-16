import { NextResponse } from "next/server";
import { validateReviewAdminRequest } from "@/app/DTOs/admin-request.dto";
import { requireSeedAdmin } from "@/lib/auth-guard";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const reviewer = await requireSeedAdmin(request);
    const { id } = await params;
    const requestId = Number(id);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      throw new HttpError("Chamado inválido", 400);
    }

    const body = await request.json();
    const validation = validateReviewAdminRequest(body);

    if (!validation.success) {
      throw new HttpError(validation.error.errors[0].message, 400);
    }

    const reviewed = await modules.services.adminRequest.review(
      requestId,
      reviewer.id,
      validation.data
    );

    return NextResponse.json(reviewed);
  } catch (error) {
    return toErrorResponse(error, "Erro ao analisar chamado");
  }
}
