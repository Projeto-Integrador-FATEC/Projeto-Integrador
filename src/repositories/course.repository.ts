import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Course, CourseSearchFilters, CourseSearchResult, SaveCourseData } from "@/models/course.model";
import { ICourseRepository } from "./interfaces/course-repository.interface";
import { courseInclude, toCourse } from "./mappers";

const ACCENTED = "áàâãäéèêëíìîïóòôõöúùûüçñ";
const PLAIN = "aaaaaeeeeiiiiooooouuuucn";

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

  async search(filters: CourseSearchFilters): Promise<CourseSearchResult> {
    const conditions: Prisma.Sql[] = [];

    if (filters.termo) {
      const pattern = `%${escapeLike(fold(filters.termo))}%`;
      conditions.push(Prisma.sql`(
        ${folded("nome")} LIKE ${pattern}
        OR ${folded("descricao")} LIKE ${pattern}
        OR ${folded("provider")} LIKE ${pattern}
      )`);
    }

    if (filters.nivel) {
      conditions.push(Prisma.sql`${folded("nivel")} = ${fold(filters.nivel)}`);
    }

    if (typeof filters.categoriaId === "number") {
      conditions.push(Prisma.sql`categoria_id = ${filters.categoriaId}`);
    }

    const where = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

    const countRows = await prisma.$queryRaw<Array<{ total: number }>>`
      SELECT COUNT(*)::int AS total FROM cursos ${where}
    `;
    const total = Number(countRows[0]?.total ?? 0);

    const idRows = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM cursos ${where}
      ORDER BY nome ASC
      LIMIT ${filters.limite}
    `;

    if (idRows.length === 0) {
      return { total, courses: [] };
    }

    const rows = await prisma.curso.findMany({
      where: { id: { in: idRows.map((row) => row.id) } },
      include: courseInclude,
    });
    const byId = new Map(rows.map((row) => [row.id, row]));

    return {
      total,
      courses: idRows.flatMap((row) => {
        const course = byId.get(row.id);
        return course ? [toCourse(course)] : [];
      }),
    };
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

function folded(column: "nome" | "descricao" | "provider" | "nivel"): Prisma.Sql {
  return Prisma.sql`translate(lower(${Prisma.raw(column)}), ${ACCENTED}, ${PLAIN})`;
}

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}
