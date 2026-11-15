import { Prisma, User as PrismaUser } from "@/generated/prisma/client";
import { AdminRequest, AdminRequestStatus } from "@/models/admin-request.model";
import { Course } from "@/models/course.model";
import { User } from "@/models/user.model";

export const courseInclude = {
  categoria: true,
  responsaveis: { select: { userId: true } },
} satisfies Prisma.CursoInclude;

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
    responsavelIds: row.responsaveis.map((item) => item.userId),
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

export const adminRequestInclude = {
  user: { select: { name: true, email: true } },
} satisfies Prisma.SolicitacaoAdminInclude;

type AdminRequestRow = Prisma.SolicitacaoAdminGetPayload<{ include: typeof adminRequestInclude }>;

export function toAdminRequest(row: AdminRequestRow): AdminRequest {
  return {
    id: row.id,
    justificativa: row.justificativa,
    status: row.status as AdminRequestStatus,
    userId: row.userId,
    userName: row.user.name,
    userEmail: row.user.email,
    reviewedById: row.reviewedById,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
