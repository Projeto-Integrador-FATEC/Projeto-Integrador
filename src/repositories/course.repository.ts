import { prisma } from "@/lib/prisma";
import { Course, SaveCourseData } from "@/models/course.model";
import { ICourseRepository } from "./interfaces/course-repository.interface";
import { courseInclude, toCourse } from "./mappers";

export class CourseRepository implements ICourseRepository {
  async findAll(): Promise<Course[]> {
    const rows = await prisma.curso.findMany({ include: courseInclude, orderBy: { id: "asc" } });
    return rows.map(toCourse);
  }

  async findById(id: number): Promise<Course | null> {
    const row = await prisma.curso.findUnique({ where: { id }, include: courseInclude });
    return row ? toCourse(row) : null;
  }

  async findByCategoryId(categoryId: number): Promise<Course[]> {
    const rows = await prisma.curso.findMany({
      where: { categoriaId: categoryId },
      include: courseInclude,
      orderBy: { id: "asc" },
    });
    return rows.map(toCourse);
  }

  async create(data: SaveCourseData): Promise<Course> {
    const row = await prisma.curso.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        nivel: data.nivel,
        provider: data.provider,
        url: data.url,
        imagemPath: data.imagemPath ?? null,
        categoriaId: data.categoria_id ?? null,
      },
      include: courseInclude,
    });
    return toCourse(row);
  }
}
