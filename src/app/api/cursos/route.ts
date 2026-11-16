import { NextResponse } from "next/server";
import { parseCourseForm } from "@/app/api/cursos/parse-course-form";
import { requireRole } from "@/lib/auth-guard";
import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET() {
  try {
    const courses = await modules.services.course.getAll();
    return NextResponse.json(courses);
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar cursos");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "ADMIN");
    const data = await parseCourseForm(await request.formData());
    const course = await modules.services.course.create(data, user.id);
    return NextResponse.json(course);
  } catch (error) {
    return toErrorResponse(error, "Erro ao cadastrar curso");
  }
}
