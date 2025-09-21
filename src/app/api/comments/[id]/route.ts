import { NextResponse } from "next/server";
import { getCourseComments } from "@/services/get-course-comments";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

    try {
      const courses = await getCourseComments(id);
      console.log("courses", courses);
      return NextResponse.json(courses);
    } catch (error: any) {
      console.error("Erro ao buscar comentários:", error.response?.data);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  }