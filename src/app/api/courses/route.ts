import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { createCourseService } from "@/services/create-course-service";
import { validateCreateCourse } from "@/app/DTOs/create-course.dto";
import { getCoursesService } from "@/services/get-courses-service";

export async function GET() {
  try {
    const courses = await getCoursesService();
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("Erro ao buscar cursos:", error.response?.data);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

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
    
    const categoriaIdValue = formData.get("categoria_id") as string | null;
    let categoriaId: number | null = null;
    
    if (categoriaIdValue && categoriaIdValue !== "") {
      const parsed = Number.parseInt(categoriaIdValue, 10);
      categoriaId = isNaN(parsed) ? null : parsed;
    }else{
      categoriaId = 0;
    }
    
    const courseData = {
      nome: formData.get("name") as string,
      descricao: formData.get("description") as string,
      cargaHoraria: Number(formData.get("workload")),
      nivel: formData.get("level") as "iniciante" | "intermediario" | "avancado",
      image: formData.get("image") as File,
      provider: formData.get("provider") as string,
      url: formData.get("url") as string,
      categoria_id: categoriaId,
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
  } catch (error: any) {
    console.error("Erro ao criar curso:", error.response?.data);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}