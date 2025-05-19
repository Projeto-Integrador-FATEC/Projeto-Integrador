import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { createCourseService } from "@/services/create-course-service";
import { validateCreateCourse } from "@/app/DTOs/create-course.dto";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const courseData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      workload: Number(formData.get("workload")),
      level: formData.get("level") as "iniciante" | "intermediario" | "avancado",
      image: formData.get("image") as File,
    };

    const validation = validateCreateCourse(courseData);

    if (!validation.success) {
      console.log("validation.error.errors", validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    await createCourseService(validation.data);

    return NextResponse.json(
      { message: "Curso criado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}