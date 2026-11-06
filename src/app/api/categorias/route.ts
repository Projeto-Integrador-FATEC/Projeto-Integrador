import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET() {
  try {
    const categories = await modules.services.category.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar categorias");
  }
}
