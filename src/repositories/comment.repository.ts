import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Comment } from "@/models/comment.model";
import { ICommentRepository } from "./interfaces/comment-repository.interface";
import { courseInclude, toCourse, toUser } from "./mappers";

const commentInclude = {
  user: true,
  curso: { include: courseInclude },
} satisfies Prisma.ComentarioInclude;

type CommentRow = Prisma.ComentarioGetPayload<{ include: typeof commentInclude }>;

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    texto: row.texto,
    date: row.date,
    user: toUser(row.user),
    curso: toCourse(row.curso),
  };
}

export class CommentRepository implements ICommentRepository {
  async findById(id: number): Promise<Comment | null> {
    const row = await prisma.comentario.findUnique({ where: { id }, include: commentInclude });
    return row ? toComment(row) : null;
  }

  async findByCourseId(courseId: number): Promise<Comment[]> {
    const rows = await prisma.comentario.findMany({
      where: { cursoId: courseId },
      include: commentInclude,
      orderBy: { date: "asc" },
    });
    return rows.map(toComment);
  }

  async create(data: { texto: string; cursoId: number; userId: number }): Promise<Comment> {
    const row = await prisma.comentario.create({ data, include: commentInclude });
    return toComment(row);
  }
}
