import { NextResponse } from "next/server";
import { getCourseDetailsService } from "@/services/get-course-details-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const course = await getCourseDetailsService(Number(id));
    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do curso:", error.response?.data);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 