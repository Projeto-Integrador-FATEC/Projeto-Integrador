import { Prisma, User as PrismaUser } from "@/generated/prisma/client";
import { Course } from "@/models/course.model";
import { User } from "@/models/user.model";

export const courseInclude = { categoria: true } satisfies Prisma.CursoInclude;

type CourseRow = Prisma.CursoGetPayload<{ include: typeof courseInclude }>;

export function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    cargaHoraria: row.cargaHoraria,
    nivel: row.nivel,
    provider: row.provider,
    url: row.url,
    imagemPath: row.imagemPath,
    categoria: row.categoria,
    categoria_id: row.categoriaId,
  };
}

export function toUser(row: PrismaUser): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}
